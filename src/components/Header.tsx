import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span>Frete GRÁTIS para todo o Brasil a partir de R$ 199 • Desconto de até 70% OFF</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Americanas
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input 
                placeholder="Busque aqui seu produto..." 
                className="pr-12 h-12 border-2 border-muted focus:border-primary"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 bg-gradient-primary hover:opacity-90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 mt-4 pt-4 border-t">
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Todas as categorias
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Ofertas do Dia
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Eletrônicos
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Casa & Decoração
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Moda
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Beleza
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Esportes
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Livros
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;