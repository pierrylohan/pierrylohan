export interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  image: string;
  description: string;
  stock: number;
  multiple: number; // minimum step (e.g. 5, 10)
  prices: {
    tabela1: number;
    tabela2: number;
    tabela3: number;
    tabela4: number;
    tabela5: number;
  };
}

export interface PriceTableConfig {
  tabela1: string;
  tabela2: string;
  tabela3: string;
  tabela4: string;
  tabela5: string;
}

export type ClientStatus = 'CadastrarDados' | 'AguardandoCredenciais' | 'PendenteAprovacao' | 'Ativo';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: ClientStatus;
  login?: string;
  password?: string;
  assignedTables: ('tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5')[]; // 1 or 2 tables assigned by admin
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  factor: number;      // user chosen multiplier factor (e.g., 2)
  multiple: number;    // product's multiple constraint (e.g., 5)
  quantity: number;    // factor * multiple (e.g., 10)
  totalPrice: number;  // quantity * unitPrice
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  selectedTable: 'tabela1' | 'tabela2' | 'tabela3' | 'tabela4' | 'tabela5';
  status: 'Separacao' | 'Pronto para retirar' | 'Finalizado';
  items: OrderItem[];
  totalPrice: number;
  totalQuantity: number;
}

export interface Attendant {
  id: string;
  name: string;
  role: string;
  phone: string; // WhatsApp number
  image: string; // Photo URL
}
