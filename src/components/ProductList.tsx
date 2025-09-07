import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price_varejo: number;
  price_revenda: number;
  image_url?: string;
  sku?: string;
}

interface ProductListProps {
  searchTerm?: string;
  selectedCategory?: string;
}

const ProductList = ({ searchTerm, selectedCategory }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products with simple query...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(50);

      console.log('Simple product fetch result:', { data, error, count: data?.length });

      if (error) {
        console.error('Products error:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '5511999999999';
    const message = 'Olá! Gostaria de saber mais sobre os produtos da KECINFORSTORE.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Carregando produtos...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-6 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  console.log('Rendering products:', products.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Produtos ({products.length})
        </h2>
        <Button
          onClick={handleWhatsAppContact}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp Vendas
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600">Verifique sua conexão ou tente novamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.sku && (
                  <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
                    {product.sku}
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="mb-4">
                  <div className="text-xl font-bold text-blue-600">
                    R$ {product.price_varejo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleWhatsAppContact}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Consultar Preço
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;