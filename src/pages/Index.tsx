import { useState, useEffect } from 'react';

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Iniciando carregamento...');
    
    // Força o site a carregar em 3 segundos no máximo
    const timeout = setTimeout(() => {
      console.log('Timeout atingido - forçando carregamento');
      setLoading(false);
    }, 3000);

    // Simula dados enquanto investigamos o problema
    const mockProducts = [
      {
        id: '1',
        name: 'Notebook Gamer',
        description: 'Notebook para jogos',
        price_varejo: 2500.00,
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop'
      },
      {
        id: '2', 
        name: 'Mouse Gaming',
        description: 'Mouse para gamers',
        price_varejo: 150.00,
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'
      }
    ];

    const mockCategories = [
      { id: '1', name: 'Gamer', slug: 'gamer' },
      { id: '2', name: 'Processadores', slug: 'processadores' }
    ];

    // Simula carregamento
    setTimeout(() => {
      console.log('Carregando dados mock...');
      setProducts(mockProducts);
      setCategories(mockCategories);
      setLoading(false);
      clearTimeout(timeout);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleWhatsApp = () => {
    const phone = '5511999999999';
    const message = 'Olá! Gostaria de saber mais sobre os produtos.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando KECINFORSTORE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">KECINFORSTORE</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Seus Produtos de Informática</h2>
          <p className="text-xl">As melhores ofertas em tecnologia</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todas as categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Produtos ({products.length})</h2>
            <button 
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              📱 WhatsApp Vendas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <div className="text-xl font-bold text-blue-600 mb-3">
                    R$ {product.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    🛒 Consultar Preço
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">KECINFORSTORE</h3>
          <p className="text-gray-400">Sua loja de informática de confiança</p>
        </div>
      </footer>

      {/* Chat Bot */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg">
          💬
        </button>
      </div>
    </div>
  );
};

export default Index;