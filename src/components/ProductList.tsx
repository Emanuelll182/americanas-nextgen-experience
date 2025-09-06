import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description?: string;
  price_varejo: number;
  price_revenda: number;
  image_url?: string;
  sku?: string;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductListProps {
  searchTerm?: string;
  selectedCategory?: string;
}

const ProductList = ({ searchTerm, selectedCategory }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('categories.slug', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (product: Product) => {
    if (!profile || profile.setor === 'varejo') {
      return product.price_varejo;
    }
    return product.price_revenda;
  };

  const getPriceLabel = () => {
    if (!profile || profile.setor === 'varejo') {
      return 'Varejo';
    }
    return 'Revenda';
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '5511999999999'; // Replace with actual WhatsApp number
    const message = 'Olá! Gostaria de saber mais sobre os produtos da KECINFORSTORE.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="w-full h-48 bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded mb-4" />
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou termo de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Produtos {getPriceLabel()}
        </h2>
        <Button
          onClick={handleWhatsAppContact}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp Vendas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm overflow-hidden"
          >
            <div className="relative">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.category && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {product.category.name}
                </Badge>
              )}
              {product.sku && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 right-3 bg-white/80 text-foreground"
                >
                  {product.sku}
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="mb-4">
                <div className="text-2xl font-bold text-primary">
                  R$ {getPrice(product).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-sm text-muted-foreground">
                  ou 12x de R$ {Math.round(getPrice(product) / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 font-semibold"
                onClick={handleWhatsAppContact}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Consultar Preço
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;