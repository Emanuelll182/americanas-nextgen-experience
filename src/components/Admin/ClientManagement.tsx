import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Ban, CheckCircle, Users, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Client {
  id: string;
  user_id: string;
  email: string;
  phone?: string;
  setor: string;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
}

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    setor: 'varejo' as 'varejo' | 'revenda'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          setor: formData.setor,
          phone: formData.phone
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });

      setIsDialogOpen(false);
      setFormData({ email: '', password: '', phone: '', setor: 'varejo' });
      fetchClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar cliente.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBlock = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !client.is_blocked })
        .eq('user_id', client.user_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Cliente ${client.is_blocked ? 'desbloqueado' : 'bloqueado'} com sucesso!`,
      });

      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do cliente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(client.user_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      });

      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cliente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSetor = async (client: Client, newSetor: 'varejo' | 'revenda') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ setor: newSetor })
        .eq('user_id', client.user_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Setor atualizado com sucesso!",
      });

      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar setor.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Gerenciar Clientes</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="setor">Setor</Label>
                <Select value={formData.setor} onValueChange={(value: 'varejo' | 'revenda') => setFormData(prev => ({ ...prev, setor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="revenda">Revenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Criar Cliente
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.email}</span>
                    {client.is_admin && (
                      <Badge variant="destructive">Admin</Badge>
                    )}
                    {client.is_blocked && (
                      <Badge variant="outline" className="text-red-500 border-red-500">
                        Bloqueado
                      </Badge>
                    )}
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={client.setor === 'varejo' ? 'secondary' : 'default'}>
                      {client.setor === 'varejo' ? 'Varejo' : 'Revenda'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Criado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select 
                  value={client.setor} 
                  onValueChange={(value: 'varejo' | 'revenda') => handleUpdateSetor(client, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="revenda">Revenda</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={client.is_blocked ? "outline" : "destructive"}
                  size="sm"
                  onClick={() => handleToggleBlock(client)}
                  disabled={client.is_admin}
                >
                  {client.is_blocked ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Desbloquear
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-1" />
                      Bloquear
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={client.is_admin}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o cliente {client.email}? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteClient(client)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}

        {clients.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum cliente cadastrado
            </h3>
            <p className="text-muted-foreground">
              Comece criando um novo cliente.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;