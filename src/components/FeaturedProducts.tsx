import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    originalPrice: 8999,
    price: 7199,
    discount: 20,
    rating: 4.8,
    reviews: 1204,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    badge: "Oferta do Dia"
  },
  {
    id: 2,
    name: "Smart TV 55\" 4K Samsung",
    originalPrice: 2899,
    price: 2299,
    discount: 21,
    rating: 4.6,
    reviews: 856,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    badge: "Mais Vendido"
  },
  {
    id: 3,
    name: "MacBook Air M2 13\"",
    originalPrice: 9999,
    price: 8499,
    discount: 15,
    rating: 4.9,
    reviews: 523,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    badge: "Lançamento"
  },
  {
    id: 4,
    name: "AirPods Pro 2ª Geração",
    originalPrice: 1999,
    price: 1599,
    discount: 20,
    rating: 4.7,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
    badge: "Oferta do Dia"
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Produtos em destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Os produtos mais desejados com os melhores preços e qualidade garantida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {product.badge}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white text-foreground"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute bottom-3 right-3 bg-primary text-primary-foreground"
                >
                  -{product.discount}%
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({product.reviews})
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {product.originalPrice.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    R$ {product.price.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ou 12x de R$ {Math.round(product.price / 12).toLocaleString('pt-BR')}
                  </span>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90 font-semibold">
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;