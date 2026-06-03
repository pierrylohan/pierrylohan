import React, { useState } from 'react';
import { 
  ShoppingBag, Users, Sliders, Settings, Package, Plus, Trash2, 
  Edit, Table, Eye, Printer, CheckCircle, Clock, Trash, Key, AlertTriangle,
  UserCheck, RefreshCw, X, Check, Save, Image as ImageIcon, Phone, MessageSquare,
  Sparkles
} from 'lucide-react';
import { Brand, Product, Client, Order, OrderItem, Attendant, PriceTableConfig } from '../types';

interface CompanyInterfaceProps {
  brands: Brand[];
  products: Product[];
  clients: Client[];
  priceTableNames: PriceTableConfig;
  orders: Order[];
  attendants: Attendant[];
  
  // Setters to update global state in real-time
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setPriceTableNames: React.Dispatch<React.SetStateAction<PriceTableConfig>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setAttendants: React.Dispatch<React.SetStateAction<Attendant[]>>;

  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  companySubName: string;
  setCompanySubName: React.Dispatch<React.SetStateAction<string>>;
  companyLogoUrl: string;
  setCompanyLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  companyDescription: string;
  setCompanyDescription: React.Dispatch<React.SetStateAction<string>>;

  bannerTag: string;
  setBannerTag: React.Dispatch<React.SetStateAction<string>>;
  bannerTitle: string;
  setBannerTitle: React.Dispatch<React.SetStateAction<string>>;
  bannerDescription: string;
  setBannerDescription: React.Dispatch<React.SetStateAction<string>>;
  bannerImageUrl: string;
  setBannerImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

export default function CompanyInterface({
  brands,
  products,
  clients,
  priceTableNames,
  orders,
  attendants,
  setBrands,
  setProducts,
  setClients,
  setPriceTableNames,
  setOrders,
  setAttendants,
  companyName,
  setCompanyName,
  companySubName,
  setCompanySubName,
  companyLogoUrl,
  setCompanyLogoUrl,
  companyDescription,
  setCompanyDescription,
  bannerTag,
  setBannerTag,
  bannerTitle,
  setBannerTitle,
  bannerDescription,
  setBannerDescription,
  bannerImageUrl,
  setBannerImageUrl
}: CompanyInterfaceProps) {
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'clients' | 'tables' | 'attendants'>('orders');
  
  // Modals & States
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null);
  const [isCreatingAttendant, setIsCreatingAttendant] = useState(false);

  // Form: Create/Edit Product
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pBrandId, setPBrandId] = useState('');
  const [pImage, setPImage] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pStock, setPStock] = useState(10);
  const [pMultiple, setPMultiple] = useState(5);
  const [pPrices, setPPrices] = useState({
    tabela1: 0,
    tabela2: 0,
    tabela3: 0,
    tabela4: 0,
    tabela5: 0
  });

  // Form: Custom Table Names
  const [tableConfigs, setTableConfigs] = useState<PriceTableConfig>({ ...priceTableNames });

  // Form: Manage Brand Lines
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);
  const [bId, setBId] = useState('');
  const [bName, setBName] = useState('');
  const [bDescription, setBDescription] = useState('');
  const [bImage, setBImage] = useState('');

  const startEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsCreatingBrand(false);
    setBId(brand.id);
    setBName(brand.name);
    setBDescription(brand.description || '');
    setBImage(brand.image || '');
  };

  const startCreateBrand = () => {
    setEditingBrand(null);
    setIsCreatingBrand(true);
    setBId('brand-' + Date.now());
    setBName('');
    setBDescription('');
    setBImage('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80');
  };

  const saveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName) {
      alert('Nome da linha/marca é obrigatório.');
      return;
    }

    const payload: Brand = {
      id: bId,
      name: bName,
      description: bDescription,
      image: bImage || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'
    };

    if (isCreatingBrand) {
      setBrands(prev => [...prev, payload]);
      alert('Linha de cosméticos criada com sucesso!');
    } else {
      setBrands(prev => prev.map(b => b.id === bId ? payload : b));
      alert('Linha de cosméticos atualizada com sucesso!');
    }

    setEditingBrand(null);
    setIsCreatingBrand(false);
  };

  const deleteBrand = (brandId: string) => {
    const associatedProducts = products.filter(p => p.brandId === brandId);
    if (associatedProducts.length > 0) {
      alert(`Não é possível excluir esta linha. Existem ${associatedProducts.length} produtos cadastrados nela.`);
      return;
    }

    if (confirm('Deseja realmente excluir esta linha de produtos?')) {
      setBrands(prev => prev.filter(b => b.id !== brandId));
    }
  };

  // Form: Approve Client
  const [clientUnderApproval, setClientUnderApproval] = useState<Client | null>(null);
  const [clientLogin, setClientLogin] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientTables, setClientTables] = useState<('tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5')[]>([]);

  // Form: Edit Attendant
  const [aId, setAId] = useState('');
  const [aName, setAName] = useState('');
  const [aRole, setARole] = useState('');
  const [aPhone, setAPhone] = useState('');
  const [aImage, setAImage] = useState('');

  // Active orders (non-Finalizado)
  const activeOrders = orders.filter(o => o.status !== 'Finalizado');

  // Trigger print view
  const triggerPrint = () => {
    window.print();
  };

  // Change Order Status
  const handleOrderStatusChange = (orderId: string, nextStatus: 'Separacao' | 'Pronto para retirar' | 'Finalizado') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus
        };
      }
      return o;
    }));
  };

  // Save customized Price Table Names
  const handleSaveTableNames = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceTableNames(tableConfigs);
    alert('Nomes das tabelas de preços atualizados com sucesso!');
  };

  // Start Product edit
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingProduct(false);
    setPId(prod.id);
    setPName(prod.name);
    setPBrandId(prod.brandId);
    setPImage(prod.image);
    setPDescription(prod.description);
    setPStock(prod.stock);
    setPMultiple(prod.multiple);
    setPPrices({ ...prod.prices });
  };

  const startCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
    setPId('prod-' + Date.now());
    setPName('');
    setPBrandId(brands[0]?.id || '');
    setPImage('https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80');
    setPDescription('');
    setPStock(50);
    setPMultiple(5);
    setPPrices({
      tabela1: 50,
      tabela2: 45,
      tabela3: 40,
      tabela4: 35,
      tabela5: 30
    });
  };

  // Save product registration or edits
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pBrandId) {
      alert('Preencha os campos obrigatórios (*).');
      return;
    }

    const payload: Product = {
      id: pId,
      name: pName,
      brandId: pBrandId,
      image: pImage || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
      description: pDescription,
      stock: Number(pStock),
      multiple: Number(pMultiple) || 1,
      prices: {
        tabela1: Number(pPrices.tabela1) || 0,
        tabela2: Number(pPrices.tabela2) || 0,
        tabela3: Number(pPrices.tabela3) || 0,
        tabela4: Number(pPrices.tabela4) || 0,
        tabela5: Number(pPrices.tabela5) || 0
      }
    };

    if (isCreatingProduct) {
      setProducts(prev => [...prev, payload]);
      alert('Produto cadastrado com sucesso!');
    } else {
      setProducts(prev => prev.map(p => p.id === pId ? payload : p));
      alert('Produto editado com sucesso!');
    }

    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza de que deseja remover este cosmético do catálogo?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Client Approval Trigger
  const startApproval = (client: Client) => {
    setClientUnderApproval(client);
    setClientLogin(client.login || client.name.toLowerCase().replace(/\s/g, ''));
    setClientPassword(client.password || '123456');
    setClientTables(client.assignedTables);
  };

  const handleToggleClientTable = (tableKey: 'tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5') => {
    if (clientTables.includes(tableKey)) {
      setClientTables(prev => prev.filter(t => t !== tableKey));
    } else {
      // Check if already has 2
      if (clientTables.length >= 2) {
        alert('Regra Aura: Para faturar de forma assertiva, o cliente deve receber de uma (1) a no máximo duas (2) tabelas ativas.');
        return;
      }
      setClientTables(prev => [...prev, tableKey]);
    }
  };

  const saveApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientUnderApproval) return;
    if (clientTables.length === 0) {
      alert('Por favor, designe pelo menos 1 tabela de preços para este cliente visualizar na hora do pedido de compra.');
      return;
    }
    if (clientTables.length > 2) {
      alert('Selecione no máximo 2 tabelas para faturamento.');
      return;
    }

    setClients(prev => prev.map(c => {
      if (c.id === clientUnderApproval.id) {
        return {
          ...c,
          status: 'Ativo',
          login: clientLogin,
          password: clientPassword,
          assignedTables: clientTables
        };
      }
      return c;
    }));

    alert(`Cliente "${clientUnderApproval.name}" ativado com sucesso! Tabelas liberadas.`);
    setClientUnderApproval(null);
  };

  // Start Active Order Edit (Editar Pedido ou excluir item)
  const startEditOrder = (order: Order) => {
    // Deep clone order for isolated edits
    setEditingOrder(JSON.parse(JSON.stringify(order)));
  };

  const updateOrderItemFactor = (productId: string, val: number) => {
    if (!editingOrder) return;
    const item = editingOrder.items.find(i => i.productId === productId);
    if (!item) return;

    const nextFactor = Math.max(1, item.factor + val);
    const prevQty = item.quantity;
    
    item.factor = nextFactor;
    item.quantity = nextFactor * item.multiple;
    item.totalPrice = item.quantity * item.unitPrice;

    // Recalculate whole order totals
    editingOrder.totalQuantity = editingOrder.items.reduce((sum, i) => sum + i.quantity, 0);
    editingOrder.totalPrice = editingOrder.items.reduce((sum, i) => sum + i.totalPrice, 0);

    setEditingOrder({ ...editingOrder });
  };

  const removeProductFromOrder = (productId: string) => {
    if (!editingOrder) return;
    if (editingOrder.items.length <= 1) {
      alert('Para excluir o último item, use a opção de exclusão do pedido.');
      return;
    }

    if (confirm('Deseja excluir permanentemente este cosmético específico do pedido do cliente?')) {
      editingOrder.items = editingOrder.items.filter(i => i.productId !== productId);
      
      // Reset totals
      editingOrder.totalQuantity = editingOrder.items.reduce((sum, i) => sum + i.quantity, 0);
      editingOrder.totalPrice = editingOrder.items.reduce((sum, i) => sum + i.totalPrice, 0);
      setEditingOrder({ ...editingOrder });
    }
  };

  const saveOrderEdits = () => {
    if (!editingOrder) return;
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? editingOrder : o));
    alert('Pedido ajustado e salvo com sucesso!');
    setEditingOrder(null);
  };

  const deleteEntireOrder = (orderId: string) => {
    if (confirm('Tem certeza de que deseja EXCLUIR e CANCELAR este pedido inteiro dos servidores?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  // Brand logo/image editor trigger
  const updateBrandImage = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;
    const nextUrl = prompt(`Editar foto/imagem da marca "${brand.name}":`, brand.image);
    if (nextUrl) {
      setBrands(prev => prev.map(b => b.id === brandId ? { ...b, image: nextUrl } : b));
      alert('Foto da marca atualizada!');
    }
  };

  // Attendant state managers
  const startEditAttendant = (att: Attendant) => {
    setEditingAttendant(att);
    setIsCreatingAttendant(false);
    setAId(att.id);
    setAName(att.name);
    setARole(att.role);
    setAPhone(att.phone);
    setAImage(att.image);
  };

  const startCreateAttendant = () => {
    setEditingAttendant(null);
    setIsCreatingAttendant(true);
    setAId('att-' + Date.now());
    setAName('');
    setARole('Vendas Atacado');
    setAPhone('5511');
    setAImage('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  };

  const saveAttendant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName || !aPhone) {
      alert('Nome e celular do WhatsApp são obrigatórios.');
      return;
    }

    const payload: Attendant = {
      id: aId,
      name: aName,
      role: aRole,
      phone: aPhone,
      image: aImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    };

    if (isCreatingAttendant) {
      setAttendants(prev => [...prev, payload]);
      alert('Atendente cadastrada com sucesso!');
    } else {
      setAttendants(prev => prev.map(a => a.id === aId ? payload : a));
      alert('Atendente atualizada!');
    }

    setEditingAttendant(null);
    setIsCreatingAttendant(false);
  };

  const deleteAttendant = (attId: string) => {
    if (confirm('Deseja excluir esta atendente de WhatsApp do aplicativo?')) {
      setAttendants(prev => prev.filter(a => a.id !== attId));
    }
  };

  return (
    <div className="bg-neutral-warm min-h-screen">
      
      {/* Mini Breadcrumb Admin header */}
      <div className="bg-charcoal text-white py-3.5 border-b border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            <span className="font-bold uppercase tracking-widest font-mono text-gold text-[10px]">Administrador Aura:</span>
            <span className="text-gray-300 font-sans">Painel de Logística & Auditoria Comercial ({orders.length} pedidos totais)</span>
          </div>

          <span className="text-[10px] font-mono text-gold/60 uppercase tracking-widest">Aura Commercial Suite 2026</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Dashboard Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mb-10 bg-white p-3 rounded-3xl border border-border-soft shadow-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-charcoal text-gold border border-gold/15 shadow-sm' 
                : 'text-charcoal hover:text-gold hover:bg-neutral-warm'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
              {activeOrders.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-charcoal border border-gold/45 text-gold font-mono font-bold w-4.5 h-4.5 rounded-full text-[9px] flex items-center justify-center shadow-xs">
                  {activeOrders.length}
                </span>
              )}
            </div>
            <span className="uppercase tracking-wider font-mono text-[9px]">Pedidos Ativos ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-charcoal text-gold border border-gold/15 shadow-sm' 
                : 'text-charcoal hover:text-gold hover:bg-neutral-warm'
            }`}
          >
            <Package className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
            <span className="uppercase tracking-wider font-mono text-[9px]">Cadastrar Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`py-4 px-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-2 ${
              activeTab === 'clients' 
                ? 'bg-charcoal text-gold border border-gold/15 shadow-sm' 
                : 'text-charcoal hover:text-gold hover:bg-neutral-warm'
            }`}
          >
            <Users className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
            <span className="uppercase tracking-wider font-mono text-[9px]">Clientes Ativação</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`py-4 px-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-2 ${
              activeTab === 'tables' 
                ? 'bg-charcoal text-gold border border-gold/15 shadow-sm' 
                : 'text-charcoal hover:text-gold hover:bg-neutral-warm'
            }`}
          >
            <Settings className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
            <span className="uppercase tracking-wider font-mono text-[9px]">Ajustes & Linhas</span>
          </button>

          <button
            onClick={() => setActiveTab('attendants')}
            className={`py-4 px-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-2 col-span-2 md:col-span-1 ${
              activeTab === 'attendants' 
                ? 'bg-charcoal text-gold border border-gold/15 shadow-sm' 
                : 'text-charcoal hover:text-gold hover:bg-neutral-warm'
            }`}
          >
            <Phone className="w-5 h-5 text-gold" style={{ strokeWidth: '2.5px' }} />
            <span className="uppercase tracking-wider font-mono text-[9px]">Atendentes WhatsApp</span>
          </button>
        </div>


        {/* =======================================================
            TAB 1: MANAGING ACTIVE ORDERS (PEDIDOS ATIVOS)
           ======================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Pedidos Comerciais em Aberto</h3>
                <p className="text-xs text-gray-500">Mude ordens de separação, faça ajustes de estoque ou imprima o comprovante comercial.</p>
              </div>
              
              <div className="flex gap-2 text-xs bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 font-sans max-w-sm">
                📢 <b>Notificação de Pedido:</b> Sempre que um comprador finaliza a compra, ela aparece automaticamente aqui com destaque!
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-rose-100 p-12 text-center max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800">Tudo em dia por aqui!</h4>
                <p className="text-xs text-gray-500 mt-1">Todos os pedidos foram marcados como <b>Finalizados</b> e foram movidos para o histórico definitivo de compras dos clientes.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 transition hover:shadow-md"
                  >
                    
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-extrabold text-rose-800">
                            PEDIDO #{order.id}
                          </span>
                          <span className="bg-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                            {priceTableNames[order.selectedTable]}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 mt-1 flex items-center gap-1 text-sm">
                          💼 {order.clientName}
                        </h4>
                      </div>

                      {/* Logistical status selector */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-gray-400 font-bold whitespace-nowrap">Status Logístico:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => handleOrderStatusChange(order.id, 'Separacao')}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                              order.status === 'Separacao' 
                                ? 'bg-amber-600 text-white shadow-xs' 
                                : 'text-amber-800 hover:bg-amber-50'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Separação
                          </button>
                          
                          <button
                            onClick={() => handleOrderStatusChange(order.id, 'Pronto para retirar')}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                              order.status === 'Pronto para retirar' 
                                ? 'bg-blue-600 text-white shadow-xs' 
                                : 'text-blue-800 hover:bg-blue-50'
                            }`}
                          >
                            📦 Pronto p/ Retirar
                          </button>

                          <button
                            onClick={() => {
                              // Stock deduct simulations described: Reduce product stock on finalization!
                              order.items.forEach(item => {
                                const prod = products.find(p => p.id === item.productId);
                                if (prod) prod.stock -= item.quantity;
                              });
                              // Save status
                              handleOrderStatusChange(order.id, 'Finalizado');
                            }}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition flex items-center gap-1 ml-1 shadow-xs"
                            title="Desfoca para histórico definitivo e ajusta estoque"
                          >
                            <Check className="w-3.5 h-3.5" /> Finalizado &rarr;
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Rows */}
                    <div className="space-y-3 pl-1 pr-1">
                      <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 pb-2 border-b border-rose-50">
                        <span className="col-span-6">Cosmético / Embalagem</span>
                        <span className="col-span-2 text-right">Preço Unitário</span>
                        <span className="col-span-2 text-right">Comprado (un)</span>
                        <span className="col-span-2 text-right">Subtotal</span>
                      </div>

                      {order.items.map((item) => (
                        <div key={item.productId} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center py-2 text-xs border-b border-gray-100 text-slate-800">
                          <span className="col-span-1 sm:col-span-6 font-semibold flex items-center gap-2">
                            <img src={item.productImage} className="w-6 h-6 rounded-md object-cover bg-gray-50" />
                            {item.productName}
                          </span>
                          <span className="col-span-1 sm:col-span-2 text-left sm:text-right text-gray-500 font-mono">
                            R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="col-span-1 sm:col-span-2 text-left sm:text-right">
                            <span className="bg-rose-50 text-rose-950 font-bold font-mono px-1.5 py-0.5 rounded">
                              {item.quantity} un
                            </span>
                            <span className="text-[10px] text-gray-400 block sm:-mt-0.5">Factor: {item.factor} (x{item.multiple})</span>
                          </span>
                          <span className="col-span-1 sm:col-span-2 text-left sm:text-right font-mono font-bold">
                            R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order summary and actions toolbar */}
                    <div className="mt-4 pt-3 border-t border-gray-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <span className="text-xs text-gray-500 block">Total Itens: <b className="text-slate-800 font-mono">{order.totalQuantity} unidades</b></span>
                        <span className="text-xs text-gray-500 block">Faturado em: <b className="text-rose-800 font-mono">R$ {order.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></span>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-205 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 justify-center border border-slate-300"
                        >
                          <Printer className="w-3.5 h-3.5" /> Recibo de Venda
                        </button>

                        <button
                          onClick={() => startEditOrder(order)}
                          className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition flex items-center gap-1 justify-center border border-indigo-200"
                        >
                          <Edit className="w-3.5 h-3.5" /> Editar Pedido
                        </button>

                        <button
                          onClick={() => deleteEntireOrder(order.id)}
                          className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1 justify-center border border-rose-200"
                        >
                          <Trash className="w-3.5 h-3.5" /> Cancelar Pedido
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 2: CATALOG WORKFLOW (CADASTRAR PRODUTOS & ESTOQUE)
           ======================================================= */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Catálogo de Cosméticos Ativos</h3>
                <p className="text-xs text-gray-500">Cadastre novos cosméticos com múltiplos regulamentares e especifique os 5 níveis de preços de faturamento.</p>
              </div>

              <button 
                onClick={startCreateProduct}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Cadastrar Novo Produto
              </button>
            </div>

            {/* Editing Product form container */}
            {(editingProduct || isCreatingProduct) && (
              <div className="bg-slate-50 border border-slate-300 rounded-3xl p-5 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {isCreatingProduct ? '✨ Cadastrar Novo Cosmético' : `📝 Editando: ${editingProduct?.name}`}
                  </h4>
                  <button 
                    onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                    className="text-gray-400 hover:text-rose-600 font-bold"
                  >
                    Fechar &times;
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nome do Produto *</label>
                      <input 
                        type="text" 
                        required
                        value={pName} 
                        onChange={e => setPName(e.target.value)} 
                        className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Pertence à Marca *</label>
                      <select 
                        required
                        value={pBrandId} 
                        onChange={e => setPBrandId(e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none"
                      >
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Foto do Produto (Imagem URL) *</label>
                      <input 
                        type="text" 
                        required
                        value={pImage} 
                        onChange={e => setPImage(e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">Descrição Técnica / Detalhes de Composição</label>
                      <textarea 
                        value={pDescription} 
                        onChange={e => setPDescription(e.target.value)}
                        placeholder="Quais são as propriedades deste cosmético? (Exibido quando o cliente clica na foto)"
                        className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl h-20 focus:outline-none"
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Estoque Físico Atual</label>
                        <input 
                          type="number" 
                          value={pStock} 
                          onChange={e => setPStock(Number(e.target.value))} 
                          className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Fator de Venda Múltipla *</label>
                        <input 
                          type="number" 
                          required
                          value={pMultiple} 
                          onChange={e => setPMultiple(Number(e.target.value))} 
                          placeholder="Mínimo comercializado (Ex: 5 unidades)"
                          className="w-full bg-white px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing grid */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">Tabela de Preços (5 Tipos Obrigatórios)</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1 truncate font-bold">{priceTableNames.tabela1}</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={pPrices.tabela1} 
                          onChange={e => setPPrices(prev => ({ ...prev, tabela1: Number(e.target.value) }))}
                          className="w-full bg-gray-50 px-3 py-2 text-xs border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1 truncate font-bold">{priceTableNames.tabela2}</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={pPrices.tabela2} 
                          onChange={e => setPPrices(prev => ({ ...prev, tabela2: Number(e.target.value) }))}
                          className="w-full bg-gray-50 px-3 py-2 text-xs border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1 truncate font-bold">{priceTableNames.tabela3}</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={pPrices.tabela3} 
                          onChange={e => setPPrices(prev => ({ ...prev, tabela3: Number(e.target.value) }))}
                          className="w-full bg-gray-50 px-3 py-2 text-xs border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1 truncate font-bold">{priceTableNames.tabela4}</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={pPrices.tabela4} 
                          onChange={e => setPPrices(prev => ({ ...prev, tabela4: Number(e.target.value) }))}
                          className="w-full bg-gray-50 px-3 py-2 text-xs border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 block mb-1 truncate font-bold">{priceTableNames.tabela5}</label>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={pPrices.tabela5} 
                          onChange={e => setPPrices(prev => ({ ...prev, tabela5: Number(e.target.value) }))}
                          className="w-full bg-gray-50 px-3 py-2 text-xs border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition"
                    >
                      Salvar Cosmético
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                      className="bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs px-4 py-2 rounded-xl transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Brand Banner Editor */}
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl mb-6">
              <h4 className="text-xs font-bold text-rose-950 mb-2">📸 Estilo Visual: Clique para alterar fotos das Marcas de Maquiagem</h4>
              <div className="flex flex-wrap gap-2">
                {brands.map(b => (
                  <button 
                    key={b.id} 
                    onClick={() => updateBrandImage(b.id)}
                    className="bg-white border border-rose-300 hover:bg-rose-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-950 flex items-center gap-1.5 transition"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* List current products */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-250 text-[11px] uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="p-3">Geral</th>
                    <th className="p-3">Marca</th>
                    <th className="p-3">Estoque</th>
                    <th className="p-3">Múltiplos Regulamentares</th>
                    <th className="p-3">Preço Base (Tabela 1)</th>
                    <th className="p-3">Ações Catalogação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {products.map((p) => {
                    const bName = brands.find(b => b.id === p.brandId)?.name || 'Sem Marca';
                    return (
                      <tr key={p.id} className="hover:bg-rose-55 hover:bg-rose-50/20">
                        <td className="p-3 flex items-center gap-3 font-semibold text-slate-900">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                          <div>
                            <span>{p.name}</span>
                            <span className="text-[10px] text-gray-400 block line-clamp-1">{p.description}</span>
                          </div>
                        </td>
                        <td className="p-3">{bName}</td>
                        <td className={`p-3 font-mono font-bold ${p.stock <= 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                          {p.stock} un
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 border px-2 py-0.5 rounded text-gray-700 font-bold">
                            {p.multiple} un
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          R$ {p.prices.tabela1.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEditProduct(p)}
                              className="text-indigo-650 text-indigo-700 hover:underline font-bold"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-rose-650 text-rose-700 hover:underline font-bold ml-1"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 3: CUSTOMER REGISTRATION ACCESS (CLIENTES ATIVAÇÃO)
           ======================================================= */}
        {activeTab === 'clients' && (
          <div>
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900 font-serif">Aprovação de Clientes e Designação de Preço</h3>
              <p className="text-xs text-gray-500">
                Ative novos estabelecimentos comerciais, defina suas chaves de acesso alfanuméricas e libere de **1 a 2 tabelas específicas** de faturamento.
              </p>
            </div>

            {clientUnderApproval && (
              <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 mb-8 max-w-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-amber-100 mb-4">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    🔑 Liberação de Registro: {clientUnderApproval.name}
                  </h4>
                  <button onClick={() => setClientUnderApproval(null)} className="font-bold text-gray-400 hover:text-rose-600">&times;</button>
                </div>

                <form onSubmit={saveApproval} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Login Definitivo de Compras</label>
                      <input 
                        type="text" 
                        required
                        value={clientLogin} 
                        onChange={e => setClientLogin(e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-amber-250 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Senha de Acesso Comercial</label>
                      <input 
                        type="text" 
                        required
                        value={clientPassword} 
                        onChange={e => setClientPassword(e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-amber-250 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Assign price tables logic selection */}
                  <div className="bg-white p-4 rounded-2xl border border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-[11px] font-bold text-amber-900 uppercase tracking-widest">Liberar Tabelas de Venda (Selecione 1 ou 2) *</h5>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                        Selecionadas: {clientTables.length} / 2
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 mb-3 leading-tight">
                      O cliente só conseguirá visualizar de forma exclusiva os preços das tabelas selecionadas. De acordo com a regra de negócios, selecione no máximo duas.
                    </p>

                    <div className="space-y-2">
                      {(['tabela1', 'tabela2', 'tabela3', 'tabela4', 'tabela5'] as const).map((key) => {
                        const isChecked = clientTables.includes(key);
                        return (
                          <div 
                            key={key} 
                            onClick={() => handleToggleClientTable(key)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              isChecked 
                                ? 'bg-rose-50 border-rose-300 font-bold' 
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                            }`}
                          >
                            <span className="text-xs text-rose-950 font-sans">{priceTableNames[key]}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-gray-300'}`}>
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow"
                    >
                      ✓ Confirmar Registro & Designar Valores
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setClientUnderApproval(null)}
                      className="bg-white border text-slate-705 text-slate-700 text-xs px-4 py-2 rounded-xl transition"
                    >
                      Voltar ao Painel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Clients List categorised */}
            <div className="space-y-6">
              
              {/* Pentends/Registrations requests (CadastrarDados, AguardandoCredenciais, PendenteAprovacao) */}
              <div>
                <h4 className="text-xs uppercase font-bold text-amber-850 bg-amber-50 rounded-xl px-4 py-2 border border-amber-150 inline-block mb-3 leading-none">
                  ⏳ Aguardando Efetivação / Liberação ({clients.filter(c => c.status !== 'Ativo').length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.filter(c => c.status !== 'Ativo').map((client) => (
                    <div key={client.id} className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-serif text-base font-bold text-slate-900">{client.name}</h5>
                          <span className="text-[9px] bg-orange-100 text-orange-900 px-2 py-0.5 font-bold uppercase rounded-md tracking-wider">
                            Pendente
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                          <div>
                            <span className="block text-[10px] text-gray-400">Cidade:</span>
                            <span className="font-semibold text-slate-950">{client.city}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-gray-400">Telefone:</span>
                            <span className="font-semibold text-slate-950">{client.phone}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="block text-[10px] text-gray-400">E-mail:</span>
                            <span className="font-semibold text-slate-905 truncate block">{client.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-1 rounded">
                          Simulado login: {client.login || 'Não cadastrado'}
                        </span>

                        <button 
                          onClick={() => startApproval(client)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs"
                        >
                          Confirmar Cadastro & Atribuir Tabelas &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Approved/Active Clients */}
              <div>
                <h4 className="text-xs uppercase font-bold text-emerald-850 bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-150 inline-block mb-3 leading-none">
                  ✓ Clientes Ativados & Vinculados ({clients.filter(c => c.status === 'Ativo').length})
                </h4>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Contato / Localidade</th>
                        <th className="p-3">Credenciais</th>
                        <th className="p-3">Tabelas Exclusivas Designadas</th>
                        <th className="p-3">Auditoria / Ajustes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-50">
                      {clients.filter(c => c.status === 'Ativo').map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/20">
                          <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                          <td className="p-3">
                            <span className="block font-medium">{c.phone}</span>
                            <span className="text-[10px] text-gray-400">{c.city} • {c.email}</span>
                          </td>
                          <td className="p-3 font-mono text-[10px]">
                            <span>Login: <b className="text-slate-800">{c.login}</b></span><br />
                            <span>Senha: <b className="text-gray-400">{c.password}</b></span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {c.assignedTables.map(tb => (
                                <span key={tb} className="bg-rose-50 border border-rose-200 text-rose-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {priceTableNames[tb] || tb}
                                </span>
                              ))}
                              {c.assignedTables.length === 0 && (
                                <span className="bg-red-50 text-red-700 text-[10px] px-2 py-0.5 rounded">Critíco: Sem tabelas cadastradas</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button 
                              onClick={() => startApproval(c)}
                              className="text-rose-650 text-rose-700 font-bold hover:underline"
                            >
                              Editar Tabelas/Chaves
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            TAB 4: REGISTER PRICE TABLES & COMPANY CONFIGS (TABELAS DE PREÇOS COORD)
           ======================================================= */}
        {activeTab === 'tables' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Header */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Ajustes da Distribuidora & Gerenciar Linhas</h3>
              <p className="text-xs text-gray-500">Configure a identidade visual da empresa, altere o logotipo, renomeie as marcas/linhas e mude os nomes das tabelas de preços.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Company Branding & Price Tables */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Identity Form */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
                    <Settings className="w-5 h-5 text-rose-500" />
                    <h4 className="font-serif text-lg font-bold text-slate-800">Identidade da Empresa</h4>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border">
                    <div className="h-14 w-14 rounded-full bg-charcoal border border-gold/40 flex items-center justify-center text-gold overflow-hidden shrink-0">
                      {companyLogoUrl ? (
                        <img 
                          src={companyLogoUrl} 
                          alt={companyName} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Sparkles className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 block font-bold">Pré-visualização do Topo</span>
                      <h5 className="font-serif text-base italic font-bold text-slate-850 truncate">{companyName || 'Sem nome'}</h5>
                      <p className="text-[10px] text-gray-500 font-mono tracking-wider truncate uppercase">{companySubName || 'Sem descrição'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nome da Distribuidora *</label>
                      <input 
                        type="text" 
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex: Aura Distribuidora"
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Etiqueta Subtítulo comercial</label>
                      <input 
                        type="text" 
                        value={companySubName}
                        onChange={e => setCompanySubName(e.target.value)}
                        placeholder="Ex: Cosmétiques de Luxe"
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">URL da Imagem Logotipo (Opcional)</label>
                      <input 
                        type="text" 
                        value={companyLogoUrl}
                        onChange={e => setCompanyLogoUrl(e.target.value)}
                        placeholder="Insira um link de imagem (Unsplash, etc.)"
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">Insira uma URL de imagem .png ou .jpg para alterar o logotipo redondo.</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Descritivo do Rodapé (Sobre a Empresa)</label>
                      <textarea
                        rows={3}
                        value={companyDescription}
                        onChange={e => setCompanyDescription(e.target.value)}
                        placeholder="Insira a descrição da história ou foco da distribuidora..."
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500 leading-relaxed"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">Este texto aparecerá no rodapé escuro de todas as páginas do aplicativo.</span>
                    </div>
                  </div>
                </div>

                {/* New Card: Dynamic Catalog Banner Edit Form */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
                    <ImageIcon className="w-5 h-5 text-rose-500" />
                    <h4 className="font-serif text-lg font-bold text-slate-800">Banner de Destaque (Catálogo)</h4>
                  </div>
                  
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Personalize o banner principal que aparece no topo do catálogo de compras dos clientes.
                  </p>

                  {/* Banner Mini-Preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-50 border p-4 flex flex-col gap-2.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Pré-visualização do Banner</span>
                    <div className="bg-white p-4 rounded-xl border border-dashed flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="inline-block font-sans text-[8px] uppercase tracking-[0.2em] text-white font-bold bg-charcoal px-2 py-1 rounded-sm">
                          {bannerTag || 'Etiqueta'}
                        </span>
                        <h4 className="font-serif italic text-sm font-bold text-slate-800 truncate">
                          {bannerTitle || 'Título Principal'}
                        </h4>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                          {bannerDescription || 'Descritivo curto do banner...'}
                        </p>
                      </div>
                      <div 
                        className="h-14 w-20 bg-cover bg-center rounded-lg border shrink-0 bg-slate-100"
                        style={{ backgroundImage: `url('${bannerImageUrl}')` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Etiqueta do Banner</label>
                      <input 
                        type="text" 
                        value={bannerTag}
                        onChange={e => setBannerTag(e.target.value)}
                        placeholder="Ex: Coleção Exclusiva de Luxo"
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Título do Banner</label>
                      <input 
                        type="text" 
                        value={bannerTitle}
                        onChange={e => setBannerTitle(e.target.value)}
                        placeholder="Ex: A beleza refinada de dentro para fora."
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Descrição do Banner</label>
                      <textarea
                        rows={3}
                        value={bannerDescription}
                        onChange={e => setBannerDescription(e.target.value)}
                        placeholder="Insira as instruções ou o texto de convite para os compradores..."
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">URL da Imagem do Banner</label>
                      <input 
                        type="text" 
                        value={bannerImageUrl}
                        onChange={e => setBannerImageUrl(e.target.value)}
                        placeholder="Insira uma URL de imagem do Unsplash ou similar"
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">Coloque um link válido para renderizar o destaque fotográfico no catálogo.</span>
                    </div>
                  </div>
                </div>

                {/* 2. Price Tables Name Form */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
                    <Table className="w-5 h-5 text-rose-500" />
                    <h4 className="font-serif text-lg font-bold text-slate-800">Nomes das Tabelas de Preços</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Personalize os nomes comerciais das suas 5 tabelas de preços. Essas identificações aparecem no seletor de preço de cada cliente aprovado.
                  </p>

                  <form onSubmit={handleSaveTableNames} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tabela 1 (Preço Varejo Mínimo)</label>
                      <input 
                        type="text" required value={tableConfigs.tabela1}
                        onChange={e => setTableConfigs(prev => ({ ...prev, tabela1: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tabela 2</label>
                      <input 
                        type="text" required value={tableConfigs.tabela2}
                        onChange={e => setTableConfigs(prev => ({ ...prev, tabela2: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tabela 3</label>
                      <input 
                        type="text" required value={tableConfigs.tabela3}
                        onChange={e => setTableConfigs(prev => ({ ...prev, tabela3: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tabela 4</label>
                      <input 
                        type="text" required value={tableConfigs.tabela4}
                        onChange={e => setTableConfigs(prev => ({ ...prev, tabela4: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tabela 5 (Preço Revenda VIP)</label>
                      <input 
                        type="text" required value={tableConfigs.tabela5}
                        onChange={e => setTableConfigs(prev => ({ ...prev, tabela5: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Save className="w-3.5 h-3.5" /> Salvar Nomes das Tabelas
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Manage Brand Lines */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Brands Container Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3 border-slate-100 font-serif">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-rose-500" />
                      <h4 className="text-lg font-bold text-slate-800">Gerenciar Linhas de Produtos (Marcas)</h4>
                    </div>
                    <button
                      onClick={startCreateBrand}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl transition flex items-center gap-1 font-sans"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova Linha
                    </button>
                  </div>

                  {/* Form to Edit or Create Brand Line */}
                  {(editingBrand || isCreatingBrand) && (
                    <form onSubmit={saveBrand} className="bg-slate-50 border p-5 rounded-2xl mb-6 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2 border-slate-200">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-sans">
                          {isCreatingBrand ? '✨ Cadastrar Nova Linha de Cosméticos' : '📝 Editar Detalhes da Linha'}
                        </h5>
                        <button type="button" onClick={() => { setEditingBrand(null); setIsCreatingBrand(false); }} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold block mb-1">Nome da Linha *</label>
                          <input
                            type="text" required value={bName} onChange={e => setBName(e.target.value)}
                            placeholder="Ex: Éclat de Rosas"
                            className="w-full bg-white px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-1">Imagem URL da Linha *</label>
                          <input
                            type="text" required value={bImage} onChange={e => setBImage(e.target.value)}
                            className="w-full bg-white px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold block mb-1">Breve Descrição Comercial</label>
                        <textarea
                          rows={2} value={bDescription} onChange={e => setBDescription(e.target.value)}
                          placeholder="Fale brevemente sobre o foco e os benefícios desta linha..."
                          className="w-full bg-white px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow"
                        >
                          <Check className="w-4 h-4" /> Salvar Linha
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingBrand(null); setIsCreatingBrand(false); }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of current Brands Lines */}
                  <div className="space-y-3.5">
                    {brands.map(brand => {
                      const associatedProductsCount = products.filter(p => p.brandId === brand.id).length;
                      return (
                        <div key={brand.id} className="flex items-center gap-4 border p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition">
                          <div className="h-14 w-14 rounded-xl border bg-white overflow-hidden shrink-0">
                            <img 
                              src={brand.image} 
                              alt={brand.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-serif text-sm font-bold text-slate-800">{brand.name}</h5>
                              <span className="bg-rose-100 text-rose-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full">
                                {associatedProductsCount} {associatedProductsCount === 1 ? 'produto' : 'produtos'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{brand.description || 'Sem descrição cadastrada.'}</p>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditBrand(brand)}
                              title="Editar linha"
                              className="h-8 w-8 rounded-lg bg-white border hover:bg-slate-100 transition flex items-center justify-center text-slate-600 hover:text-rose-650"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteBrand(brand.id)}
                              title="Excluir linha"
                              className="h-8 w-8 rounded-lg bg-white border hover:bg-slate-100 transition flex items-center justify-center text-slate-600 hover:text-red-750"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {brands.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-xs">
                        Nenhuma linha de produto cadastrada. Clique em "Nova Linha" para iniciar.
                      </div>
                    )}
                  </div>

                </div>

              </div>
              
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 5: WHATSAPP CHAT ATTENDANTS MANAGER
           ======================================================= */}
        {activeTab === 'attendants' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 font-serif">Gerenciar Atendentes do Aplicativo</h3>
                <p className="text-xs text-gray-500">Cadastre fotos, nomes de cargos e os números do WhatsApp das suas vendedoras.</p>
              </div>

              <button 
                onClick={startCreateAttendant}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> Cadastrar Nova Atendente
              </button>
            </div>

            {(editingAttendant || isCreatingAttendant) && (
              <form onSubmit={saveAttendant} className="bg-slate-50 border p-5 rounded-2xl mb-6 space-y-4 max-w-xl">
                <h4 className="text-xs font-bold text-slate-800">
                  {isCreatingAttendant ? '👥 Nova Atendente Comercial' : '📝 Editar Atendente'}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Nome Completo *</label>
                    <input 
                      type="text" required value={aName} onChange={e => setAName(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Cargo / Departamento *</label>
                    <input 
                      type="text" required value={aRole} onChange={e => setARole(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">WhatsApp Telefone (Somente números com DDI/DDD) *</label>
                    <input 
                      type="text" required value={aPhone} onChange={e => setAPhone(e.target.value)}
                      placeholder="Ex: 5511999991111"
                      className="w-full bg-white px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Foto URL da atendente *</label>
                    <input 
                      type="text" required value={aImage} onChange={e => setAImage(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl">
                    Salvar Atendente
                  </button>
                  <button type="button" onClick={() => { setEditingAttendant(null); setIsCreatingAttendant(false); }} className="bg-white border px-4 py-2 rounded-xl">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {attendants.map(att => (
                <div key={att.id} className="bg-white p-4 border rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={att.image} alt={att.name} className="w-12 h-12 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{att.name}</h4>
                      <span className="text-[10px] text-rose-500 font-semibold">{att.role}</span>
                      <span className="block text-[10px] text-gray-400 font-mono mt-0.5">{att.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => startEditAttendant(att)}
                      className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => deleteAttendant(att.id)}
                      className="text-[10px] font-bold text-rose-705 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded hover:bg-rose-100"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>


      {/* =======================================================
          MODAL: RECEIPT PRINTPREVIEW INVOICE 
         ======================================================= */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border shadow-xl flex flex-col justify-between max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Header toolbar */}
            <div className="no-print bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b">
              <span className="text-xs font-bold flex items-center gap-1.5 text-rose-300">
                <Printer className="w-4 h-4" /> REVISÃO E IMPRESSÃO COMERCIAL
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={triggerPrint}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Confirmar Impressão (Fisíca / PDF)
                </button>
                <button 
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="bg-slate-805 bg-slate-800 hover:bg-slate-700 text-slate-350 text-slate-300 px-3 py-2 rounded-xl transition text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Print Container Sheet */}
            <div id="print-sheet" className="p-8 overflow-y-auto leading-normal text-xs text-black font-sans print:p-0">
              
              {/* Receipt Header */}
              <div className="text-center pb-6 border-b border-gray-300 mb-6">
                <span className="font-serif text-2xl font-bold tracking-tight block">AURA DISTRIBUIDORA DE COSMÉTICOS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Orçamento e Comprovante de Pedido Comercial</span>
                <span className="text-[10px] text-gray-400 block mt-1">CNPJ: 12.345.678/0001-90 | Ribeirão Preto, SP</span>
              </div>

              {/* Order Info Panel Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider mb-1">DADOS DO COMPRADOR</h5>
                  <p className="font-bold text-sm">{selectedOrderForInvoice.clientName}</p>
                  
                  {/* Search for client extra variables */}
                  {(() => {
                    const matchedC = clients.find(cl => cl.id === selectedOrderForInvoice.clientId);
                    return matchedC ? (
                      <div className="mt-1 text-[11px] text-gray-500 space-y-0.5">
                        <p>Telefone: <b>{matchedC.phone}</b></p>
                        <p>E-mail: <b>{matchedC.email}</b></p>
                        <p>Cidade da Entregar: <b>{matchedC.city}</b></p>
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="text-right">
                  <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider mb-1">DADOS DA ORDEM</h5>
                  <p className="font-mono font-bold text-base text-rose-800">Ordem código: #{selectedOrderForInvoice.id}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Status Emissão: <b>Aprovado Interno</b></p>
                  <p className="text-[11px] text-gray-500">Tabela de Faturamento: <b>{priceTableNames[selectedOrderForInvoice.selectedTable]}</b></p>
                  <p className="text-[11px] text-gray-500">Data de Geração: <b>{new Date(selectedOrderForInvoice.date).toLocaleDateString('pt-BR')} às {new Date(selectedOrderForInvoice.date).toLocaleTimeString('pt-BR')}</b></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300 font-bold uppercase text-[9px] text-gray-550">
                      <th className="p-2">Cosmético Descrição</th>
                      <th className="p-2 text-right">Lote Múltiplo</th>
                      <th className="p-2 text-right">Fator (cx)</th>
                      <th className="p-2 text-right">Total Unidades</th>
                      <th className="p-2 text-right">Preço Unit.</th>
                      <th className="p-2 text-right">Total Linha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrderForInvoice.items.map((it) => (
                      <tr key={it.productId} className="text-[11px]">
                        <td className="p-2 font-bold">{it.productName}</td>
                        <td className="p-2 text-right font-mono">{it.multiple} un</td>
                        <td className="p-2 text-right font-mono">{it.factor} cx</td>
                        <td className="p-2 text-right font-mono font-bold">{it.quantity} un</td>
                        <td className="p-2 text-right font-mono">R$ {it.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono font-bold">R$ {it.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div className="flex justify-end mb-8">
                <div className="bg-gray-50 border p-4 rounded-xl max-w-sm w-full space-y-1.5 text-right">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Soma Geral dos Itens:</span>
                    <span className="font-mono font-bold text-black">{selectedOrderForInvoice.totalQuantity} unidades</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t font-bold">
                    <span className="text-rose-955 text-rose-900">VALOR COBRADO TOTAL:</span>
                    <span className="font-mono text-base text-rose-800">R$ {selectedOrderForInvoice.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Signature/Disclosures */}
              <div className="pt-10 border-t border-dashed border-gray-300 grid grid-cols-2 gap-8 text-[11px] text-gray-500 text-center">
                <div>
                  <div className="border-b border-black w-2/3 mx-auto mb-1"></div>
                  <span>Assinatura do Responsável Logística</span>
                </div>
                <div>
                  <div className="border-b border-black w-2/3 mx-auto mb-1"></div>
                  <span>Assinatura e Recebimento Comprador</span>
                </div>
              </div>

            </div>

            {/* Print Bottom Warning */}
            <div className="bg-gray-100 p-4 border-t text-center text-[10px] text-gray-500 no-print flex justify-between items-center">
              <span>* Somente a empresa terá acesso exclusivo à impressão do comprovante oficial de venda.</span>
              <button 
                onClick={() => setSelectedOrderForInvoice(null)}
                className="text-rose-600 hover:underline font-bold"
              >
                Voltar
              </button>
            </div>

          </div>
        </div>
      )}


      {/* =======================================================
          MODAL: EDIT AN ACTIVE ORDER ITEMS
         ======================================================= */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full border shadow-xl flex flex-col justify-between max-h-[85vh]">
            
            <div className="bg-rose-900 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h4 className="font-serif text-base font-bold">Ajustar e Editar Itens: Pedido #{editingOrder.id}</h4>
                <p className="text-[10px] text-rose-205 text-rose-200">Você como Administrador pode mudar quantidades ou excluir produtos.</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="font-bold text-white">&times;</button>
            </div>

            {/* Items list to adjust factor */}
            <div className="p-6 overflow-y-auto divide-y">
              {editingOrder.items.map((item) => (
                <div key={item.productId} className="py-3 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.productImage} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">{item.productName}</span>
                      <span className="text-[10px] text-gray-500">Múltiplo: {item.multiple} un • R$ {item.unitPrice.toFixed(2)} un.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Control Factor */}
                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border">
                      <button 
                        onClick={() => updateOrderItemFactor(item.productId, -1)}
                        className="p-1 rounded bg-white hover:bg-rose-50 text-rose-950 border text-[10px] font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-bold w-6 text-center">{item.factor}</span>
                      <button 
                        onClick={() => updateOrderItemFactor(item.productId, 1)}
                        className="p-1 rounded bg-white hover:bg-rose-50 text-rose-950 border text-[10px] font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-20">
                      <span className="font-mono font-bold text-xs text-rose-950 block">{item.quantity} un</span>
                      <span className="text-[10px] text-gray-400 font-mono">R$ {item.totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Exclude specific product entirely */}
                    <button 
                      onClick={() => removeProductFromOrder(item.productId)}
                      className="p-1 text-rose-600 hover:text-rose-800 border-l pl-3"
                      title="Excluir item do pedido"
                    >
                      <TrashCircleIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save footer */}
            <div className="p-4 bg-rose-50/50 border-t flex justify-between items-center">
              <div>
                <span className="text-[11px] text-gray-500 block">Novo Total da Ordem:</span>
                <span className="font-mono text-base font-extrabold text-rose-900">R$ {editingOrder.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={saveOrderEdits}
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Confirmar Alterações
                </button>
                <button 
                  onClick={() => setEditingOrder(null)}
                  className="bg-white border text-xs px-3 py-2 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Simple Trash Circle visual representation
function TrashCircleIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600">
      <Trash2 className="w-3.5 h-3.5" />
    </div>
  );
}
