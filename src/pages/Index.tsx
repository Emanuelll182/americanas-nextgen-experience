import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from "@/components/Header";
import BannerCarousel from "@/components/BannerCarousel";
import SearchAndFilters from "@/components/SearchAndFilters";
import ProductList from "@/components/ProductList";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import AuthPage from "@/components/Auth/AuthPage";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showAdmin && profile?.is_admin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAuthClick={() => setShowAuth(true)}
        onAdminClick={() => setShowAdmin(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <BannerCarousel />
        
        <SearchAndFilters
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
        
        <ProductList 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>
      
      <Footer />
      <ChatBot />
      <Toaster />
    </div>
  );
};

export default Index;
