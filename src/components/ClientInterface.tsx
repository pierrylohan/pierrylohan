import React, { useState } from 'react';
import { 
  ArrowLeft, ShoppingCart, User, Key, CheckCircle, HelpCircle, 
  Phone, MessageSquare, ExternalLink, Sliders, FileText, Image as ImageIcon,
  ChevronRight, Info, Plus, Minus, Tag, MapPin, Eye, ShoppingBag
} from 'lucide-react';
import { Brand, Product, Client, Order, OrderItem, Attendant, PriceTableConfig } from '../types';

interface ClientInterfaceProps {
  brands: Brand[];
  products: Product[];
  clients: Client[];
  priceTableNames: PriceTableConfig;
  orders: Order[];
  attendants: Attendant[];
  currentClient: Client | null;
  onLogin: (login: string, pass: string) => boolean | string;
  onLogout: () => void;
  onRegisterRequest: (data: Omit<Client, 'id' | 'status' | 'assignedTables'>) => void;
  onSubmitOrder: (selectedTable: 'tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5', items: OrderItem[]) => void;
  cart: OrderItem[];
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  bannerTag: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerImageUrl: string;
}

export default function ClientInterface({
  brands,
  products,
  clients,
  priceTableNames,
  orders,
  attendants,
  currentClient,
  onLogin,
  onLogout,
  onRegisterRequest,
  onSubmitOrder,
  cart,
  setCart,
  bannerTag,
  bannerTitle,
  bannerDescription,
  bannerImageUrl
}: ClientInterfaceProps) {
  
  // Navigation State
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'chat' | 'history' | 'register'>('catalog');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  
  // Login & Registration state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration step flow:
  // step 1: core information, step 2: credentials prompt (email simulated)
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Table chosen for active order (must be one of currentClient's assignedTables)
  // Default to the first assigned table of the client, if logged in
  const defaultTable = currentClient && currentClient.assignedTables.length > 0 
    ? currentClient.assignedTables[0] 
    : 'tabela1';
  
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<'tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5'>(defaultTable);

  // Update selected tab / table if client changes
  React.useEffect(() => {
    if (currentClient && currentClient.assignedTables.length > 0) {
      // If current table is not assigned anymore, change to the first assigned one
      if (!currentClient.assignedTables.includes(selectedTableForOrder)) {
        setSelectedTableForOrder(currentClient.assignedTables[0]);
      }
    }
  }, [currentClient]);

  // Product helper to handle adding factors
  const [productFactors, setProductFactors] = useState<Record<string, number>>({});

  // Helper to handle login
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername || !loginPassword) {
      setLoginError('Preencha todos os campos.');
      return;
    }
    const result = onLogin(loginUsername, loginPassword);
    if (typeof result === 'string') {
      setLoginError(result);
    } else if (result === true) {
      setLoginUsername('');
      setLoginPassword('');
      setActiveTab('catalog');
    }
  };

  // Helper to handle step 1 registration
  const handleRegStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regCity) {
      alert('Por favor, preencha todos os campos do cadastro inicial.');
      return;
    }
    // Advance to credential creation step (simulating the email trigger described by prompt!)
    setRegStep(2);
  };

  const handleRegStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regLogin || !regPassword) {
      alert('Por favor, defina um login e senha para acesso.');
      return;
    }
    
    // Dispatch up to parent state
    onRegisterRequest({
      name: regName,
      email: regEmail,
      phone: regPhone,
      city: regCity,
      login: regLogin,
      password: regPassword
    });

    setRegSuccessMsg(
      `Cadastro enviado com sucesso! Seus dados foram salvos. Agora, a empresa administradora precisa efetivar a ativação no Painel e designar as suas Tabelas de Preços autorizadas.`
    );
    
    // Clear registration fields
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegCity('');
    setRegLogin('');
    setRegPassword('');
    setRegStep(1);
  };

  // Safe item factor modifier
  const updateProductFactor = (productId: string, val: number) => {
    const current = productFactors[productId] || 0;
    const nextVal = Math.max(0, current + val);
    setProductFactors(prev => ({
      ...prev,
      [productId]: nextVal
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (!currentClient) {
      alert('Você precisa estar logado com seu login autorizado pela empresa para poder realizar um pedido.');
      setActiveTab('register');
      return;
    }

    const factor = productFactors[product.id] || 0;
    if (factor <= 0) {
      alert('Por favor, defina uma quantidade (fator múltiplo) maior que 0.');
      return;
    }

    // Check price table for this item
    const priceTable = selectedTableForOrder;
    const unitPrice = product.prices[priceTable];

    const existingIndex = cart.findIndex(item => item.productId === product.id);
    const qty = factor * product.multiple;
    const total = qty * unitPrice;

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        factor: factor, // update
        quantity: qty,
        unitPrice: unitPrice,
        totalPrice: total
      };
      setCart(newCart);
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        unitPrice: unitPrice,
        factor: factor,
        multiple: product.multiple,
        quantity: qty,
        totalPrice: total
      };
      setCart([...cart, newItem]);
    }

    // Visual Feedback
    const tempToast = document.getElementById(`toast-${product.id}`);
    if (tempToast) {
      tempToast.classList.remove('opacity-0');
      tempToast.classList.add('opacity-100');
      setTimeout(() => {
        tempToast.classList.remove('opacity-100');
        tempToast.classList.add('opacity-0');
      }, 2000);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Handle checkout
  const handleCheckoutClient = () => {
    if (cart.length === 0) return;
    if (!currentClient) return;

    onSubmitOrder(selectedTableForOrder, cart);
    // Clear
    setCart([]);
    setProductFactors({});
    setActiveTab('history');
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Get pricing for a product depending on chosen table
  const getProductPrice = (product: Product) => {
    const table = selectedTableForOrder;
    return product.prices[table] || product.prices.tabela1;
  };

  // Filter products by brand
  const selectedBrand = brands.find(b => b.id === selectedBrandId);
  const filteredProducts = selectedBrandId 
    ? products.filter(p => p.brandId === selectedBrandId)
    : products;

  // Filter user specific historical orders
  const clientOrders = currentClient 
    ? orders.filter(o => o.clientId === currentClient.id)
    : [];

  // Categorize past orders into "Active" (Separação, Pronto para Retirar) and "Completed" (Finalizado)
  const activeOrders = clientOrders.filter(o => o.status !== 'Finalizado');
  const pastOrders = clientOrders.filter(o => o.status === 'Finalizado');

  return (
    <div className="bg-neutral-warm min-h-screen">
      
      {/* Secondary Client Nav Bar */}
      <div className="bg-white border-b border-border-warm sticky top-28 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 overflow-x-auto gap-2">
            
            <div className="flex gap-1.5 py-1">
              <button 
                onClick={() => { setActiveTab('catalog'); setSelectedBrandId(null); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition uppercase tracking-wider ${
                  activeTab === 'catalog' 
                    ? 'bg-charcoal text-gold border border-gold/10 shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-charcoal/5 font-semibold'
                }`}
              >
                Catálogo de Produtos
              </button>
              
              <button 
                onClick={() => setActiveTab('cart')}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 uppercase tracking-wider ${
                  activeTab === 'cart' 
                    ? 'bg-charcoal text-gold border border-gold/10 shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-charcoal/5 font-semibold'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 text-gold" />
                Carrinho ({cart.length})
              </button>

              <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 uppercase tracking-wider ${
                  activeTab === 'history' 
                    ? 'bg-charcoal text-gold border border-gold/10 shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-charcoal/5 font-semibold'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-gold" />
                Meus Pedidos ({clientOrders.length})
              </button>

              <button 
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 uppercase tracking-wider ${
                  activeTab === 'chat' 
                    ? 'bg-charcoal text-gold border border-gold/10 shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-charcoal/5 font-semibold'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold" />
                Suporte WhatsApp
              </button>
            </div>

            {!currentClient && (
              <button 
                onClick={() => { setActiveTab('register'); setRegSuccessMsg(null); }}
                className="bg-charcoal hover:bg-gold text-white hover:text-charcoal text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ml-auto border border-gold/25"
              >
                <User className="w-3.5 h-3.5" /> Criar Conta / Login
              </button>
            )}

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =======================================================
            TAB 1: CATALOG / BRAND BROWSER
           ======================================================= */}
        {activeTab === 'catalog' && (
          <div>
            
            {/* If a client is logged in, show Table Picker controls at the top */}
            {currentClient && (
              <div className="bg-white rounded-3xl p-6 mb-6 border border-border-soft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-warm text-gold border border-gold/25 shadow-2xs animate-pulse">
                    <Sliders className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
                  </div>
                  <div>
                    <h4 className="font-serif text-charcoal font-bold text-sm uppercase tracking-wide">Selecione a Tabela de Preços</h4>
                    <p className="text-xs text-gray-400">
                      Você possui <span className="font-bold text-gold">{currentClient.assignedTables.length} tabela(s)</span> liberada(s) pela faturamento. Escolha qual deseja visualizar:
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  {currentClient.assignedTables.map((tableKey) => (
                    <button
                      key={tableKey}
                      onClick={() => setSelectedTableForOrder(tableKey)}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold border transition duration-200 ${
                        selectedTableForOrder === tableKey
                          ? 'bg-charcoal border-charcoal text-gold shadow-md'
                          : 'bg-white border-border-warm text-charcoal hover:bg-neutral-warm hover:text-gold'
                      }`}
                    >
                      {priceTableNames[tableKey] || tableKey}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* If Brand has NOT been clicked -> Show Brands (Landing view) */}
            {selectedBrandId === null ? (
              <div>
                {/* Visual Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-white p-8 sm:p-12 mb-8 border border-border-soft shadow-sm flex flex-col md:flex-row items-center justify-between">
                  <div className="max-w-2xl relative z-10">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold font-bold bg-charcoal px-3 py-1.5 rounded-sm border border-gold/35 shadow-xs">
                      {bannerTag}
                    </span>
                    <h2 className="font-serif italic text-3xl sm:text-5xl text-charcoal font-bold mt-5 tracking-tight">
                      {bannerTitle}
                    </h2>
                    <p className="text-sm text-gray-500 mt-3 font-sans max-w-lg leading-relaxed">
                      {bannerDescription}
                    </p>
                  </div>
                  <div 
                    className="w-full md:w-64 h-36 md:h-44 bg-cover bg-center rounded-2xl border border-border-soft opacity-90 object-cover shrink-0 mt-6 md:mt-0 shadow-inner" 
                    style={{ backgroundImage: `url('${bannerImageUrl}')` }}
                  ></div>
                </div>

                <h3 className="font-serif italic text-2xl sm:text-3xl text-charcoal mb-6 tracking-tight flex items-center gap-1.5">
                  Nossas Marcas Registradas
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {brands.map((brand) => {
                    const brandProductsCount = products.filter(p => p.brandId === brand.id).length;
                    return (
                      <div 
                        key={brand.id}
                        onClick={() => setSelectedBrandId(brand.id)}
                        className="group bg-white rounded-3xl overflow-hidden border border-border-soft hover:border-gold shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="relative h-44 overflow-hidden bg-[#FDF8F5]">
                          <img 
                            src={brand.image} 
                            alt={brand.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent"></div>
                          <span className="absolute bottom-3 left-3 bg-charcoal text-gold text-[9px] uppercase tracking-wider font-mono px-2 py-1 rounded border border-gold/35 shadow-xs">
                            {brandProductsCount} Produtos Cadastrados
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-lg font-bold text-charcoal group-hover:text-gold transition-colors">
                              {brand.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {brand.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-border-soft flex items-center justify-between text-xs font-bold text-gold group-hover:text-gold-hover transition-colors">
                            <span className="uppercase tracking-widest text-[10px]">Explorar Catálogo</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // If Brand was clicked -> Show products inside that Brand
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <button 
                    onClick={() => setSelectedBrandId(null)}
                    className="flex items-center gap-2 text-[10px] font-bold text-charcoal bg-white border border-border-warm hover:bg-neutral-warm px-4 py-2.5 rounded-lg transition font-mono uppercase tracking-widest shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-gold" style={{ strokeWidth: '2.5px' }} /> Voltar para Marcas
                  </button>

                  <div className="text-right">
                    <span className="text-[10px] text-gold uppercase font-bold tracking-[0.2em] font-mono">Linha Profissional</span>
                    <h2 className="font-serif italic text-3xl font-bold text-charcoal mt-1">{selectedBrand?.name}</h2>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-border-soft max-w-lg mx-auto shadow-xs">
                    <HelpCircle className="w-12 h-12 text-gold mx-auto mb-2" />
                    <h3 className="font-bold text-charcoal font-serif text-lg">Nenhum produto cadastrado</h3>
                    <p className="text-xs text-gray-400 mt-1.5 font-sans">Ainda não há produtos registrados nesta marca específica pelo painel administrativo.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => {
                      const factor = productFactors[product.id] || 0;
                      const calculatedQty = factor * product.multiple;
                      const productPrice = getProductPrice(product);
                      const productTotal = calculatedQty * productPrice;

                      return (
                        <div 
                          key={product.id}
                          className="bg-white rounded-3xl border border-border-soft overflow-hidden shadow-sm hover:shadow-md hover:border-gold transition-all duration-300 flex flex-col justify-between"
                        >
                          {/* Image (Clicking opens details description) */}
                          <div 
                            onClick={() => setSelectedProductForModal(product)}
                            className="relative h-56 bg-neutral-warm overflow-hidden cursor-pointer group"
                            title="Clique para ver a descrição detalhada"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 flex items-center justify-center transition-all duration-300">
                              <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-charcoal text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm border border-border-warm flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-gold" style={{ strokeWidth: '2.5px' }} /> Ver Descrição
                              </span>
                            </div>
                            
                            {/* Stock Badge - displays even if negative! */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                              <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-3xs border backdrop-blur-md ${
                                product.stock > 0 
                                  ? 'bg-emerald-550 bg-emerald-500 text-white border-emerald-400' 
                                  : 'bg-red-500 text-white border-red-400'
                              }`}>
                                {product.stock > 0 ? `Disponível: ${product.stock} un` : `Estoque Insuficiente (${product.stock})`}
                              </span>
                              <span className="bg-charcoal text-gold border border-gold/30 text-[9px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded shadow-3xs">
                                MULT: {product.multiple} UN
                              </span>
                            </div>
                          </div>

                          {/* Info section */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-gold font-bold block font-mono">
                                {selectedBrand ? selectedBrand.name : brands.find(b => b.id === product.brandId)?.name}
                              </span>
                              <h4 className="font-serif text-base font-bold text-charcoal mt-1 min-h-[48px] line-clamp-2 leading-snug">
                                {product.name}
                              </h4>
                              
                              {/* Short slice description preview */}
                              <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-sans">
                                {product.description}
                              </p>
                              
                              <div className="mt-4 flex items-baseline justify-between py-2 bg-neutral-warm/80 px-3 rounded-lg border border-border-soft">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Unitário:</span>
                                <span className="font-mono text-sm font-bold text-charcoal">
                                  R$ {productPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>

                            {/* Control Factor input for multiples */}
                            <div className="mt-4 pt-3 border-t border-border-soft">
                              <div className="flex items-center justify-between gap-1 mb-2">
                                <span className="text-xs text-gray-400">Fator Múltiplo (x {product.multiple}):</span>
                                <div className="flex items-center gap-1.5 bg-neutral-warm rounded-lg p-1 border border-border-soft">
                                  <button 
                                    onClick={() => updateProductFactor(product.id, -1)}
                                    className="p-1 rounded bg-white hover:bg-charcoal hover:text-gold text-charcoal border border-border-soft transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-mono text-xs font-bold w-6 text-center text-charcoal">{factor}</span>
                                  <button 
                                    onClick={() => updateProductFactor(product.id, 1)}
                                    className="p-1 rounded bg-white hover:bg-charcoal hover:text-gold text-charcoal border border-border-soft transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Calculated summary */}
                              <div className="flex items-center justify-between text-xs py-1.5 border-b border-border-soft mb-4 text-gray-500 font-mono text-[11px]">
                                <span>Total Unidades:</span>
                                <span className="font-bold text-charcoal">{calculatedQty} un</span>
                              </div>

                              {/* Action Add to Cart button */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={factor <= 0}
                                  className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-1.5 shadow-sm border ${
                                    factor > 0 
                                      ? 'bg-charcoal hover:bg-gold hover:text-charcoal text-white border-gold/10 active:scale-98' 
                                      : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  }`}
                                >
                                  <ShoppingCart className="w-3.5 h-3.5 text-gold" /> Adicionar {calculatedQty > 0 ? `${calculatedQty} Itens` : ''}
                                </button>
                              </div>

                              {/* Toast feedback per product */}
                              <div 
                                id={`toast-${product.id}`}
                                className="opacity-0 pointer-events-none transition-opacity duration-300 mt-2 bg-charcoal text-gold border border-gold/30 text-[10px] text-center font-bold py-1 px-2 rounded-lg animate-pulse font-mono uppercase tracking-wider"
                              >
                                {calculatedQty} Unidades inseridas com sucesso!
                              </div>

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 2: SHOPPING CART (CARRINHO)
           ======================================================= */}
        {activeTab === 'cart' && (
          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-rose-950 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-rose-600" /> Carrinho de Compras
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-sans">
              Revise as quantidades e os valores com base na Tabela de Preços selecionada. Lembre-se, seus pedidos são limitados aos múltiplos estabelecidos pela empresa.
            </p>

            {!currentClient ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-rose-100 shadow-sm">
                <User className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                <h4 className="font-bold text-rose-950">Acesso Restrito do Carrinho</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Por motivos de auditoria de preços e conformidade da tabela, o login de cliente autorizado é obrigatório para fechar pedidos.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button 
                    onClick={() => { setActiveTab('register'); setRegSuccessMsg(null); }}
                    className="bg-rose-600 text-white text-xs px-5 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition"
                  >
                    Fazer Login ou Criar Conta de Acesso
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                <h4 className="font-bold text-rose-950">Carrinho Vazio</h4>
                <p className="text-xs text-gray-500 mt-1">Insira cosméticos de nossas marcas ativas para formular seu orçamento de atacado.</p>
                <button 
                  onClick={() => { setActiveTab('catalog'); setSelectedBrandId(null); }}
                  className="mt-6 bg-rose-600 text-white text-xs px-5 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition"
                >
                  Voltar ao Catálogo de Marcas
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
                
                {/* Active Table selection notice */}
                <div className="bg-rose-50 px-4 py-3 border-b border-rose-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-rose-950">
                    Faturando com: <span className="font-bold">{priceTableNames[selectedTableForOrder]}</span>
                  </span>
                  
                  {/* Option to change table */}
                  {currentClient.assignedTables.length > 1 && (
                    <div className="flex gap-1 items-center">
                      <span className="text-[10px] text-gray-400">Trocar Tabela:</span>
                      {currentClient.assignedTables.map(tb => (
                        <button
                          key={tb}
                          onClick={() => {
                            setSelectedTableForOrder(tb);
                            // Also update cart prices!
                            const updatedCart = cart.map(item => {
                              const prod = products.find(p => p.id === item.productId);
                              if (prod) {
                                const newPrice = prod.prices[tb];
                                return {
                                  ...item,
                                  unitPrice: newPrice,
                                  totalPrice: item.quantity * newPrice
                                };
                              }
                              return item;
                            });
                            setCart(updatedCart);
                          }}
                          className={`text-[10px] font-bold px-2 py-1 rounded border transition ${
                            selectedTableForOrder === tb 
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                              : 'bg-white text-rose-950 border-rose-200 hover:bg-rose-50'
                          }`}
                        >
                          {priceTableNames[tb].replace('Tabela ', '')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart list */}
                <div className="divide-y divide-rose-50 max-h-[400px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-4 flex gap-4 items-center justify-between flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                        />
                        <div>
                          <h5 className="font-serif text-sm font-bold text-rose-950">{item.productName}</h5>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-500 font-mono">
                              Unitário: R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                              Múltiplo: {item.multiple} un
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">
                            Fator: {item.factor} cx (total {item.quantity} un)
                          </span>
                          <span className="font-mono text-sm font-extrabold text-rose-950 block">
                            R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <button 
                          onClick={() => handleRemoveFromCart(item.productId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remover item"
                        >
                          &times; Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals panel */}
                <div className="p-4 bg-rose-50/50 border-t border-rose-100">
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
                    <span>Quantidade Total de Itens:</span>
                    <span className="font-mono font-bold text-rose-950">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} unidades
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 mb-4 border-t border-rose-100/60">
                    <span className="font-serif text-base font-bold text-rose-950">Valor Total do Pedido:</span>
                    <span className="font-mono text-xl font-extrabold text-rose-900">
                      R$ {calculateCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => { setActiveTab('catalog'); setSelectedBrandId(null); }}
                      className="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-950 font-bold text-xs py-3 rounded-xl transition text-center shadow-xs"
                    >
                      Comprar Outras Marcas
                    </button>
                    <button 
                      onClick={handleCheckoutClient}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition text-center shadow-md shadow-rose-950/10 active:scale-95"
                    >
                      Enviar Pedido para Empresa &rarr;
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 3: CHAT / ATTENDANTS WHATSAPP REDIRECTS
           ========================        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto text-center py-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold block font-mono">Suporte &amp; Logística</span>
            <h3 className="font-serif italic text-3xl font-bold text-charcoal mt-2 mb-3">Atendimento Exclusivo via WhatsApp</h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto mb-10 font-sans leading-relaxed">
              Dúvidas comerciais, liberação de tabelas especiais ou análise de crédito? Nossa equipe está pronta para atendê-lo. Toque em um dos contatos abaixo:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {attendants.map((att) => {
                const waUrl = `https://api.whatsapp.com/send?phone=${att.phone}&text=${encodeURIComponent(
                  `Olá, ${att.name}! Estou no aplicativo de pedidos da distribuidora Aura Cosméticos e gostaria de atendimento sobre faturamento/pedidos.`
                )}`;
                
                return (
                  <div key={att.id} className="bg-white rounded-3xl p-6 border border-border-soft hover:border-gold transition-all duration-300 flex flex-col items-center shadow-xs">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gold/40 mb-4 shadow-sm group cursor-pointer">
                      <img 
                        src={att.image} 
                        alt={att.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-all group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    <h4 className="font-serif font-bold text-charcoal text-base leading-tight">{att.name}</h4>
                    <p className="text-[10px] text-gold uppercase font-bold mt-1.5 tracking-widest font-mono">{att.role}</p>
                    <p className="text-[11px] text-gray-400 mt-1 font-mono">{att.phone}</p>

                    <a 
                      href={waUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-5 w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider text-[10px] border border-gold/10"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold" /> Chamar Consultora
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 4: MY ORDERS & HISTORIC ACTIVITY
          ======================================================= */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto py-4">
            <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-charcoal mb-1">Seu Histórico de Compras Aura</h3>
            <p className="text-xs text-gray-400 mb-8 font-sans">Acompanhe seus orçamentos, confira atualizações de expedição de mercadorias e status de entrega.</p>

            {!currentClient ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-border-soft shadow-sm max-w-lg mx-auto">
                <FileText className="w-12 h-12 text-gold mx-auto mb-4" />
                <h4 className="font-serif font-bold text-charcoal text-lg">Consulte sua Conta Comercial</h4>
                <p className="text-xs text-gray-450 mt-1.5 max-w-sm mx-auto text-gray-400">
                  Você precisa estar conectado a uma conta comercial ativada para salvar orçamentos e emitir novos pedidos.
                </p>
                <button 
                  onClick={() => { setActiveTab('register'); setRegSuccessMsg(null); }}
                  className="mt-6 w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal text-xs px-5 py-3.5 rounded-lg font-bold transition uppercase tracking-wider border border-gold/10"
                >
                  Fazer Login ou Criar Cadastro
                </button>
              </div>
            ) : clientOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-border-soft shadow-sm max-w-lg mx-auto">
                <FileText className="w-12 h-12 text-gold mx-auto mb-4" />
                <h4 className="font-serif font-bold text-charcoal text-lg">Sem Orçamentos Solicitados</h4>
                <p className="text-xs text-gray-400 mt-1.5">Nenhum pedido foi emitido por sua conta comercial nesta distribuidora ainda.</p>
                <button 
                  onClick={() => { setActiveTab('catalog'); setSelectedBrandId(null); }}
                  className="mt-6 w-full bg-charcoal hover:bg-gold text-white hover:text-charcoal text-xs px-5 py-3.5 rounded-lg font-bold transition uppercase tracking-wider border border-gold/10"
                >
                  Navegar no Catálogo de Marcas
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Active orders */}
                {activeOrders.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-800 mb-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-550 inline-block animate-ping"></span>
                      Pedidos em Faturamento / Expedição
                    </h4>
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-50 mb-4">
                            <div>
                              <span className="text-xs font-mono font-bold text-rose-900 bg-rose-50 px-2 py-1 rounded">
                                Registro: {order.id}
                              </span>
                              <span className="text-[11px] text-gray-500 ml-3">
                                Emitido em: {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                              order.status === 'Separacao' 
                                ? 'bg-amber-100 text-amber-805 border border-amber-200' 
                                : 'bg-blue-105 text-blue-900 border border-blue-200'
                            }`}>
                              📦 {order.status === 'Separacao' ? 'Em Separação' : 'Mídias Prontas / Pronto para Retirar'}
                            </span>
                          </div>

                          {/* Items in order */}
                          <div className="space-y-3">
                            {order.items.map(it => (
                              <div key={it.productId} className="flex justify-between items-center text-xs py-1 border-b border-dashed border-rose-50/50">
                                <span className="text-gray-700">{it.productName}</span>
                                <span className="font-medium text-rose-950 font-mono">
                                  {it.quantity} un (fator {it.factor} x {it.multiple}) &mdash; R$ {it.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-t border-rose-50 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Tabela aplicada: <span className="font-semibold text-rose-950">{priceTableNames[order.selectedTable]}</span>
                            </span>
                            <span className="font-mono text-base font-extrabold text-rose-900">
                              Total: R$ {order.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finalized orders */}
                {pastOrders.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3 flex items-center gap-1">
                      ✅ Histórico de Compras Finalizadas (Orçamentos Arquivados)
                    </h4>
                    <div className="space-y-4">
                      {pastOrders.map((order) => (
                        <div key={order.id} className="bg-white/80 rounded-2xl border border-gray-150 p-5 shadow-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-4">
                            <div>
                              <span className="text-xs font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                Registro: {order.id}
                              </span>
                              <span className="text-[11px] text-gray-500 ml-3">
                                Concluído em: {new Date(order.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-250 rounded-full">
                              ✓ Finalizado & Pago
                            </span>
                          </div>

                          <div className="space-y-3">
                            {order.items.map(it => (
                              <div key={it.productId} className="flex justify-between items-center text-xs py-1 border-b border-dashed border-gray-100 text-gray-600">
                                <span>{it.productName}</span>
                                <span className="font-mono">{it.quantity} un &mdash; R$ {it.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Tabela aplicada: {priceTableNames[order.selectedTable]}
                            </span>
                            <span className="font-mono text-base font-bold text-gray-800">
                              Total: R$ {order.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 5: LOGIN / CREATE ACCOUNT PANEL
           ======================================================= */}
        {activeTab === 'register' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
              
              {/* Left Column: Login */}
              <div className="pr-0 md:pr-8 border-r-0 md:border-r border-rose-150">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-rose-950">Acessar com Login Autorizado</h3>
                    <p className="text-xs text-gray-500">Caso possua login e senha disponibilizado comercialmente.</p>
                  </div>
                </div>

                <form onSubmit={handleFormLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nome de Usuário (Login)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: juliana"
                      value={loginUsername}
                      onChange={e => setLoginUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Senha de Acesso</label>
                    <input 
                      type="password"
                      placeholder="Sua senha numérica ou alfabética"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  {loginError && (
                    <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-150 p-2.5 rounded-lg">
                      ❌ {loginError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-rose-650 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    Entrar na Conta de Compras
                  </button>
                </form>

                {/* Simulation Shortcut boxes for speed-testing */}
                <div className="mt-8 pt-6 border-t border-rose-50">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-500 mb-2">Simular Clientes Ativos de Teste:</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        onLogin('juliana', '123');
                        setActiveTab('catalog');
                      }}
                      className="w-full text-left bg-rose-50 hover:bg-rose-100 border border-rose-100 p-2.5 rounded-xl text-xs transition"
                    >
                      <span className="font-bold text-rose-950 block">Juliana Silva Cosméticos</span>
                      <span className="text-[10px] text-gray-500 block">Login: <code className="font-mono bg-white px-1 py-0.5 rounded border">juliana</code> | Senha: <code className="font-mono bg-white px-1 py-0.5 rounded border">123</code> (Assinatura: Tabela 1 e 3)</span>
                    </button>

                    <button 
                      onClick={() => {
                        onLogin('belladonna', 'bella');
                        setActiveTab('catalog');
                      }}
                      className="w-full text-left bg-rose-50 hover:bg-rose-100 border border-rose-100 p-2.5 rounded-xl text-xs transition"
                    >
                      <span className="font-bold text-rose-950 block">Distribuidora Bella Donna</span>
                      <span className="text-[10px] text-gray-500 block">Login: <code className="font-mono bg-white px-1 py-0.5 rounded border">belladonna</code> | Senha: <code className="font-mono bg-white px-1 py-0.5 rounded border">bella</code> (Assinatura: Tabela 4 e 5)</span>
                    </button>
                  </div>
                </div>
              </div>


              {/* Right Column: Sign Up Flow */}
              <div className="pl-0 md:pl-4 mt-8 md:mt-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-rose-950">Novo Cadastro Aura</h3>
                    <p className="text-xs text-gray-500">Envie suas informações para liberação de acesso de atacado.</p>
                  </div>
                </div>

                {regSuccessMsg ? (
                  <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-2xl text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <h4 className="font-bold text-emerald-950 text-sm">Formulário de Cadastro Concluído</h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {regSuccessMsg}
                    </p>
                    <div className="mt-4 p-2 bg-white rounded-lg border border-dashed text-[11px] text-gray-500 text-left">
                      💡 <b>Como testar a aprovação agora?</b>
                      <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                        <li>Clique no menu azul acima: <b>Área Empresa (Painel)</b>.</li>
                        <li>Navegue até a aba <b>Clientes Ativação</b>.</li>
                        <li>Selecione o cliente que você cadastrou, aprove o cadastro, designe as tabelas de faturamento dele e clique em Salvar!</li>
                        <li>Volte para a Área Cliente e realize o login.</li>
                      </ol>
                    </div>
                  </div>
                ) : regStep === 1 ? (
                  /* STEP 1: INITIAL COMPREHENSIVE REGISTRATION FORM */
                  <form onSubmit={handleRegStep1} className="space-y-4">
                    <div className="p-2 border border-blue-100 bg-blue-50/55 rounded-xl text-[10px] text-blue-900 leading-normal mb-1">
                      ⚠️ <b>Fluxo de Segurança Aura:</b> Preencha os campos iniciais. No passo subsequente você simulará a resposta ao e-mail para cadastrar sua senha.
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nome Fantasia ou Completo *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Farmácia Essencial LTDA"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Endereço de E-mail *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="Ex: contato@essencial.com.br"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Telefone WhatsApp *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="Ex: (11) 99999-8888"
                          value={regPhone}
                          onChange={e => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Cidade da Loja *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ex: Ribeirão Preto"
                          value={regCity}
                          onChange={e => setRegCity(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs"
                    >
                      Avançar para Definir Login e Senha &rarr;
                    </button>
                  </form>
                ) : (
                  /* STEP 2: CREDENTIAL GENERATION - SIMULATING EMAIL LINK CLICK DESCRIBED IN USER SPEC */
                  <form onSubmit={handleRegStep2} className="space-y-4">
                    <div className="p-3 border border-indigo-200 bg-indigo-50 rounded-xl">
                      <h5 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                        📨 Simulação de E-mail de Segurança
                      </h5>
                      <p className="text-[10px] text-indigo-805 leading-relaxed">
                        Detectamos o recebimento automático do e-mail de faturamento de credenciais Aura. Preencha agora a chave de usuário e a senha que utilizará para acessar o portal de pedidos no futuro:
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Código de Usuário Desejado (Login) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: essencias_farm"
                        value={regLogin}
                        onChange={e => setRegLogin(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Senha Numérica Segura *</label>
                      <input 
                        type="password" 
                        required
                        placeholder="Ex: 8765432"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setRegStep(1)}
                        className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        Voltar
                      </button>
                      <button 
                        type="submit" 
                        className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs"
                      >
                        Enviar para Liberação de Acesso &rarr;
                      </button>
                    </div>
                  </form>
                )}

              </div>

            </div>
          </div>
        )}

      </div>

      {/* =======================================================
          MODAL: FULL PRODUCT DETAIL DESCRIPTION & MULTIPLES INFO
         ======================================================= */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full border border-rose-100 shadow-xl relative animate-in fade-in zoom-in duration-300">
            
            <button 
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 bg-white/85 hover:bg-rose-100 text-rose-950 p-1.5 rounded-full shadow transition-colors"
            >
              &times; Fechar
            </button>

            <img 
              src={selectedProductForModal.image} 
              alt={selectedProductForModal.name}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <span className="text-[11px] uppercase tracking-wider text-rose-500 font-bold font-sans">
                {brands.find(b => b.id === selectedProductForModal.brandId)?.name}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950 mt-1 mb-3">
                {selectedProductForModal.name}
              </h3>

              <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed bg-rose-50/20 p-3 rounded-xl border border-rose-100/50">
                <b>Descrição Técnica do Cosmético:</b><br />
                {selectedProductForModal.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-rose-50 text-xs">
                <div>
                  <span className="text-gray-400 block">Estoque Físico Atual:</span>
                  <span className={`font-mono font-bold block text-sm ${selectedProductForModal.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedProductForModal.stock} unidades
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Restrição de Compra:</span>
                  <span className="font-mono font-bold block text-sm text-yellow-750">
                    Múltiplo de {selectedProductForModal.multiple} un
                  </span>
                </div>
              </div>

              {/* Price list overview inside description */}
              <div className="mt-4">
                <span className="text-[11px] text-gray-400 block mb-1.5">Lista de Preços (Selecione a tabela ativa no menu para carregar no carrinho):</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 rounded-lg border text-xs ${selectedTableForOrder === 'tabela1' ? 'bg-rose-50/50 border-rose-300 font-bold' : 'bg-gray-50/20 border-gray-100'}`}>
                    <span className="text-[10px] text-gray-400 block truncate">{priceTableNames.tabela1}</span>
                    <span className="font-mono text-rose-950">R$ {selectedProductForModal.prices.tabela1.toFixed(2)}</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-xs ${selectedTableForOrder === 'tabela2' ? 'bg-rose-50/50 border-rose-300 font-bold' : 'bg-gray-50/20 border-gray-100'}`}>
                    <span className="text-[10px] text-gray-400 block truncate">{priceTableNames.tabela2}</span>
                    <span className="font-mono text-rose-950">R$ {selectedProductForModal.prices.tabela2.toFixed(2)}</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-xs ${selectedTableForOrder === 'tabela3' ? 'bg-rose-50/50 border-rose-300 font-bold' : 'bg-gray-50/20 border-gray-100'}`}>
                    <span className="text-[10px] text-gray-400 block truncate">{priceTableNames.tabela3}</span>
                    <span className="font-mono text-rose-950">R$ {selectedProductForModal.prices.tabela3.toFixed(2)}</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-xs ${selectedTableForOrder === 'tabela4' ? 'bg-rose-50/50 border-rose-300 font-bold' : 'bg-gray-50/20 border-gray-100'}`}>
                    <span className="text-[10px] text-gray-400 block truncate">{priceTableNames.tabela4}</span>
                    <span className="font-mono text-rose-950">R$ {selectedProductForModal.prices.tabela4.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
