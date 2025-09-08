import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/AuthProvider'; // ajuste conforme o caminho do seu AuthProvider
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const { signUp, signIn, signInWithGoogle, setUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }

        const { data, error } = await signUp(
          formData.email,
          formData.password,
          'varejo',
          formData.phone
        );

        if (error) throw error;

        // Atualiza usuário no contexto
        if (data?.user) setUser(data.user);

        toast({
          title: "Cadastro realizado!",
          description: data.user && !data.session
            ? "Verifique seu email para confirmar a conta. Enquanto isso, você pode navegar como visitante."
            : "Conta criada com sucesso!"
        });
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;

        // Atualiza usuário no contexto
        if (data?.session?.user) setUser(data.session.user);

        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });

        onBack();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await signInWithGoogle();
      if (error) throw error;

      if (data?.user) setUser(data.user);

      toast({
        title: "Login realizado!",
        description: "Bem-vindo!",
      });

      onBack();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login com Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                {isSignUp ? 'Criar Conta' : 'Login'}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {isSignUp ? 'Cadastre-se para acessar preços especiais' : 'Entre com sua conta'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {isSignUp && (
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
            )}

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary/80"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem conta? Cadastre-se'
                }
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {isSignUp && 'Nota: O setor será definido pelo administrador após aprovação'}
              </p>
            </div>

            <div className="text-center mt-2">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-red-500 text-white hover:opacity-90"
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Entrar com Google'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
