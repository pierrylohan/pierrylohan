import React from 'react';
import { Sparkles, Shield, User, LogOut, MessageCircle, ShoppingBag, Radio } from 'lucide-react';
import { Client } from '../types';

interface HeaderProps {
  activeRole: 'client' | 'admin';
  onChangeRole: (role: 'client' | 'admin') => void;
  currentClient: Client | null;
  onLogout: () => void;
  pendingDeliveriesCount: number;
  unapprovedClientsCount: number;
  onNavigateToCart?: () => void;
  cartItemsCount?: number;
  companyName: string;
  companySubName: string;
  companyLogoUrl: string;
}

export default function Header({
  activeRole,
  onChangeRole,
  currentClient,
  onLogout,
  pendingDeliveriesCount,
  unapprovedClientsCount,
  onNavigateToCart,
  cartItemsCount = 0,
  companyName,
  companySubName,
  companyLogoUrl
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-neutral-warm/95 backdrop-blur-md border-b border-border-warm shadow-xs transition-all duration-300">
      {/* Simulation Banner - Explains to User how to test */}
      <div className="bg-charcoal text-white text-xs px-4 py-2 text-center flex flex-wrap items-center justify-center gap-2 border-b border-gold/10">
        <span className="flex items-center gap-1 font-medium text-gold">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
          Ambiente de Testes Multiusuário:
        </span>
        <span className="opacity-90">
          Alterne entre as visões de <b>Cliente</b> para simular compras, ou a <b>Administradora (Empresa)</b> para gerenciar o catálogo, aprovar clientes e faturar pedidos.
        </span>
        <div className="flex gap-2 ml-2">
          <button 
            onClick={() => onChangeRole('client')}
            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition ${
              activeRole === 'client' 
                ? 'bg-gold text-charcoal shadow-sm font-bold' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Área Cliente
          </button>
          <button 
            onClick={() => onChangeRole('admin')}
            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition ${
              activeRole === 'admin' 
                ? 'bg-gold text-charcoal shadow-sm font-bold' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Área Empresa (Painel)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChangeRole('client')}>
            <div className="h-11 w-11 rounded-full bg-charcoal flex items-center justify-center text-gold border border-gold/40 shadow-sm overflow-hidden transition hover:scale-105 shrink-0">
              {companyLogoUrl ? (
                <img 
                  src={companyLogoUrl} 
                  alt={companyName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl italic font-bold tracking-tight text-charcoal block leading-tight">
                {companyName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 block -mt-1 font-mono">
                {companySubName}
              </span>
            </div>
          </div>

          {/* Center Info / Context Badges */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[11px] bg-white px-3 py-1.5 rounded-full border border-border-warm shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span className="text-gray-700 font-medium">Estoque Flexível:</span>
              <span className="text-gray-400 font-normal">Vendas acima do saldo são permitidas</span>
            </div>
            
            {activeRole === 'admin' ? (
              <div className="flex gap-2">
                {unapprovedClientsCount > 0 && (
                  <span className="text-[11px] font-bold text-charcoal bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
                    ⚠️ {unapprovedClientsCount} cadastro(s) pendente(s)
                  </span>
                )}
                {pendingDeliveriesCount > 0 && (
                  <span className="text-[11px] font-bold text-white bg-charcoal px-2.5 py-1 rounded-full border border-gold/30 flex items-center gap-1">
                    📦 {pendingDeliveriesCount} pedido(s) ativo(s)
                  </span>
                )}
              </div>
            ) : (
              currentClient && (
                <div className="text-[11px] text-right">
                  <span className="text-gray-400 block uppercase text-[8px] tracking-widest">Cliente Autenticado</span>
                  <span className="font-bold text-charcoal font-serif">{currentClient.name}</span>
                </div>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick role-switch icons on small screens */}
            <div className="flex gap-1 bg-white border border-border-warm p-1 rounded-lg sm:hidden">
              <button 
                onClick={() => onChangeRole('client')}
                className={`p-1.5 rounded ${activeRole === 'client' ? 'bg-charcoal text-gold shadow-sm' : 'text-gray-500'}`}
                title="Visão Cliente"
              >
                <User className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onChangeRole('admin')}
                className={`p-1.5 rounded ${activeRole === 'admin' ? 'bg-charcoal text-gold shadow-sm' : 'text-gray-500'}`}
                title="Visão Administrador"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>

            {/* Logout or Current User Badge */}
            {activeRole === 'client' ? (
              currentClient ? (
                <div className="flex items-center gap-3">
                  {onNavigateToCart && (
                    <button 
                      onClick={onNavigateToCart}
                      className="relative p-2.5 text-charcoal hover:text-gold hover:bg-charcoal rounded-full transition border border-border-warm bg-white shadow-3xs"
                      title="Carrinho de Compras"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold text-charcoal rounded-full w-4.5 h-4.5 text-[9px] font-bold flex items-center justify-center border border-white shadow-xs">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>
                  )}
                  <div className="hidden sm:block text-right">
                    <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-light">Seja bem vindo(a)</span>
                    <span className="text-xs font-bold text-charcoal max-w-[150px] truncate block font-serif">{currentClient.name.split(' ')[0]}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    title="Desconectar"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-charcoal bg-white border border-border-warm px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <User className="w-3.5 h-3.5 text-gold" /> Visitante
                </span>
              )
            ) : (
              <div className="flex items-center gap-1.5 text-gold bg-charcoal px-3.5 py-2 rounded-full border border-gold/40 text-xs font-bold shadow-sm">
                <Shield className="w-3.5 h-3.5 text-gold" /> Painel Administradora
              </div>
            )}
            
          </div>

        </div>
      </div>
    </header>
  );
}
