import { useState } from 'react';
import Header from "@/components/Header";
import SimpleBannerCarousel from "@/components/SimpleBannerCarousel";
import SearchAndFilters from "@/components/SearchAndFilters";
import ProductList from "@/components/ProductList";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import AuthPage from "@/components/Auth/AuthPage";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import AdminNotice from "@/components/AdminNotice";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simplified loading - no useAuth dependency for now
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
        <AdminNotice />
        <SimpleBannerCarousel />
        
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