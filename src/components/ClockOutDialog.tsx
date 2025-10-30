import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BOT_SERVER_URL = import.meta.env.VITE_BOT_SERVER_URL || 'http://localhost:4000';

interface ClockOutDialogProps {
  open: boolean;
  onClose: () => void;
  onClockOutSuccess?: () => void;
}

export function ClockOutDialog({ open, onClose, onClockOutSuccess }: ClockOutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    // Atualizar data/hora a cada segundo
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const now = new Date();

      // Buscar o último registro de ponto em aberto (sem saída)
      const { data: pontoAberto, error: fetchError } = await supabase
        .from('ponto')
        .select('*')
        .eq('user_id', user?.id)
        .is('saida', null)
        .order('entrada', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (!pontoAberto || pontoAberto.length === 0) {
        throw new Error('Nenhum registro de ponto em aberto encontrado');
      }

      // Atualizar registro de ponto com a saída
      const { error: updateError } = await supabase
        .from('ponto')
        .update({ saida: now.toISOString() })
        .eq('id', pontoAberto[0].id);

      if (updateError) throw updateError;

      if (onClockOutSuccess) {
        onClockOutSuccess();
      }

      onClose();
      setLoading(false);

      // Enviar notificação via WhatsApp de forma assíncrona (não bloqueante)
      if (user?.whatsapp_number) {
        fetch(`${BOT_SERVER_URL}/send-clock-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            whatsapp_number: user.whatsapp_number,
            user_name: user.name,
            clock_time: format(now, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }),
            type: 'saida',
          }),
        }).then(response => {
          if (response.ok) {
            console.log('✅ Notificação de saída enviada via WhatsApp');
          } else {
            console.warn('⚠️ Falha ao enviar notificação de saída via WhatsApp');
          }
        }).catch(error => {
          console.error('❌ Erro ao enviar notificação de saída:', error);
        });
      }
    } catch (error) {
      console.error('Error clocking out:', error);
      alert('Erro ao registrar saída: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      setLoading(false);
    }
  };

  const firstName = (user?.name && user.name.trim()) ? user.name.split(' ')[0] : 'Usuário';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800/90 text-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-yellow-500 animate-spin-slow" />
              <span>🕗 Registro de Ponto - Saída</span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Diálogo para registrar ponto de saída
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-6 space-y-4">
          <p className="text-lg text-gray-300 mb-4">
            Olá, {firstName}!
          </p>
          <p className="text-sm text-gray-400">
            Está pronto para bater seu ponto de saída?
          </p>

          {/* Exibir data e hora atual */}
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
            <p className="text-xs text-gray-400 mb-1">Data e Hora Atual</p>
            <p className="text-xl font-bold text-white">
              {format(currentDateTime, "dd/MM/yyyy", { locale: ptBR })}
            </p>
            <p className="text-2xl font-bold text-yellow-500">
              {format(currentDateTime, "HH:mm:ss", { locale: ptBR })}
            </p>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClockOut}
            disabled={loading}
            size="lg"
            className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? 'Registrando...' : '🔵 Bater Ponto de Saída'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
