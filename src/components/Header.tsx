import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onAuthClick: () => void;
  onAdminClick: () => void;
}

const Header = ({ onAuthClick, onAdminClick }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span>Os melhores produtos em tecnologia • Preços especiais para revenda</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
              KECINFORSTORE
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {user && profile ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Olá, </span>
                  <span className="font-medium">{profile.email}</span>
                  {profile.is_admin && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
                {profile.is_admin && (
                  <Button variant="outline" size="sm" onClick={onAdminClick}>
                    Painel Admin
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={onAuthClick}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <User className="h-4 w-4 mr-2" />
                Login Revenda
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;