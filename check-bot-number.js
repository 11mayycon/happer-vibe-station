// Script para descobrir o número do bot
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

console.log('🔍 Descobrindo número do bot WhatsApp...\n');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('ready', async () => {
  console.log('✅ Bot conectado!\n');

  try {
    const info = await client.info;

    console.log('━'.repeat(60));
    console.log('📱 INFORMAÇÕES DO BOT WHATSAPP');
    console.log('━'.repeat(60));
    console.log(`Número conectado: ${info.wid.user}`);
    console.log(`Nome/Push name: ${info.pushname || 'Não definido'}`);
    console.log(`Plataforma: ${info.platform || 'WhatsApp'}`);
    console.log('━'.repeat(60));
    console.log('');
    console.log('💡 IMPORTANTE:');
    console.log(`   Este é o número que está enviando as mensagens: +${info.wid.user}`);
    console.log('   Salve este número nos seus contatos para receber as mensagens!');
    console.log('');

    await client.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao obter informações:', error.message);
    await client.destroy();
    process.exit(1);
  }
});

client.on('qr', () => {
  console.log('❌ Bot não está autenticado. Execute o bot principal primeiro.');
  process.exit(1);
});

client.initialize();

// Timeout de 30 segundos
setTimeout(() => {
  console.log('❌ Timeout - não foi possível conectar em 30 segundos');
  process.exit(1);
}, 30000);
