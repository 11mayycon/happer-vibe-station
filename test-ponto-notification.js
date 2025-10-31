#!/usr/bin/env node

/**
 * Script de teste para verificar se as notificações de ponto estão funcionando
 */

const BOT_URL = 'http://localhost:4000';

async function testBotStatus() {
  console.log('\n🔍 Testando status do bot...');

  try {
    const response = await fetch(`${BOT_URL}/status`);
    const data = await response.json();

    if (data.connected) {
      console.log('✅ Bot está conectado!');
      console.log(`📅 Timestamp: ${data.timestamp}`);
      return true;
    } else {
      console.log('❌ Bot não está conectado!');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    return false;
  }
}

async function testClockNotification() {
  console.log('\n📱 Testando envio de notificação de ponto...');

  // Dados de teste - ALTERE O NÚMERO PARA O SEU NÚMERO DE WHATSAPP
  const testPayload = {
    whatsapp_number: '5511978197645', // ALTERE AQUI
    user_name: 'Teste de Sistema',
    clock_time: new Date().toLocaleString('pt-BR'),
    type: 'entrada'
  };

  console.log('📦 Payload de teste:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(`${BOT_URL}/send-clock-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Notificação enviada com sucesso!');
      console.log('📱 Resposta:', data);
    } else {
      console.log('❌ Erro ao enviar notificação');
      console.log('📱 Status:', response.status);
      console.log('📱 Resposta:', data);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando teste de notificações de ponto...\n');

  // Verificar se o bot está conectado
  const isConnected = await testBotStatus();

  if (!isConnected) {
    console.log('\n❌ Bot não está conectado. Verifique se o bot está rodando:');
    console.log('   pm2 logs caminho-bot');
    process.exit(1);
  }

  // Aguardar 2 segundos
  console.log('\n⏳ Aguardando 2 segundos...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Testar envio de notificação
  await testClockNotification();

  console.log('\n✅ Teste finalizado!\n');
}

main().catch(console.error);
