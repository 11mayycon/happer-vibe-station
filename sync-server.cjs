const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const app = express();
const PORT = process.env.SYNC_PORT || 5000;

// Configuração da Evolution API
const EVOLUTION_API_URL = 'https://evo.inovapro.cloud';
const EVOLUTION_API_KEY = 'BQYHJGJHJ';
const EVOLUTION_INSTANCE = 'pdv-inovapro';


// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do Linx
const LINX_IP = process.env.LINX_IP || '192.168.1.100';
const LINX_PORT = process.env.LINX_PORT || '5050';
const LINX_URL = `http://${LINX_IP}:${LINX_PORT}`;

// Middleware
app.use(express.json());

// Configuração de logs
const LOG_DIR = '/var/log';
const LOG_FILE = path.join(LOG_DIR, 'caminhocerto_sync.log');

// Função para criar log
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  try {
    await fsPromises.appendFile(LOG_FILE, logMessage);
    console.log(logMessage.trim());
  } catch (error) {
    console.error('Erro ao escrever log:', error);
  }
}

// Função para criar tabelas de sincronização se não existirem
async function createSyncTables() {
  try {
    // Tabela de sincronizações (histórico)
    const { error: syncError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'sincronizacoes')
      .single();

    if (syncError && syncError.code === 'PGRST116') {
      // Tabela não existe, criar
      const { error: createSyncError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE sincronizacoes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tipo TEXT NOT NULL, -- 'venda_linx', 'venda_cc'
            origem TEXT NOT NULL, -- 'linx', 'caminhocerto'
            destino TEXT NOT NULL, -- 'caminhocerto', 'linx'
            dados JSONB NOT NULL,
            status TEXT DEFAULT 'processado', -- 'processado', 'erro'
            erro TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_sincronizacoes_tipo ON sincronizacoes(tipo);
          CREATE INDEX IF NOT EXISTS idx_sincronizacoes_origem ON sincronizacoes(origem);
          CREATE INDEX IF NOT EXISTS idx_sincronizacoes_created_at ON sincronizacoes(created_at);
        `
      });

      if (createSyncError) {
        await log(`Erro ao criar tabela sincronizacoes: ${createSyncError.message}`, 'ERROR');
      } else {
        await log('Tabela sincronizacoes criada com sucesso', 'INFO');
      }
    }

    // Tabela de sincronização pendente (fila)
    const { error: pendingError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'sincronizacao_pendente')
      .single();

    if (pendingError && pendingError.code === 'PGRST116') {
      // Tabela não existe, criar
      const { error: createPendingError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE sincronizacao_pendente (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tipo TEXT NOT NULL, -- 'venda_cc_para_linx'
            dados JSONB NOT NULL,
            tentativas INTEGER DEFAULT 0,
            max_tentativas INTEGER DEFAULT 3,
            proximo_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_sincronizacao_pendente_proximo_envio ON sincronizacao_pendente(proximo_envio);
          CREATE INDEX IF NOT EXISTS idx_sincronizacao_pendente_tentativas ON sincronizacao_pendente(tentativas);
        `
      });

      if (createPendingError) {
        await log(`Erro ao criar tabela sincronizacao_pendente: ${createPendingError.message}`, 'ERROR');
      } else {
        await log('Tabela sincronizacao_pendente criada com sucesso', 'INFO');
      }
    }

    await log('Verificação/criação de tabelas concluída', 'INFO');
  } catch (error) {
    await log(`Erro ao criar tabelas de sincronização: ${error.message}`, 'ERROR');
  }
}

// Função para buscar produto por código de barras
async function findProductByBarcode(codigoBarras) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('codigo_barras', codigoBarras)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    await log(`Erro ao buscar produto ${codigoBarras}: ${error.message}`, 'ERROR');
    return null;
  }
}

// Função para atualizar estoque do produto
async function updateProductStock(productId, quantidadeReduzir, motivo = 'Venda Linx') {
  try {
    // Buscar estoque atual
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('quantidade_estoque, nome')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const novoEstoque = Math.max(0, product.quantidade_estoque - quantidadeReduzir);

    // Atualizar estoque
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        quantidade_estoque: novoEstoque,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) throw updateError;

    // Registrar movimento de estoque
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        product_id: productId,
        tipo: 'saida',
        quantidade: -quantidadeReduzir,
        motivo: motivo
      });

    if (movementError) throw movementError;

    await log(`Estoque atualizado: ${product.nome} - Reduzido ${quantidadeReduzir} unidades (${product.quantidade_estoque} → ${novoEstoque})`);
    
    return { success: true, estoqueAnterior: product.quantidade_estoque, novoEstoque };
  } catch (error) {
    await log(`Erro ao atualizar estoque do produto ${productId}: ${error.message}`, 'ERROR');
    return { success: false, error: error.message };
  }
}

// Função para registrar sincronização
async function registerSync(tipo, origem, destino, dados, status = 'processado', erroDetalhes = null) {
  try {
    const { error } = await supabase
      .from('sincronizacoes')
      .insert({
        tipo,
        origem,
        destino,
        dados,
        status,
        erro_detalhes: erroDetalhes
      });

    if (error) throw error;
  } catch (error) {
    await log(`Erro ao registrar sincronização: ${error.message}`, 'ERROR');
  }
}

// Endpoint principal: Receber vendas do Linx
app.post('/sync/linx-sale', async (req, res) => {
  try {
    const vendaData = req.body;
    await log(`Recebida venda do Linx: ${JSON.stringify(vendaData)}`);

    // Validar estrutura da venda
    if (!vendaData.items || !Array.isArray(vendaData.items)) {
      throw new Error('Estrutura de venda inválida: items não encontrado ou não é array');
    }

    const resultados = [];

    // Processar cada item da venda
    for (const item of vendaData.items) {
      const { codigo_barras, quantidade, nome_produto } = item;

      if (!codigo_barras || !quantidade) {
        await log(`Item inválido ignorado: ${JSON.stringify(item)}`, 'WARN');
        continue;
      }

      // Buscar produto no banco
      const produto = await findProductByBarcode(codigo_barras);
      
      if (!produto) {
        await log(`Produto não encontrado: ${codigo_barras} - ${nome_produto}`, 'WARN');
        resultados.push({
          codigo_barras,
          status: 'produto_nao_encontrado',
          message: `Produto ${codigo_barras} não encontrado no sistema`
        });
        continue;
      }

      // Atualizar estoque
      const resultado = await updateProductStock(
        produto.id, 
        quantidade, 
        `Venda Linx - ${vendaData.source || 'linx'}`
      );

      resultados.push({
        codigo_barras,
        nome_produto: produto.nome,
        quantidade_reduzida: quantidade,
        estoque_anterior: resultado.estoqueAnterior,
        novo_estoque: resultado.novoEstoque,
        status: resultado.success ? 'sucesso' : 'erro',
        erro: resultado.error
      });
    }

    // Registrar sincronização
    await registerSync('venda_linx', 'linx', 'caminhocerto', vendaData);

    await log(`Venda do Linx processada com sucesso. ${resultados.length} itens processados`);

    res.json({
      success: true,
      message: 'Venda sincronizada com sucesso',
      resultados
    });

  } catch (error) {
    await log(`Erro ao processar venda do Linx: ${error.message}`, 'ERROR');
    
    // Registrar erro na sincronização
    await registerSync('venda_linx', 'linx', 'caminhocerto', req.body, 'erro', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Função para enviar venda para o Linx
async function sendSaleToLinx(saleData) {
  try {
    const response = await axios.post(`${LINX_URL}/sync/cc-sale`, saleData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await log(`Venda enviada para Linx com sucesso: ${saleData.id}`);
    return { success: true, response: response.data };
  } catch (error) {
    await log(`Erro ao enviar venda para Linx: ${error.message}`, 'ERROR');
    return { success: false, error: error.message };
  }
}

// Função para processar vendas locais e enviar para o Linx
async function processPendingSales() {
  try {
    // Buscar vendas pendentes
    const { data: pendingSales, error } = await supabase
      .from('sincronizacao_pendente')
      .select('*')
      .lte('proximo_envio', new Date().toISOString())
      .lt('tentativas', 5)
      .order('created_at');

    if (error) throw error;

    for (const pendingSale of pendingSales || []) {
      const result = await sendSaleToLinx(pendingSale.dados);
      
      if (result.success) {
        // Remover da fila de pendentes
        await supabase
          .from('sincronizacao_pendente')
          .delete()
          .eq('id', pendingSale.id);

        // Registrar sincronização bem-sucedida
        await registerSync('venda_cc', 'caminhocerto', 'linx', pendingSale.dados);
      } else {
        // Incrementar tentativas e reagendar
        const novasTentativas = pendingSale.tentativas + 1;
        const proximoEnvio = new Date();
        proximoEnvio.setMinutes(proximoEnvio.getMinutes() + (novasTentativas * 5)); // Backoff exponencial

        if (novasTentativas >= 5) {
          // Máximo de tentativas atingido, registrar erro
          await registerSync('venda_cc', 'caminhocerto', 'linx', pendingSale.dados, 'erro', result.error);
          
          await supabase
            .from('sincronizacao_pendente')
            .delete()
            .eq('id', pendingSale.id);
        } else {
          await supabase
            .from('sincronizacao_pendente')
            .update({
              tentativas: novasTentativas,
              proximo_envio: proximoEnvio.toISOString()
            })
            .eq('id', pendingSale.id);
        }
      }
    }
  } catch (error) {
    await log(`Erro ao processar vendas pendentes: ${error.message}`, 'ERROR');
  }
}

// Endpoint para adicionar venda à fila (será chamado pelo sistema principal)
app.post('/sync/queue-sale', async (req, res) => {
  try {
    const saleData = req.body;
    
    // Tentar enviar imediatamente
    const result = await sendSaleToLinx(saleData);
    
    if (result.success) {
      // Registrar sincronização bem-sucedida
      await registerSync('venda_cc', 'caminhocerto', 'linx', saleData);
      
      res.json({
        success: true,
        message: 'Venda enviada para Linx imediatamente'
      });
    } else {
      // Adicionar à fila de pendentes
      const { error } = await supabase
        .from('sincronizacao_pendente')
        .insert({
          tipo: 'venda_cc',
          dados: saleData
        });

      if (error) throw error;

      await log(`Venda adicionada à fila de sincronização: ${saleData.id}`);
      
      res.json({
        success: true,
        message: 'Linx offline - venda adicionada à fila de sincronização'
      });
    }
  } catch (error) {
    await log(`Erro ao processar fila de venda: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para buscar produtos do Linx
app.get('/sync/linx-products', async (req, res) => {
  try {
    await log('Buscando produtos do Linx...');
    
    const response = await axios.get(`${LINX_URL}/sync/products`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await log(`Produtos do Linx obtidos com sucesso: ${response.data.length} produtos`);
    
    res.json(response.data);
  } catch (error) {
    await log(`Erro ao buscar produtos do Linx: ${error.message}`, 'ERROR');
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao conectar com o Linx para buscar produtos'
    });
  }
});

// Endpoint de status
app.get('/sync/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    linx_url: LINX_URL
  });
});

// Endpoint de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// ===================================================
// WEBHOOKS DA EVOLUTION API
// ===================================================

// Endpoint para receber webhooks da Evolution API
app.post('/api/webhooks/evolution', async (req, res) => {
  try {
    const webhookData = req.body;
    await log(`Webhook recebido da Evolution API: ${JSON.stringify(webhookData)}`);

    const { event, instance, data } = webhookData;

    // Processar diferentes tipos de eventos
    switch (event) {
      case 'messages.upsert':
      case 'send.message':
        // Mensagem recebida ou enviada
        await log(`Mensagem: ${data.key?.id} - Status: ${data.status || 'N/A'}`);

        // Registrar no Supabase
        try {
          const { error } = await supabase
            .from('whatsapp_messages')
            .insert({
              instance_name: instance,
              message_id: data.key?.id,
              from_number: data.key?.remoteJid,
              message_body: data.message?.conversation || data.message?.extendedTextMessage?.text || '',
              message_type: event,
              status: data.status || 'sent',
              timestamp: new Date(data.messageTimestamp * 1000).toISOString(),
              raw_data: data
            });

          if (error && error.code !== '42P01') { // Ignorar se tabela não existir
            await log(`Erro ao salvar mensagem: ${error.message}`, 'WARN');
          }
        } catch (dbError) {
          await log(`Erro ao processar mensagem no DB: ${dbError.message}`, 'WARN');
        }
        break;

      case 'messages.update':
      case 'send.message.update':
        // Atualização de status de mensagem (enviado, entregue, lido)
        await log(`Atualização de mensagem: ${data.key?.id} - Novo status: ${data.status}`);

        try {
          const { error } = await supabase
            .from('whatsapp_messages')
            .update({
              status: data.status,
              updated_at: new Date().toISOString()
            })
            .eq('message_id', data.key?.id);

          if (error && error.code !== '42P01') {
            await log(`Erro ao atualizar mensagem: ${error.message}`, 'WARN');
          }
        } catch (dbError) {
          await log(`Erro ao atualizar mensagem no DB: ${dbError.message}`, 'WARN');
        }
        break;

      case 'connection.update':
        // Atualização de conexão (conectado, desconectado, etc)
        await log(`Conexão atualizada: Instância ${instance} - Status: ${data.state}`);

        try {
          const { error } = await supabase
            .from('whatsapp_instances')
            .upsert({
              instance_name: instance,
              connection_status: data.state,
              last_update: new Date().toISOString()
            }, {
              onConflict: 'instance_name'
            });

          if (error && error.code !== '42P01') {
            await log(`Erro ao salvar status da instância: ${error.message}`, 'WARN');
          }
        } catch (dbError) {
          await log(`Erro ao processar conexão no DB: ${dbError.message}`, 'WARN');
        }
        break;

      case 'qrcode.updated':
        // QR Code atualizado
        await log(`QR Code atualizado para instância: ${instance}`);
        break;

      case 'instance.create':
        // Nova instância criada
        await log(`Nova instância criada: ${instance}`);
        break;

      case 'instance.delete':
        // Instância deletada
        await log(`Instância deletada: ${instance}`);
        break;

      default:
        await log(`Evento não tratado: ${event}`, 'WARN');
    }

    // Sempre responder com sucesso para evitar reenvios
    res.json({
      success: true,
      message: 'Webhook processado com sucesso',
      event,
      instance
    });

  } catch (error) {
    await log(`Erro ao processar webhook da Evolution API: ${error.message}`, 'ERROR');

    // Mesmo com erro, retornar 200 para evitar reenvios
    res.json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint de teste do webhook
app.get('/api/webhooks/evolution/test', (req, res) => {
  res.json({
    status: 'online',
    message: 'Endpoint de webhook da Evolution API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// ===================================================
// FUNÇÕES AUXILIARES EVOLUTION API
// ===================================================

// Função para enviar mensagem de texto via Evolution API
async function sendEvolutionMessage(number, message) {
  try {
    await log(`📱 Enviando mensagem via Evolution API para ${number}`);

    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        number: number,
        text: message
      },
      {
        headers: {
          'apikey': EVOLUTION_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    await log(`✅ Mensagem enviada via Evolution API: ${response.data.key?.id || 'sem ID'}`);
    return { success: true, data: response.data };
  } catch (error) {
    await log(`❌ Erro ao enviar via Evolution API: ${error.message}`, 'ERROR');
    return { success: false, error: error.message };
  }
}

// Função para enviar mensagem com mídia via Evolution API
async function sendEvolutionMedia(number, caption, mediaUrl) {
  try {
    await log(`📱 Enviando mídia via Evolution API para ${number}`);

    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`,
      {
        number: number,
        caption: caption,
        mediatype: 'document',
        media: mediaUrl
      },
      {
        headers: {
          'apikey': EVOLUTION_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    await log(`✅ Mídia enviada via Evolution API`);
    return { success: true, data: response.data };
  } catch (error) {
    await log(`❌ Erro ao enviar mídia via Evolution API: ${error.message}`, 'ERROR');
    return { success: false, error: error.message };
  }
}

// ===================================================
// ENDPOINTS PARA PDV (EVOLUTION API)
// ===================================================

// Endpoint para enviar relatório de turno via Evolution API
app.post('/evolution/send-report', async (req, res) => {
  try {
    await log('📊 Recebida requisição para enviar relatório via Evolution API');

    const {
      user,
      startTime,
      endTime,
      totalSales,
      averageTicket,
      totalAmount,
      paymentSummary,
      receiptNumber,
      whatsapp_number, // Número de WhatsApp do funcionário
      shiftDuration // Duração do turno
    } = req.body;

    // Se whatsapp_number for fornecido, enviar para o PV. Caso contrário, usar grupo
    let targetNumber;
    if (whatsapp_number) {
      // Formatar número para o WhatsApp
      let cleanNumber = whatsapp_number.replace(/\D/g, '');

      // Se não começar com 55, adicionar
      if (!cleanNumber.startsWith('55')) {
        cleanNumber = '55' + cleanNumber;
      }

      targetNumber = cleanNumber;
      await log(`📱 Enviando relatório para PV: ${whatsapp_number} -> ${targetNumber}`);
    } else {
      // Número do grupo (pode ser configurado via env) - apenas se não houver número
      targetNumber = '120363407029045754'; // ID do grupo CAMINHO CERTO
      await log(`📱 Enviando relatório para grupo: ${targetNumber}`);
    }

    const date = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const startTimeFormatted = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    const endTimeFormatted = new Date(endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

    // Mapeamento de formas de pagamento
    const paymentMethodLabels = {
      'dinheiro': 'Dinheiro',
      'cartao_debito': 'Cartão de Débito',
      'cartao_credito': 'Cartão de Crédito',
      'pix': 'PIX',
      'cheque': 'Cheque',
      'outro': 'Outro',
      'visa_debito': 'Visa Débito',
      'elo_debito': 'Elo Débito',
      'maestro_debito': 'Maestro Débito',
      'visa_credito': 'Visa Crédito',
      'elo_credito': 'Elo Crédito',
      'mastercard_credito': 'Mastercard Crédito',
      'amex_hipercard_credsystem': 'Amex / Hipercard / Credsystem',
    };

    // Montar mensagem consolidada (ponto + vendas)
    let message = `📋 *Comprovante de Fechamento de Turno*\n\n`;
    message += `👤 *Funcionário:* ${user}\n`;
    message += `📅 *Data:* ${date}\n`;
    message += `🕐 *Horário do Turno:* ${startTimeFormatted} às ${endTimeFormatted}\n`;
    if (shiftDuration) {
      message += `⏱️ *Duração:* ${shiftDuration}\n`;
    }
    message += `\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *RESUMO DE VENDAS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n\n`;

    if (totalSales === 0) {
      message += `💵 *Total de Vendas:* R$ 0,00\n`;
      message += `📄 *Status:* Nenhuma venda registrada neste turno.\n\n`;
    } else {
      message += `💵 *Total Vendido:* R$ ${parseFloat(totalAmount).toFixed(2)}\n`;
      message += `📊 *Quantidade de Vendas:* ${totalSales}\n`;
      message += `📈 *Ticket Médio:* R$ ${parseFloat(averageTicket).toFixed(2)}\n\n`;
      message += `💳 *Formas de Pagamento:*\n`;

      Object.entries(paymentSummary || {}).forEach(([method, data]) => {
        const methodLabel = paymentMethodLabels[method] || method;
        message += `• ${methodLabel}: ${data.count}x — R$ ${parseFloat(data.amount).toFixed(2)}\n`;
      });
      message += '\n';
    }

    message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
    message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
    message += `📍 *Registro INPI:* BR5120210029364\n\n`;
    message += `💬 _Obrigado pelo seu trabalho!_\n\n`;
    message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;

    // Enviar via Evolution API
    const result = await sendEvolutionMessage(targetNumber, message);

    if (result.success) {
      res.json({
        success: true,
        message: 'Relatório enviado via Evolution API com sucesso!',
        messageId: result.data.key?.id
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    await log(`❌ Erro ao enviar relatório via Evolution API: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para enviar notificação de ponto via Evolution API
app.post('/evolution/send-clock-notification', async (req, res) => {
  try {
    await log('⏰ Recebida requisição para enviar notificação de ponto via Evolution API');

    const { whatsapp_number, user_name, clock_time, type, entrada, saida, totalHoras } = req.body;

    if (!whatsapp_number) {
      return res.status(400).json({
        success: false,
        error: 'Número de WhatsApp não fornecido'
      });
    }

    // Limpar e formatar número
    let cleanNumber = whatsapp_number.replace(/\D/g, '');
    if (!cleanNumber.startsWith('55')) {
      cleanNumber = '55' + cleanNumber;
    }

    await log(`📱 Enviando para: ${cleanNumber}`);

    // Criar mensagem baseada no tipo
    let message = '';

    if (type === 'entrada') {
      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data/Hora:* ${clock_time}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
      message += `📄 *Tipo:* Entrada no Turno\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Tenha um ótimo dia de trabalho!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    } else if (type === 'saida') {
      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data/Hora:* ${clock_time}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
      message += `📄 *Tipo:* Saída do Turno\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Obrigado pelo seu trabalho hoje!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    } else if (type === 'comprovante') {
      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data:* ${clock_time.split(' às ')[0]}\n`;
      message += `🕐 *Entrada:* ${entrada}\n`;
      message += `🕐 *Saída:* ${saida}\n`;
      message += `⏱️ *Duração:* ${totalHoras}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Turno finalizado com sucesso!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    }

    // Enviar via Evolution API
    const result = await sendEvolutionMessage(cleanNumber, message);

    if (result.success) {
      res.json({
        success: true,
        message: `Notificação de ${type} enviada via Evolution API com sucesso!`,
        messageId: result.data.key?.id
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    await log(`❌ Erro ao enviar notificação via Evolution API: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Inicializar servidor
async function startServer() {
  try {
    // Criar diretório de logs se não existir
    try {
      await fsPromises.access(LOG_DIR);
    } catch {
      await fsPromises.mkdir(LOG_DIR, { recursive: true });
    }

    // Criar tabelas de sincronização
    await createSyncTables();

    // Iniciar processamento de vendas pendentes (a cada 30 segundos)
    setInterval(processPendingSales, 30000);

    // Iniciar servidor HTTP (Nginx faz o SSL termination)
    app.listen(PORT, () => {
      log(`🚀 Servidor de sincronização HTTP rodando na porta ${PORT}`);
      log(`📡 Linx configurado em: ${LINX_URL}`);
      log(`📬 Webhook Evolution API em /api/webhooks/evolution`);
    });
  } catch (error) {
    await log(`Erro ao iniciar servidor: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('uncaughtException', async (error) => {
  await log(`Erro não capturado: ${error.message}`, 'ERROR');
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  await log(`Promise rejeitada: ${reason}`, 'ERROR');
});

// Iniciar servidor
startServer();