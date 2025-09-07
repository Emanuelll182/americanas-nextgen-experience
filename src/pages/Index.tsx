import { useState, useEffect } from 'react';
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

  console.log('🏠 Index render - loading:', loading);
  
  // Force load after 5 seconds if still loading (prevents infinite loading)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Force loading timeout after 5 seconds');
        // Force render even if loading
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);
  
  // Show loading for maximum 5 seconds, then force show content
  const [forceRender, setForceRender] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Backup timeout - forcing load');
      setForceRender(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  
  if (loading && !forceRender) {
    console.log('🏠 Showing loading screen');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando KECINFORSTORE...</p>
        </div>
      </div>
    );
  }

  console.log('🏠 Showing main content');

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
      
      <FeaturedProducts />
      
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
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;