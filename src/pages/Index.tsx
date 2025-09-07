import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import SearchAndFilters from '@/components/SearchAndFilters';
import ProductList from '@/components/ProductList';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BannerCarousel from '@/components/BannerCarousel';
import ChatBot from '@/components/ChatBot';
import AuthPage from '@/components/Auth/AuthPage';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando KECINFORSTORE...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAuthClick={() => setShowAuth(true)}
        onAdminClick={() => setShowAdmin(true)}
      />
      
      <BannerCarousel />
      
      <main className="container mx-auto px-4 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        
        <ProductList
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>

      <CategoriesSection />
      <FeaturedProducts />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;