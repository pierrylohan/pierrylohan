import { Brand, Product, PriceTableConfig, Client, Attendant, Order } from './types';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brand-1',
    name: 'Maison Lumière',
    description: 'Séruns clareadores de alta performance, elixires rejuvenescedores e cuidados luxuosos.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'brand-2',
    name: 'Fleur Sauvage',
    description: 'Hidratantes orgânicos premium, extratos florais raros e óleos de nutrição profunda.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'brand-3',
    name: 'Rouge Allure',
    description: 'Batons aveludados de alta pigmentação, paletas sofisticadas e maquiagem de alta costura.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'brand-4',
    name: 'Éclat Royal',
    description: 'Brumas corporais cintilantes, águas micelares francesas e tônicos iluminadores raros.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Lumière Premium
  {
    id: 'prod-1',
    name: 'Sérum Elixir Glow 24k',
    brandId: 'brand-1',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    description: 'Rejuvenescedor celular com micropartículas de ouro 24k e ácido hialurônico de alta viscosidade.',
    stock: 140,
    multiple: 6, // Vendido em caixa com 6 unidades
    prices: {
      tabela1: 85.00,
      tabela2: 78.00,
      tabela3: 72.00,
      tabela4: 65.00,
      tabela5: 58.00
    }
  },
  {
    id: 'prod-2',
    name: 'Creme Regenerador Noturno',
    brandId: 'brand-1',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80',
    description: 'Nutrição profunda noturna enriquecida com retinol puro e óleo de semente de uva.',
    stock: 80,
    multiple: 4, // Multiplo de 4
    prices: {
      tabela1: 120.00,
      tabela2: 110.00,
      tabela3: 102.00,
      tabela4: 95.00,
      tabela5: 85.00
    }
  },
  {
    id: 'prod-3',
    name: 'Tônico Facial de Pepino e Ácido Salicílico',
    brandId: 'brand-1',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=80',
    description: 'Limpeza e desobstrução profunda dos poros para uma pele sedosa e sem imperfeições.',
    stock: 250,
    multiple: 12, // Caixa com 12
    prices: {
      tabela1: 45.00,
      tabela2: 41.50,
      tabela3: 38.00,
      tabela4: 34.00,
      tabela5: 29.90
    }
  },

  // Botânica Flora
  {
    id: 'prod-4',
    name: 'Shampoo Botânico de Alecrim e Hortelã',
    brandId: 'brand-2',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80',
    description: 'Fórmula refrescante e sem sulfatos que limpa intensamente, estimulando o crescimento capilar saudável.',
    stock: 15, // Pouco estoque para mostrar que aceita negativo
    multiple: 10,
    prices: {
      tabela1: 38.00,
      tabela2: 34.00,
      tabela3: 31.00,
      tabela4: 28.00,
      tabela5: 24.50
    }
  },
  {
    id: 'prod-5',
    name: 'Óleo Nutritivo Corporal de Amêndoas Doces',
    brandId: 'brand-2',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=80',
    description: 'Óleo essencial extra virgem perfeito para hidratação prolongada no inverno pós-banho.',
    stock: 95,
    multiple: 5,
    prices: {
      tabela1: 65.00,
      tabela2: 60.00,
      tabela3: 56.00,
      tabela4: 51.00,
      tabela5: 46.00
    }
  },

  // Diva Makeup
  {
    id: 'prod-6',
    name: 'Paleta Sombras Nude Sensations',
    brandId: 'brand-3',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
    description: '18 tons super pigmentados variando entre mattes amantesados e metálicos reflexivos intensos.',
    stock: 60,
    multiple: 3,
    prices: {
      tabela1: 95.00,
      tabela2: 88.00,
      tabela3: 82.00,
      tabela4: 75.00,
      tabela5: 68.00
    }
  },
  {
    id: 'prod-7',
    name: 'Batom Matte Soft Velvet de Longa Duração',
    brandId: 'brand-3',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
    description: 'Batom líquido super confortável que fica na boca por até 16h sem escorrer ou craquelar.',
    stock: 450,
    multiple: 24, // Caixa com 24
    prices: {
      tabela1: 32.00,
      tabela2: 29.00,
      tabela3: 26.50,
      tabela4: 24.00,
      tabela5: 21.00
    }
  },

  // Glow Essence
  {
    id: 'prod-8',
    name: 'Mist Hidratante de Rosas Silvestres',
    brandId: 'brand-4',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80',
    description: 'Spray finalizador calmante e hidratante com infusão de pétalas de rosas secas filtradas.',
    stock: -5, // Começa negativo para demonstrar que aceita vendas negativas
    multiple: 8,
    prices: {
      tabela1: 52.00,
      tabela2: 48.00,
      tabela3: 44.50,
      tabela4: 40.00,
      tabela5: 35.00
    }
  }
];

export const INITIAL_PRICE_TABLE_NAMES: PriceTableConfig = {
  tabela1: 'Tabela Varejo Mínimo',
  tabela2: 'Tabela Atacado Bronze',
  tabela3: 'Tabela Atacado Prata',
  tabela4: 'Tabela Distribuidor Ouro',
  tabela5: 'Tabela Revenda VIP'
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Juliana Silva Cosméticos',
    email: 'juliana@silva.com',
    phone: '(11) 98888-7777',
    city: 'São Paulo',
    status: 'Ativo',
    login: 'juliana',
    password: '123',
    assignedTables: ['tabela1', 'tabela3'] // Consegue visualizar tabela 1 e tabela 3
  },
  {
    id: 'cli-2',
    name: 'Distribuidora Bella Donna',
    email: 'contato@belladonna.br',
    phone: '(21) 97777-6666',
    city: 'Rio de Janeiro',
    status: 'Ativo',
    login: 'belladonna',
    password: 'bella',
    assignedTables: ['tabela4', 'tabela5'] // Acesso a tabelas premium
  },
  {
    id: 'cli-3',
    name: 'Estética Toque de Seda',
    email: 'toquedeseda@gmail.com',
    phone: '(31) 96543-2109',
    city: 'Belo Horizonte',
    status: 'PendenteAprovacao', // Aguardando que a empresa efetive a confirmação do cadastro e atribua tabelas
    login: 'toque',
    password: 'secreto-password',
    assignedTables: []
  },
  {
    id: 'cli-4',
    name: 'Amanda Souza Makeup',
    email: 'amanda@souza.com',
    phone: '(19) 99341-2451',
    city: 'Campinas',
    status: 'CadastrarDados', // Primeiro estado de cadastro do formulario do cliente
    assignedTables: []
  }
];

export const INITIAL_ATTENDANTS: Attendant[] = [
  {
    id: 'att-1',
    name: 'Renata Vasconcellos',
    role: 'Atendimento Atacado',
    phone: '5511999991111', // WhatsApp formatado sem caracteres
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-2',
    name: 'Felipe Mendes',
    role: 'Suporte Faturamento',
    phone: '5511999992222',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-3',
    name: 'Clara Meirelles',
    role: 'Novos Cadastros & Dúvidas',
    phone: '5511999993333',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ped-1001',
    clientId: 'cli-1',
    clientName: 'Juliana Silva Cosméticos',
    date: '2026-06-02T14:30:00Z',
    selectedTable: 'tabela3', // R$ 72.00 e R$ 102.00
    status: 'Separacao',
    items: [
      {
        productId: 'prod-1',
        productName: 'Sérum Elixir Glow 24k',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
        unitPrice: 72.00,
        factor: 3,
        multiple: 6,
        quantity: 18,
        totalPrice: 1296.00 // 18 * 72.00
      },
      {
        productId: 'prod-2',
        productName: 'Creme Regenerador Noturno',
        productImage: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80',
        unitPrice: 102.00,
        factor: 2,
        multiple: 4,
        quantity: 8,
        totalPrice: 816.00 // 8 * 102.00
      }
    ],
    totalPrice: 2112.00,
    totalQuantity: 26
  },
  {
    id: 'ped-1002',
    clientId: 'cli-2',
    clientName: 'Distribuidora Bella Donna',
    date: '2026-06-03T09:12:00Z',
    selectedTable: 'tabela5', // R$ 58.00 e R$ 21.00
    status: 'Pronto para retirar',
    items: [
      {
        productId: 'prod-1',
        productName: 'Sérum Elixir Glow 24k',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
        unitPrice: 58.00,
        factor: 5,
        multiple: 6,
        quantity: 30,
        totalPrice: 1740.00
      },
      {
        productId: 'prod-7',
        productName: 'Batom Matte Soft Velvet de Longa Duração',
        productImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
        unitPrice: 21.00,
        factor: 2,
        multiple: 24,
        quantity: 48,
        totalPrice: 1008.00
      }
    ],
    totalPrice: 2748.00,
    totalQuantity: 78
  }
];
