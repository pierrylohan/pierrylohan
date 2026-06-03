import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClientInterface from './components/ClientInterface';
import CompanyInterface from './components/CompanyInterface';
import { Brand, Product, Client, Order, OrderItem, Attendant, PriceTableConfig } from './types';
import { 
  INITIAL_BRANDS, 
  INITIAL_PRODUCTS, 
  INITIAL_PRICE_TABLE_NAMES, 
  INITIAL_CLIENTS, 
  INITIAL_ATTENDANTS, 
  INITIAL_ORDERS 
} from './mockData';
import { Bell, Sparkles, X, Check, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function App() {
  
  // Custom Company Branding States
  const [companyName, setCompanyName] = useState<string>(() => {
    const saved = localStorage.getItem('aura_company_name');
    return saved || 'AURA Cosmétiques';
  });

  const [companySubName, setCompanySubName] = useState<string>(() => {
    const saved = localStorage.getItem('aura_company_subname');
    return saved || 'Distribuidora de Luxe';
  });

  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>(() => {
    const saved = localStorage.getItem('aura_company_logo_url');
    return saved || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80';
  });

  const [companyDescription, setCompanyDescription] = useState<string>(() => {
    const saved = localStorage.getItem('aura_company_description');
    return saved || 'Aplicativo inteligente do distribuidor de maquiagens, séruns e loções higiênicas da empresa de cosméticos. Desenvolvido para facilitar o faturamento integrado entre clientes e administradores.';
  });

  // Custom Banner States
  const [bannerTag, setBannerTag] = useState<string>(() => {
    const saved = localStorage.getItem('aura_banner_tag');
    return saved || 'Coleção Exclusiva de Luxo';
  });

  const [bannerTitle, setBannerTitle] = useState<string>(() => {
    const saved = localStorage.getItem('aura_banner_title');
    return saved || 'A beleza refinada de dentro para fora.';
  });

  const [bannerDescription, setBannerDescription] = useState<string>(() => {
    const saved = localStorage.getItem('aura_banner_description');
    return saved || 'Selecione uma de nossas marcas exclusivas abaixo para visualizar o catálogo completo de cosméticos de alta performance, perfumes finos, maquiagens e produtos essenciais hidratantes.';
  });

  const [bannerImageUrl, setBannerImageUrl] = useState<string>(() => {
    const saved = localStorage.getItem('aura_banner_image_url');
    return saved || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500';
  });

  // 1. Core States, defaulting to LocalStorage or MockData
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('aura_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('aura_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [priceTableNames, setPriceTableNames] = useState<PriceTableConfig>(() => {
    const saved = localStorage.getItem('aura_price_tables');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_TABLE_NAMES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [attendants, setAttendants] = useState<Attendant[]>(() => {
    const saved = localStorage.getItem('aura_attendants');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANTS;
  });

  // 2. Client Portal / Selected User States
  const [currentClient, setCurrentClient] = useState<Client | null>(() => {
    const saved = localStorage.getItem('aura_current_client');
    return saved ? JSON.parse(saved) : null;
  });

  // Simulator States
  const [activeRole, setActiveRole] = useState<'client' | 'admin'>('client');
  const [clientCart, setClientCart] = useState<OrderItem[]>([]);
  
  // Notification Banner State (For when a customer sends an order, the admin side glows!)
  const [inAppNotification, setInAppNotification] = useState<{ message: string; submessage: string } | null>(null);

  // 3. Sync to localStorage when States Change
  useEffect(() => {
    localStorage.setItem('aura_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('aura_price_tables', JSON.stringify(priceTableNames));
  }, [priceTableNames]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_attendants', JSON.stringify(attendants));
  }, [attendants]);

  useEffect(() => {
    localStorage.setItem('aura_company_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('aura_company_subname', companySubName);
  }, [companySubName]);

  useEffect(() => {
    localStorage.setItem('aura_company_logo_url', companyLogoUrl);
  }, [companyLogoUrl]);

  useEffect(() => {
    localStorage.setItem('aura_company_description', companyDescription);
  }, [companyDescription]);

  useEffect(() => {
    localStorage.setItem('aura_banner_tag', bannerTag);
  }, [bannerTag]);

  useEffect(() => {
    localStorage.setItem('aura_banner_title', bannerTitle);
  }, [bannerTitle]);

  useEffect(() => {
    localStorage.setItem('aura_banner_description', bannerDescription);
  }, [bannerDescription]);

  useEffect(() => {
    localStorage.setItem('aura_banner_image_url', bannerImageUrl);
  }, [bannerImageUrl]);

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem('aura_current_client', JSON.stringify(currentClient));
    } else {
      localStorage.removeItem('aura_current_client');
    }
  }, [currentClient]);

  // 4. Handle client Authentication mechanics
  const handleClientLogin = (username: string, pass: string): boolean | string => {
    const found = clients.find(c => c.login === username);
    
    if (!found) {
      return 'Nome de usuário incorreto ou não localizado na distribuidora.';
    }

    if (found.password !== pass) {
      return 'Senha comercial incorreta. Tente novamente.';
    }

    if (found.status === 'PendenteAprovacao') {
      return 'Seu cadastro está em fase de análise de crédito pela Administradora. Acesso liberado somente após ativação.';
    }

    if (found.status === 'CadastrarDados') {
      return 'Cadastro incompleto. Preencha o formulário e simulate o e-mail de segurança de senha.';
    }

    setCurrentClient(found);
    return true; // success
  };

  const handleClientLogout = () => {
    setCurrentClient(null);
    setClientCart([]);
  };

  const handleClientRegisterRequest = (data: Omit<Client, 'id' | 'status' | 'assignedTables'>) => {
    const newRequest: Client = {
      ...data,
      id: 'cli-' + Date.now(),
      status: 'PendenteAprovacao', // will wait admin tables designation
      assignedTables: []
    };

    setClients(prev => [...prev, newRequest]);
  };

  // 5. Submit Order
  const handleClientSubmitOrder = (
    selectedTable: 'tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5',
    items: OrderItem[]
  ) => {
    if (!currentClient) return;

    const newOrder: Order = {
      id: 'ped-' + (1000 + orders.length + 1),
      clientId: currentClient.id,
      clientName: currentClient.name,
      date: new Date().toISOString(),
      selectedTable: selectedTable,
      status: 'Separacao',
      items: items,
      totalPrice: items.reduce((sum, item) => sum + item.totalPrice, 0),
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
    };

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Show beautiful real-time in-app Notification of incoming orders
    setInAppNotification({
      message: `Novo pedido recebido! Pedido #${newOrder.id}`,
      submessage: `Cliente: ${newOrder.clientName} faturou R$ ${newOrder.totalPrice.toFixed(2)}`
    });

    // Auto clear notification after 6 seconds
    setTimeout(() => {
      setInAppNotification(null);
    }, 6000);
  };

  const pendingDeliveriesVal = orders.filter(o => o.status !== 'Finalizado').length;
  const unapprovedClientsVal = clients.filter(c => c.status !== 'Ativo').length;

  return (
    <div className="font-sans antialiased text-charcoal bg-neutral-warm min-h-screen selection:bg-gold/30 selection:text-charcoal">
      
      {/* 1. Global Navigation and Brand Bar */}
      <Header
        activeRole={activeRole}
        onChangeRole={(role) => setActiveRole(role)}
        currentClient={currentClient}
        onLogout={handleClientLogout}
        pendingDeliveriesCount={pendingDeliveriesVal}
        unapprovedClientsCount={unapprovedClientsVal}
        onNavigateToCart={() => {}}
        cartItemsCount={clientCart.length}
        companyName={companyName}
        companySubName={companySubName}
        companyLogoUrl={companyLogoUrl}
      />

      {/* 2. Real-Time Order Received Notification alert (Always visible if active) */}
      {inAppNotification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm w-full bg-charcoal border border-border-warm text-white rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-top-6 duration-300">
          <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center text-charcoal shrink-0">
            <Bell className="w-5 h-5 text-charcoal animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs uppercase text-gold font-mono tracking-widest">Notificação Comercial</h5>
              <button onClick={() => setInAppNotification(null)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <p className="text-sm font-semibold mt-1">{inAppNotification.message}</p>
            <p className="text-xs text-gray-300 mt-0.5">{inAppNotification.submessage}</p>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  setActiveRole('admin');
                  setInAppNotification(null);
                }}
                className="bg-gold hover:bg-gold-hover text-charcoal font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
              >
                Abrir Menu Pedidos &rarr;
              </button>
              <button 
                onClick={() => setInAppNotification(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
              >
                Ignorar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Render Either Client view OR Admin View depending on Sim-Switcher state */}
      <main className="transition-all duration-300">
        {activeRole === 'client' ? (
          <ClientInterface
            brands={brands}
            products={products}
            clients={clients}
            priceTableNames={priceTableNames}
            orders={orders}
            attendants={attendants}
            currentClient={currentClient}
            onLogin={handleClientLogin}
            onLogout={handleClientLogout}
            onRegisterRequest={handleClientRegisterRequest}
            onSubmitOrder={handleClientSubmitOrder}
            cart={clientCart}
            setCart={setClientCart}
            bannerTag={bannerTag}
            bannerTitle={bannerTitle}
            bannerDescription={bannerDescription}
            bannerImageUrl={bannerImageUrl}
          />
        ) : (
          <CompanyInterface
            brands={brands}
            products={products}
            clients={clients}
            priceTableNames={priceTableNames}
            orders={orders}
            attendants={attendants}
            setBrands={setBrands}
            setProducts={setProducts}
            setClients={setClients}
            setPriceTableNames={setPriceTableNames}
            setOrders={setOrders}
            setAttendants={setAttendants}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companySubName={companySubName}
            setCompanySubName={setCompanySubName}
            companyLogoUrl={companyLogoUrl}
            setCompanyLogoUrl={setCompanyLogoUrl}
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
            bannerTag={bannerTag}
            setBannerTag={setBannerTag}
            bannerTitle={bannerTitle}
            setBannerTitle={setBannerTitle}
            bannerDescription={bannerDescription}
            setBannerDescription={setBannerDescription}
            bannerImageUrl={bannerImageUrl}
            setBannerImageUrl={setBannerImageUrl}
          />
        )}
      </main>

      {/* 4. Elegant Footer */}
      <footer className="no-print bg-charcoal text-gray-400 text-xs py-10 mt-12 border-t border-border-warm/20 text-center space-y-2">
        <span className="font-serif text-2xl italic font-bold text-gold block">{companyName}</span>
        <p className="max-w-md mx-auto px-4 font-light text-gray-300 text-[11px] leading-relaxed">
          {companyDescription}
        </p>
        <span className="block text-[10px] text-gray-500 font-mono pt-4 tracking-wider">© 2026 {companyName} {companySubName}. Todos os direitos reservados.</span>
      </footer>

    </div>
  );
}
