import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Smartphone, 
  Home, 
  Shirt, 
  Sparkles, 
  Dumbbell, 
  Book, 
  Gamepad2,
  Car,
  Package,
  Monitor,
  Cpu,
  Zap
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoriesSectionProps {
  onCategorySelect?: (categorySlug: string) => void;
}

// Icon mapping for different categories
const getCategoryIcon = (slug: string) => {
  const iconMap: { [key: string]: any } = {
    'hardware': Cpu,
    'processadores': Cpu,
    'monitores': Monitor,
    'gamer': Gamepad2,
    'fontes-atx': Zap,
    'impressoras-leitores': Package,
    'produtos-diversos': Package,
    'produtos-populares': Sparkles,
  };
  return iconMap[slug] || Package;
};

const getCategoryColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-orange-100 text-orange-600",
    "bg-indigo-100 text-indigo-600",
    "bg-red-100 text-red-600",
    "bg-yellow-100 text-yellow-600",
  ];
  return colors[index % colors.length];
};

const CategoriesSection = ({ onCategorySelect }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Categories error:', error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    if (onCategorySelect) {
      onCategorySelect(categorySlug);
    }
    // Scroll to products section
    const productSection = document.querySelector('main');
    productSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore nossas categorias
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore nossas categorias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você procura em nossa ampla variedade de produtos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.slug);
            const colorClass = getCategoryColor(index);
            
            return (
              <Card 
                key={category.id} 
                className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
