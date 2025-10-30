import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users as UsersIcon, Plus, Edit, Trash2, Ban, Check, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  whatsapp_number: string;
  cpf: string;
  role: 'admin' | 'employee';
  cargo: string;
  blocked: boolean;
}

interface Sale {
  id: string;
  total: number;
  created_at: string;
  forma_pagamento: string;
}

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showSalesDialog, setShowSalesDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserSales, setSelectedUserSales] = useState<Sale[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp_number: '',
    cpf: '',
    role: 'employee' as 'admin' | 'employee',
    cargo: '',
    password: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      whatsapp_number: '',
      cpf: '',
      role: 'employee',
      cargo: '',
      password: '',
    });
    setShowDialog(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      whatsapp_number: user.whatsapp_number,
      cpf: user.cpf,
      role: user.role,
      cargo: user.cargo,
      password: '',
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    try {
      console.log('🔧 Iniciando handleSubmit...');
      console.log('📝 Dados do formulário:', formData);

      // Validar formato do WhatsApp
      if (!formData.whatsapp_number || formData.whatsapp_number.trim() === '') {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'O número de WhatsApp é obrigatório.',
        });
        return;
      }

      // Verificar se tem pelo menos dígitos suficientes (mínimo 10 dígitos)
      const digitsOnly = formData.whatsapp_number.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Número de WhatsApp inválido. Use o formato: +55 XX XXXXX-XXXX',
        });
        return;
      }

      // Importar bcrypt para hashear senha
      const bcrypt = await import('bcryptjs');
      console.log('✅ bcryptjs importado com sucesso');

      if (editingUser) {
        // Ao editar, não atualizar a senha (apenas outros dados)
        const userData = {
          name: formData.name,
          whatsapp_number: formData.whatsapp_number,
          cpf: formData.cpf,
          role: formData.role,
          cargo: formData.cargo,
        };
        
        console.log('📤 Atualizando usuário:', userData);
        const { error } = await supabase
          .from('users')
          .update(userData)
          .eq('id', editingUser.id);
        
        if (error) throw error;
        toast({ title: 'Usuário atualizado com sucesso!' });
      } else {
        // Ao criar, hashear a senha
        const password = formData.password || '123456'; // Senha padrão se não informada
        console.log('🔐 Senha a ser hashada:', password);
        
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log('✅ Senha hashada com sucesso, tamanho:', passwordHash.length);
        
        const userData = {
          name: formData.name,
          whatsapp_number: formData.whatsapp_number,
          cpf: formData.cpf,
          role: formData.role,
          cargo: formData.cargo,
          password_hash: passwordHash,
          blocked: false,
        };
        
        console.log('📤 Inserindo novo usuário (sem password_hash no log):', {
          name: userData.name,
          whatsapp_number: userData.whatsapp_number,
          cpf: userData.cpf,
          role: userData.role,
          cargo: userData.cargo,
        });
        
        const { data, error } = await supabase
          .from('users')
          .insert([userData as any])
          .select();
        
        if (error) {
          console.error('❌ Erro ao inserir usuário:', error);
          throw error;
        }
        
        console.log('✅ Usuário criado com sucesso:', data);
        toast({ 
          title: 'Usuário cadastrado com sucesso!',
          description: password === '123456' ? 'Senha padrão: 123456' : 'Use a senha informada para fazer login'
        });
      }

      setShowDialog(false);
      loadUsers();
    } catch (error: any) {
      console.error('💥 Erro no handleSubmit:', error);

      // Verificar se é erro de duplicação de WhatsApp
      let errorMessage = error.message;
      if (error.message?.includes('whatsapp_number') || error.code === '23505') {
        errorMessage = 'Este número de WhatsApp já está cadastrado.';
      }

      toast({
        variant: 'destructive',
        title: 'Erro',
        description: errorMessage,
      });
    }
  };

  const toggleBlockUser = async (userId: string, currentBlocked: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ blocked: !currentBlocked })
        .eq('id', userId);
      
      if (error) throw error;
      toast({
        title: currentBlocked ? 'Usuário desbloqueado!' : 'Usuário bloqueado!',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message,
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      toast({ title: 'Usuário excluído com sucesso!' });
      loadUsers();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message,
      });
    }
  };

  const viewUserSales = async (user: User) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', todayISO)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSelectedUserSales(data || []);
      setSelectedUserName(user.name);
      setShowSalesDialog(true);
    } catch (error) {
      console.error('Error loading user sales:', error);
    }
  };

  return (
    <Layout title="Usuários" showBack>
      <div className="space-y-6">
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Usuário
        </Button>

        {users.length === 0 ? (
          <Card className="p-12 text-center">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhum usuário cadastrado</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.blocked && (
                          <Badge variant="destructive">Bloqueado</Badge>
                        )}
                        {user.role === 'admin' && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.cargo}</p>
                      <p className="text-sm text-muted-foreground">📱 {user.whatsapp_number}</p>
                      <p className="text-sm text-muted-foreground">CPF: {user.cpf}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewUserSales(user)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Vendas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBlockUser(user.id, user.blocked)}
                    >
                      {user.blocked ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Desbloquear
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4 mr-1" />
                          Bloquear
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Cadastrar Usuário'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Número de WhatsApp</Label>
              <Input
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="Ex: +55 55 99999-9999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label>Senha Inicial</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Deixe em branco para senha padrão"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Vendas do Usuário */}
      <Dialog open={showSalesDialog} onOpenChange={setShowSalesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vendas de {selectedUserName} Hoje</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {selectedUserSales.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma venda registrada hoje
              </p>
            ) : (
              selectedUserSales.map((sale) => (
                <Card key={sale.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(sale.created_at), "HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.forma_pagamento}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      R$ {sale.total.toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
