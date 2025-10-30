import express from 'express';
import cors from 'cors';
import https from 'https';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import pdf from 'puppeteer';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar moment para português
moment.locale('pt-br');

// Configurar cliente com sessão persistente e reconexão
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'caminho-certo-bot'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  }
});

let isClientReady = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

client.on('qr', qr => {
  console.log('📱 Escaneie o QR Code do WhatsApp...');
  qrcode.generate(qr, { small: true });
  reconnectAttempts = 0; // Reset counter when QR is shown
});

client.on('ready', () => {
  console.log('✅ Bot do Caminho Certo conectado ao WhatsApp!');
  console.log('📱 Sessão salva e pronta para uso!');
  isClientReady = true;
  reconnectAttempts = 0;
});

client.on('authenticated', () => {
  console.log('🔐 Bot autenticado com sucesso!');
  console.log('💾 Sessão salva localmente');
});

client.on('auth_failure', msg => {
  console.error('❌ Falha na autenticação:', msg);
  console.log('🔄 Tentando reconectar...');
  reconnectAttempts++;

  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    setTimeout(() => {
      console.log(`🔄 Tentativa de reconexão ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      client.initialize();
    }, 5000);
  } else {
    console.error('❌ Máximo de tentativas de reconexão atingido');
    console.log('⚠️ Por favor, escaneie o QR Code novamente');
  }
});

client.on('disconnected', (reason) => {
  console.log('❌ Bot desconectado:', reason);
  isClientReady = false;

  // Tentar reconectar automaticamente
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`🔄 Tentando reconectar (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

    setTimeout(() => {
      console.log('🔄 Reinicializando cliente...');
      client.initialize();
    }, 5000);
  } else {
    console.error('❌ Máximo de tentativas de reconexão atingido');
    console.log('⚠️ Reinicie o servidor manualmente');
  }
});

client.on('loading_screen', (percent, message) => {
  console.log('⏳ Carregando WhatsApp:', percent, '%', message);
});

// Evento de mudança de estado
client.on('change_state', state => {
  console.log('🔄 Estado alterado:', state);
});

// Keepalive para manter a conexão ativa
setInterval(() => {
  if (isClientReady) {
    client.getState().then(state => {
      console.log('💚 Conexão ativa:', state);
    }).catch(err => {
      console.log('⚠️ Erro ao verificar estado:', err.message);
    });
  }
}, 60000); // Verifica a cada 1 minuto

console.log('🔄 Inicializando cliente WhatsApp...');
console.log('💾 Usando sessão salva: caminho-certo-bot');
client.initialize();

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

// Rota para envio de relatório
app.post('/send-report', async (req, res) => {
  try {
    if (!isClientReady) {
      return res.status(503).json({ 
        success: false, 
        error: 'Bot do WhatsApp não está conectado' 
      });
    }

    const { 
      user, 
      startTime, 
      endTime, 
      totalSales, 
      averageTicket, 
      totalAmount, 
      paymentSummary,
      groupId,
      pdfData,
      receiptNumber
    } = req.body;

    // ID do grupo padrão (CAMINHO CERTO)
    const targetGroupId = groupId || '120363407029045754@g.us';

    const date = moment().format('DD/MM/YYYY');
    const startTimeFormatted = moment(startTime).format('HH:mm');
    const endTimeFormatted = moment(endTime).format('HH:mm');

    // Montar mensagem conforme o padrão solicitado
    let message = `📊 *Resumo de Turno - PDV InovaPro*\n\n`;
    message += `👤 *Funcionário:* ${user}\n`;
    message += `🕐 *Turno:* ${startTimeFormatted} às ${endTimeFormatted}\n`;

    if (totalSales === 0) {
      message += `💵 *Total de Vendas:* R$ 0,00\n`;
      message += `📄 *Status:* Nenhuma venda registrada neste turno.\n\n`;
    } else {
      message += `💵 *Total de Vendas:* R$ ${parseFloat(totalAmount).toFixed(2)}\n`;
      message += `📊 *Quantidade de Vendas:* ${totalSales}\n`;
      message += `📈 *Ticket Médio:* R$ ${parseFloat(averageTicket).toFixed(2)}\n\n`;
      message += `💳 *Detalhamento por Forma de Pagamento:*\n`;

      // Adicionar formas de pagamento
      Object.entries(paymentSummary || {}).forEach(([method, data]) => {
        const methodLabel = paymentMethodLabels[method] || method;
        message += `• ${methodLabel}: ${data.count}x — R$ ${parseFloat(data.amount).toFixed(2)}\n`;
      });
      message += '\n';
    }

    message += `🏢 *CNPJ:* 28.769.272/0001-70\n`;
    message += `📍 *Registro INPI:* BR5120210029364\n\n`;
    message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;

    // Se há dados de PDF, criar arquivo PDF real e enviar como anexo
    if (pdfData && receiptNumber) {
      try {
        console.log('📄 Gerando PDF moderno para anexo...');
        
        // Criar diretório temporário se não existir
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        // Verificar se pdfData tem o formato correto
        let reportText = '';
        if (typeof pdfData === 'string') {
          reportText = pdfData;
        } else if (pdfData.receiptText) {
          reportText = pdfData.receiptText;
        } else if (pdfData.data) {
          reportText = pdfData.data;
        } else {
          console.log('📄 Estrutura do pdfData:', JSON.stringify(pdfData, null, 2));
          reportText = JSON.stringify(pdfData, null, 2);
        }

        // Gerar PDF moderno usando html-pdf
        const pdfBuffer = await generateModernPDF(reportText, receiptNumber, paymentSummary);
        
        // Salvar PDF temporário
        const fileName = `relatorio_turno_${receiptNumber}.pdf`;
        const filePath = path.join(tempDir, fileName);
        
        // Escrever PDF no arquivo
        fs.writeFileSync(filePath, pdfBuffer);
        console.log(`📄 PDF criado: ${filePath}`);

        // Importar MessageMedia para envio de anexo
        const { MessageMedia } = pkg;
        const media = MessageMedia.fromFilePath(filePath);
        media.filename = fileName;

        // Enviar mensagem com anexo PDF
        await client.sendMessage(targetGroupId, media, { caption: message });
        console.log('✅ Relatório com PDF moderno enviado para o grupo do WhatsApp!');

        // Limpar arquivo temporário após envio
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('🗑️ Arquivo PDF temporário removido');
          }
        }, 5000);

      } catch (pdfError) {
        console.error('❌ Erro ao processar PDF:', pdfError);
        console.log('📄 Enviando apenas mensagem de texto...');
        // Se falhar com PDF, enviar apenas a mensagem
        await client.sendMessage(targetGroupId, message);
        console.log('✅ Relatório (sem PDF) enviado para o grupo do WhatsApp!');
      }
    } else {
      console.log('📄 Nenhum PDF fornecido, enviando apenas mensagem...');
      // Enviar apenas mensagem se não há PDF
      await client.sendMessage(targetGroupId, message);
      console.log('✅ Relatório enviado para o grupo do WhatsApp!');
    }

    res.json({ success: true, message: 'Relatório enviado com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao enviar relatório:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// Rota para enviar notificação de ponto
app.post('/send-clock-notification', async (req, res) => {
  try {
    console.log('📥 Requisição recebida em /send-clock-notification');
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    console.log('🔌 Bot conectado?', isClientReady);

    if (!isClientReady) {
      console.error('❌ Bot não conectado - rejeitando requisição');
      return res.status(503).json({
        success: false,
        error: 'Bot do WhatsApp não está conectado'
      });
    }

    const { whatsapp_number, user_name, clock_time, type } = req.body;

    // Validar se o número de WhatsApp foi fornecido
    if (!whatsapp_number) {
      return res.status(400).json({
        success: false,
        error: 'Número de WhatsApp não fornecido'
      });
    }

    // Formatar número para o WhatsApp Web JS
    // Remove todos os caracteres não numéricos
    let cleanNumber = whatsapp_number.replace(/\D/g, '');

    // Se não começar com 55, adicionar
    if (!cleanNumber.startsWith('55')) {
      cleanNumber = '55' + cleanNumber;
    }

    // Adicionar @c.us se não tiver
    const whatsappId = cleanNumber.includes('@') ? cleanNumber : `${cleanNumber}@c.us`;

    console.log(`📱 Enviando para: ${whatsapp_number} -> ${whatsappId}`);

    // Criar mensagem baseada no tipo (entrada, saída ou comprovante)
    let message = '';

    if (type === 'entrada') {
      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('DD/MM/YYYY')}\n`;
      message += `🕒 *Horário:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('HH:mm:ss')}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
      message += `📄 *Tipo:* Entrada no Turno\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Tenha um ótimo dia de trabalho!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    } else if (type === 'saida') {
      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('DD/MM/YYYY')}\n`;
      message += `🕒 *Horário:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('HH:mm:ss')}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
      message += `📄 *Tipo:* Saída do Turno\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Obrigado pelo seu trabalho hoje!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    } else if (type === 'comprovante') {
      const { entrada, saida, totalHoras } = req.body;

      message = `📋 *Comprovante de Ponto - PDV InovaPro*\n\n`;
      message += `👤 *Funcionário:* ${user_name}\n`;
      message += `📅 *Data:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('DD/MM/YYYY')}\n`;
      message += `🕒 *Horário:* ${moment(clock_time, 'DD/MM/YYYY [às] HH:mm:ss').format('HH:mm:ss')}\n`;
      message += `🏢 *Local:* Loja de Conveniência CT P. Rodoil\n`;
      message += `📄 *Tipo:* Saída do Turno\n`;
      message += `⏱️ *Duração:* ${totalHoras}\n\n`;
      message += `💼 *CNPJ:* 28.769.272/0001-70\n`;
      message += `📍 *Registro INPI:* BR5120210029364\n\n`;
      message += `💬 _Turno finalizado com sucesso!_\n\n`;
      message += `🤖 _Sistema PDV InovaPro - INOVAPRO TECHNOLOGY_`;
    }

    // Enviar mensagem
    await client.sendMessage(whatsappId, message);
    console.log(`✅ Notificação de ${type} enviada para ${whatsapp_number}`);

    res.json({ success: true, message: 'Notificação enviada com sucesso!' });

  } catch (error) {
    console.error('❌ Erro ao enviar notificação de ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// Rota para verificar status do bot
app.get('/status', (req, res) => {
  res.json({
    connected: isClientReady,
    timestamp: moment().format('DD/MM/YYYY HH:mm:ss')
  });
});

// Rota para obter informações dos grupos
app.get('/groups', async (req, res) => {
  try {
    if (!isClientReady) {
      return res.status(503).json({ 
        success: false, 
        error: 'Bot não está conectado' 
      });
    }

    const chats = await client.getChats();
    const groups = chats
      .filter(chat => chat.isGroup)
      .map(group => ({
        id: group.id._serialized,
        name: group.name,
        participantCount: group.participants.length
      }));

    res.json({ success: true, groups });
  } catch (error) {
    console.error('❌ Erro ao obter grupos:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Função para gerar PDF moderno e organizado
async function generateModernPDF(reportText, receiptNumber, paymentSummary) {
  let browser;
  try {
    const now = moment();
    
    // Template HTML moderno para o PDF
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
                background: #fff;
            }
            
            .header {
                background: linear-gradient(135deg, #2980b9, #3498db);
                color: white;
                padding: 20px;
                text-align: center;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .header h2 {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .header h3 {
                font-size: 14px;
                font-weight: normal;
            }
            
            .company-info {
                background: #f8f9fa;
                padding: 15px;
                margin-bottom: 20px;
                border-left: 4px solid #2980b9;
            }
            
            .company-info p {
                margin: 3px 0;
                font-size: 11px;
                color: #555;
            }
            
            .report-info {
                margin-bottom: 20px;
            }
            
            .report-info p {
                margin: 5px 0;
                font-weight: bold;
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section-title {
                background: #2980b9;
                color: white;
                padding: 10px 15px;
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .payment-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            
            .payment-table th {
                background: #ecf0f1;
                padding: 8px;
                text-align: left;
                font-weight: bold;
                border: 1px solid #bdc3c7;
            }
            
            .payment-table td {
                padding: 8px;
                border: 1px solid #bdc3c7;
            }
            
            .payment-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            
            .total-row {
                background: #e74c3c !important;
                color: white;
                font-weight: bold;
            }
            
            .total-row td {
                border-color: #c0392b;
            }
            
            .details-section {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 10px;
                line-height: 1.3;
            }
            
            .details-section .important {
                color: #e74c3c;
                font-weight: bold;
            }
            
            .footer {
                margin-top: 30px;
                padding: 15px;
                background: #ecf0f1;
                text-align: center;
                font-size: 10px;
                color: #7f8c8d;
            }
            
            .value-positive {
                color: #27ae60;
                font-weight: bold;
            }
            
            .value-negative {
                color: #e74c3c;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>CENTRO AUTOMOTIVO</h1>
            <h2>CAMINHO CERTO LTDA</h2>
            <h3>RELATÓRIO DE FECHAMENTO DE TURNO</h3>
        </div>
        
        <div class="company-info">
            <p><strong>Endereço:</strong> AV MANUEL DOMINGOS PINTO - PQ ANHANGUERA S10 PAULO-SP</p>
            <p><strong>CEP:</strong> 05120-000 | <strong>CNPJ:</strong> 02.727.407/0001-40 | <strong>IE:</strong> 115.263.059.110</p>
        </div>
        
        <div class="report-info">
            <p><strong>Documento:</strong> ${receiptNumber}</p>
            <p><strong>Data/Hora:</strong> ${now.format('DD/MM/YYYY HH:mm:ss')}</p>
            <p><strong>Sistema:</strong> <span style="color: #2980b9;">Caminho Certo - INOVAPRO TECHNOLOGY</span></p>
        </div>
        
        ${paymentSummary && paymentSummary.length > 0 ? `
        <div class="section">
            <div class="section-title">RESUMO POR FORMA DE PAGAMENTO</div>
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Forma de Pagamento</th>
                        <th style="text-align: center;">Transações</th>
                        <th style="text-align: right;">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${paymentSummary.map(item => {
                        const methodLabels = {
                            'dinheiro': 'Dinheiro',
                            'cartao_debito': 'Cartão Débito',
                            'cartao_credito': 'Cartão Crédito',
                            'pix': 'PIX',
                            'outro': 'Outro'
                        };
                        const methodLabel = methodLabels[item.method] || item.method;
                        const amount = parseFloat(item.amount);
                        const valueClass = amount > 0 ? 'value-positive' : 'value-negative';
                        
                        return `
                        <tr>
                            <td>${methodLabel}</td>
                            <td style="text-align: center;">${item.count}x</td>
                            <td style="text-align: right;" class="${valueClass}">R$ ${amount.toFixed(2)}</td>
                        </tr>
                        `;
                    }).join('')}
                    <tr class="total-row">
                        <td><strong>TOTAL GERAL</strong></td>
                        <td style="text-align: center;"><strong>${paymentSummary.reduce((sum, item) => sum + item.count, 0)}x</strong></td>
                        <td style="text-align: right;"><strong>R$ ${paymentSummary.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
        ` : ''}
        
        ${reportText && reportText.trim() ? `
        <div class="section">
            <div class="section-title">DETALHES DO FECHAMENTO</div>
            <div class="details-section">
                ${reportText.split('\n').map(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.includes('TOTAL') || trimmedLine.includes('DIFERENÇA')) {
                        return `<div class="important">${trimmedLine}</div>`;
                    } else if (trimmedLine.includes('---') || trimmedLine.includes('===')) {
                        return '<div style="margin: 5px 0;"></div>';
                    } else if (trimmedLine) {
                        return `<div>${trimmedLine}</div>`;
                    } else {
                        return '<div style="margin: 3px 0;"></div>';
                    }
                }).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><strong>Documento gerado automaticamente pelo Sistema Caminho Certo</strong></p>
            <p>Gerado em: ${now.format('DD/MM/YYYY às HH:mm:ss')}</p>
        </div>
    </body>
    </html>
    `;

    // Inicializar puppeteer
    browser = await pdf.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Configurar o conteúdo HTML
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });

    console.log('✅ PDF gerado com sucesso usando Puppeteer!');
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const PORT = process.env.PORT || 4000;

// Configurar HTTPS se houver certificados
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

if (SSL_KEY_PATH && SSL_CERT_PATH && fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
  const httpsOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🚀 Servidor do bot rodando em https://ct.inovapro.cloud:${PORT}`);
    console.log('📱 Aguardando conexão com WhatsApp...');
  });
} else {
  console.log('⚠️  Certificados SSL não encontrados. Rodando em HTTP...');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor do bot rodando em http://localhost:${PORT}`);
    console.log('📱 Aguardando conexão com WhatsApp...');
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Encerrando bot...');
  await client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Encerrando bot...');
  await client.destroy();
  process.exit(0);
});