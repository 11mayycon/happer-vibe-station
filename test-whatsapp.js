// Script de teste para verificar envio de WhatsApp
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔍 TESTE DE NOTIFICAÇÃO WHATSAPP\n');
console.log('━'.repeat(50));

rl.question('Digite seu número de WhatsApp (Ex: +55 55 99999-8888): ', async (whatsapp_number) => {
  rl.question('Digite seu nome: ', async (user_name) => {

    const now = new Date();
    const clock_time = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    console.log('\n📤 Enviando notificação de teste...');
    console.log(`   Número: ${whatsapp_number}`);
    console.log(`   Nome: ${user_name}`);
    console.log(`   Horário: ${clock_time}\n`);

    try {
      const response = await fetch('http://localhost:4000/send-clock-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsapp_number: whatsapp_number,
          user_name: user_name,
          clock_time: clock_time,
          type: 'entrada'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Mensagem enviada com sucesso!');
        console.log('');
        console.log('📱 Verifique seu WhatsApp agora!');
        console.log('');
        console.log('💡 IMPORTANTE:');
        console.log('   - A mensagem deve chegar do número que está conectado no bot');
        console.log('   - Verifique a aba de conversas arquivadas');
        console.log('   - Se não receber, o número do bot pode não estar salvo');
        console.log('');
        console.log('🔍 Para descobrir qual número está enviando:');
        console.log('   - Acesse: http://localhost:4000/status');
        console.log('   - Ou verifique os logs: pm2 logs caminho-bot');
      } else {
        console.log('❌ Erro ao enviar:', result.error || result.message);
        console.log('Detalhes:', result.details || 'Nenhum detalhe disponível');
      }
    } catch (error) {
      console.log('❌ Erro ao conectar com o bot:', error.message);
      console.log('');
      console.log('🔧 Verifique se o bot está rodando:');
      console.log('   pm2 status');
    }

    rl.close();
  });
});
