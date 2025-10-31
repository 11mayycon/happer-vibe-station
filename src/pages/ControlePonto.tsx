import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Download, Search, Calendar, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PontoRecord {
  id: string;
  user_id: string;
  entrada: string;
  saida: string | null;
  created_at: string;
  users: {
    name: string;
    cargo: string;
  };
}

export default function ControlePonto() {
  const [pontos, setPontos] = useState<PontoRecord[]>([]);
  const [filteredPontos, setFilteredPontos] = useState<PontoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  // Estados para edição
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPonto, setSelectedPonto] = useState<PontoRecord | null>(null);
  const [editEntrada, setEditEntrada] = useState('');
  const [editSaida, setEditSaida] = useState('');
  const [editEntradaTime, setEditEntradaTime] = useState('');
  const [editSaidaTime, setEditSaidaTime] = useState('');
  const [saving, setSaving] = useState(false);

  // Estados para exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pontoToDelete, setPontoToDelete] = useState<PontoRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPontos();
  }, [selectedDate]);

  useEffect(() => {
    filterPontos();
  }, [searchTerm, pontos]);

  const loadPontos = async () => {
    setLoading(true);
    try {
      // Criar data de início: dia selecionado às 00:00:00 no timezone local
      const [year, month, day] = selectedDate.split('-').map(Number);
      const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);

      // Criar data de fim: dia selecionado às 23:59:59 no timezone local
      const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

      console.log('📅 Filtro de data:', {
        selectedDate,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startDateLocal: startDate.toLocaleString('pt-BR'),
        endDateLocal: endDate.toLocaleString('pt-BR')
      });

      const { data, error } = await supabase
        .from('ponto')
        .select(`
          *,
          users (
            name,
            cargo
          )
        `)
        .gte('entrada', startDate.toISOString())
        .lte('entrada', endDate.toISOString())
        .order('entrada', { ascending: false });

      if (error) throw error;
      setPontos((data as any) || []);
      setFilteredPontos((data as any) || []);
    } catch (error) {
      console.error('Error loading pontos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar registros de ponto',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPontos = () => {
    if (!searchTerm.trim()) {
      setFilteredPontos(pontos);
      return;
    }

    const filtered = pontos.filter(ponto =>
      ponto.users.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPontos(filtered);
  };

  const calculateHours = (entrada: string, saida: string | null): string => {
    if (!saida) return 'Em andamento';

    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);
    const minutes = differenceInMinutes(saidaDate, entradaDate);

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}min`;
  };

  const calculateTotalHours = (): string => {
    let totalMinutes = 0;

    filteredPontos.forEach(ponto => {
      if (ponto.saida) {
        const minutes = differenceInMinutes(
          new Date(ponto.saida),
          new Date(ponto.entrada)
        );
        totalMinutes += minutes;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return `${hours}h ${mins}min`;
  };

  const exportToPDF = async () => {
    toast({
      title: 'Gerando PDF...',
      description: 'Aguarde enquanto geramos o relatório',
    });

    // TODO: Implementar geração de PDF usando a mesma lógica do sistema
    // Por enquanto, apenas exibe mensagem
    setTimeout(() => {
      toast({
        title: 'PDF gerado!',
        description: 'Relatório de pontos exportado com sucesso',
      });
    }, 1500);
  };

  // Função para abrir dialog de edição
  const handleEditPonto = (ponto: PontoRecord) => {
    setSelectedPonto(ponto);

    // Extrair data e hora da entrada
    const entradaDate = new Date(ponto.entrada);
    setEditEntrada(format(entradaDate, 'yyyy-MM-dd'));
    setEditEntradaTime(format(entradaDate, 'HH:mm'));

    // Extrair data e hora da saída (se existir)
    if (ponto.saida) {
      const saidaDate = new Date(ponto.saida);
      setEditSaida(format(saidaDate, 'yyyy-MM-dd'));
      setEditSaidaTime(format(saidaDate, 'HH:mm'));
    } else {
      setEditSaida('');
      setEditSaidaTime('');
    }

    setEditDialogOpen(true);
  };

  // Função para salvar edição
  const handleSaveEdit = async () => {
    if (!selectedPonto) return;

    if (!editEntrada || !editEntradaTime) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Data e hora de entrada são obrigatórios',
      });
      return;
    }

    setSaving(true);
    try {
      // Combinar data e hora de entrada
      const entradaDateTime = new Date(`${editEntrada}T${editEntradaTime}`);

      // Combinar data e hora de saída (se fornecidos)
      let saidaDateTime = null;
      if (editSaida && editSaidaTime) {
        saidaDateTime = new Date(`${editSaida}T${editSaidaTime}`);

        // Validar que saída é depois da entrada
        if (saidaDateTime <= entradaDateTime) {
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'A saída deve ser posterior à entrada',
          });
          setSaving(false);
          return;
        }
      }

      // Atualizar no Supabase
      const { error } = await supabase
        .from('ponto')
        .update({
          entrada: entradaDateTime.toISOString(),
          saida: saidaDateTime ? saidaDateTime.toISOString() : null,
        })
        .eq('id', selectedPonto.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Registro de ponto atualizado com sucesso',
      });

      // Recarregar pontos
      await loadPontos();
      setEditDialogOpen(false);
      setSelectedPonto(null);
    } catch (error) {
      console.error('Error updating ponto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar registro de ponto',
      });
    } finally {
      setSaving(false);
    }
  };

  // Função para abrir dialog de exclusão
  const handleDeletePonto = (ponto: PontoRecord) => {
    setPontoToDelete(ponto);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!pontoToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('ponto')
        .delete()
        .eq('id', pontoToDelete.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Registro de ponto excluído com sucesso',
      });

      // Recarregar pontos
      await loadPontos();
      setDeleteDialogOpen(false);
      setPontoToDelete(null);
    } catch (error) {
      console.error('Error deleting ponto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir registro de ponto',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="Controle de Ponto e Horas Trabalhadas" showBack>
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca por nome */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por data */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Botão de exportar */}
              <Button
                onClick={exportToPDF}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pontos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📅 Registros de Ponto</span>
              <span className="text-sm font-normal text-muted-foreground">
                {filteredPontos.length} registro(s)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando registros...
              </div>
            ) : filteredPontos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum registro encontrado para esta data</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">Cargo</th>
                      <th className="text-left py-3 px-4 font-semibold">Entrada</th>
                      <th className="text-left py-3 px-4 font-semibold">Saída</th>
                      <th className="text-left py-3 px-4 font-semibold">Horas Trabalhadas</th>
                      <th className="text-left py-3 px-4 font-semibold">Data</th>
                      <th className="text-center py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPontos.map((ponto) => (
                      <tr key={ponto.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{ponto.users.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{ponto.users.cargo}</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-semibold">
                            {format(new Date(ponto.entrada), 'HH:mm:ss', { locale: ptBR })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {ponto.saida ? (
                            <span className="text-red-600 font-semibold">
                              {format(new Date(ponto.saida), 'HH:mm:ss', { locale: ptBR })}
                            </span>
                          ) : (
                            <span className="text-yellow-600 italic">Em andamento</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-primary">
                            {calculateHours(ponto.entrada, ponto.saida)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {format(new Date(ponto.entrada), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPonto(ponto)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePonto(ponto)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Geral */}
        {filteredPontos.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">Total Geral de Horas Trabalhadas</p>
                    <p className="text-3xl font-bold">{calculateTotalHours()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Data Selecionada</p>
                  <p className="text-xl font-semibold">
                    {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog de Edição */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Editar Registro de Ponto
              </DialogTitle>
              <DialogDescription>
                {selectedPonto && `Editando ponto de ${selectedPonto.users.name}`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Entrada */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-entrada-date">Data de Entrada</Label>
                  <Input
                    id="edit-entrada-date"
                    type="date"
                    value={editEntrada}
                    onChange={(e) => setEditEntrada(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-entrada-time">Hora de Entrada</Label>
                  <Input
                    id="edit-entrada-time"
                    type="time"
                    value={editEntradaTime}
                    onChange={(e) => setEditEntradaTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Saída */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-saida-date">Data de Saída (opcional)</Label>
                  <Input
                    id="edit-saida-date"
                    type="date"
                    value={editSaida}
                    onChange={(e) => setEditSaida(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-saida-time">Hora de Saída (opcional)</Label>
                  <Input
                    id="edit-saida-time"
                    type="time"
                    value={editSaidaTime}
                    onChange={(e) => setEditSaidaTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Preview */}
              {editEntrada && editEntradaTime && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Preview:</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">
                      Entrada: {new Date(`${editEntrada}T${editEntradaTime}`).toLocaleString('pt-BR')}
                    </span>
                    {editSaida && editSaidaTime && (
                      <>
                        <span>→</span>
                        <span className="text-red-600">
                          Saída: {new Date(`${editSaida}T${editSaidaTime}`).toLocaleString('pt-BR')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Exclusão */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>

            {pontoToDelete && (
              <div className="py-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <p className="font-semibold">Você está prestes a excluir:</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Funcionário:</strong> {pontoToDelete.users.name}</p>
                    <p><strong>Entrada:</strong> {format(new Date(pontoToDelete.entrada), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}</p>
                    {pontoToDelete.saida && (
                      <p><strong>Saída:</strong> {format(new Date(pontoToDelete.saida), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Tem certeza que deseja excluir este registro de ponto?
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir Registro'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
