import { Card, CardContent } from "@/components/ui/card";
import { 
  Smartphone, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones, 
  Printer, 
  Server, 
  Gamepad2, 
  HardDrive, 
  Laptop 
} from "lucide-react";

const categories = [
  { name: "Celulares", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Notebooks", icon: Laptop, color: "bg-green-100 text-green-600" },
  { name: "Monitores", icon: Monitor, color: "bg-purple-100 text-purple-600" },
  { name: "Periféricos", icon: Keyboard, color: "bg-pink-100 text-pink-600" },
  { name: "Mouses", icon: Mouse, color: "bg-orange-100 text-orange-600" },
  { name: "Headsets", icon: Headphones, color: "bg-indigo-100 text-indigo-600" },
  { name: "Impressoras", icon: Printer, color: "bg-red-100 text-red-600" },
  { name: "Armazenamento", icon: HardDrive, color: "bg-yellow-100 text-yellow-600" },
  { name: "Servidores", icon: Server, color: "bg-teal-100 text-teal-600" },
  { name: "Gamer", icon: Gamepad2, color: "bg-rose-100 text-rose-600" },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore nossas categorias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo em informática e tecnologia para você ou sua empresa
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name} 
                className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
}; eu 

export default CategoriesSection;
