// ===== DEMO MODE CONSTANTS & INTERFACES =====

const DEMO_MODE_KEY = '__BUSHERE_DEMO_MODE__';
const DB_KEY = '__BUSHERE_LOCALSTORAGE_DB__';

// ===== STATUS & TYPE ENUMS (mapped to SQL IDs) =====

// StatusMotorista (from migration 013)
enum DriverStatus {
  ATIVO = 1,
  FERIAS = 2,
  AFASTADO = 3,
  INATIVO = 4
}

// StatusVeiculo (from migration 010)
enum VehicleStatus {
  EM_OPERACAO = 1,
  EM_MANUTENCAO = 2,
  INATIVO = 3
}

// StatusRota (from migration 004)
enum RouteStatus {
  ATIVA = 1,
  INATIVA = 2,
  EM_PLANEJAMENTO = 3
}

// TipoVeiculo (from migration 009)
enum VehicleType {
  ONIBUS = 1,
  MICROONIBUS = 2,
  VAN = 3
}

// TipoPassageiro (from migration 018)
enum PassengerType {
  ESTUDANTE = 1,
  CORPORATIVO = 2
}

// ===== HELPER FUNCTIONS FOR STATUS/TYPE NAMES =====
const getDriverStatusName = (statusId: number): string => {
  switch (statusId) {
    case DriverStatus.ATIVO: return 'Ativo';
    case DriverStatus.FERIAS: return 'Férias';
    case DriverStatus.AFASTADO: return 'Afastado';
    case DriverStatus.INATIVO: return 'Inativo';
    default: return 'Não informado';
  }
};

const getVehicleStatusName = (statusId: number): string => {
  switch (statusId) {
    case VehicleStatus.EM_OPERACAO: return 'Em Operação';
    case VehicleStatus.EM_MANUTENCAO: return 'Em Manutenção';
    case VehicleStatus.INATIVO: return 'Inativo';
    default: return 'Não informado';
  }
};

const getRouteStatusName = (statusId: number): string => {
  switch (statusId) {
    case RouteStatus.ATIVA: return 'Ativa';
    case RouteStatus.INATIVA: return 'Inativa';
    case RouteStatus.EM_PLANEJAMENTO: return 'Em Planejamento';
    default: return 'Não informado';
  }
};

const getVehicleTypeName = (typeId: number): string => {
  switch (typeId) {
    case VehicleType.ONIBUS: return 'Ônibus';
    case VehicleType.MICROONIBUS: return 'Microônibus';
    case VehicleType.VAN: return 'Van';
    default: return 'Não informado';
  }
};

// ===== TYPESCRIPT INTERFACES =====

interface Driver {
  motorista_id: number;
  nome: string;
  cpf: string;
  cnh_numero: string;
  cnh_categoria: string;
  cnh_validade: string;
  telefone: string;
  email: string;
  data_admissao: string;
  status_motorista_id: DriverStatus;
  ativo: boolean;
  criacao: string;
  atualizacao: string;
}

interface Vehicle {
  veiculo_id: number;
  nome: string;
  placa: string;
  modelo: string;
  marca: string;
  ano_fabricacao: number;
  capacidade: number;
  quilometragem: number;
  data_ultima_manutencao: string;
  data_proxima_manutencao: string;
  tipo_veiculo_id: VehicleType;
  status_veiculo_id: VehicleStatus;
  ativo: boolean;
  criacao: string;
  atualizacao: string;
}

interface Stop {
  ponto_id: number;
  nome: string;
  latitude: number;
  longitude: number;
  logradouro: string;
  numero_endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string | null;
  referencia: string;
  criacao: string;
  atualizacao: string;
}

interface Route {
  rota_id: number;
  codigo_rota: string;
  nome: string;
  descricao: string | null;
  origem_descricao: string;
  destino_descricao: string;
  distancia_km: number;
  tempo_viagem_estimado_minutos: number;
  status_rota_id: RouteStatus;
  criacao: string;
  atualizacao: string;
  ativo: boolean;
}

interface RouteStop {
  ponto_rota_id: number;
  rota_id: number;
  ponto_id: number;
  ordem: number;
  horario_previsto_passagem: string | null;
  distancia_do_ponto_anterior_km: number | null;
  criacao: string;
  atualizacao: string;
  ativo: boolean;
}

interface Passenger {
  passageiro_id: number;
  nome_completo: string;
  cpf: string;
  email: string;
  senha_hash: string;
  telefone: string | null;
  data_nascimento: string | null;
  pcd: boolean;
  logradouro: string;
  numero_endereco: string;
  complemento_endereco: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  tipo_passageiro_id: PassengerType;
  rota_id: number | null;
  ponto_id: number | null;
  criacao: string;
  atualizacao: string;
  ativo: boolean;
}

interface Activity {
  mudanca_id: number;
  usuario_id: number;
  tabela: string;
  registro_id: number;
  operacao: string;
  dados_antigos: any;
  dados_novos: any;
  timestamp: string;
  usuario?: {
    nome: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface VeiculoRota {
  veiculo_rota_id: number;
  rota_id: number;
  veiculo_id: number;
  motorista_id: number;
  observacoes: string | null;
  criacao: string;
  atualizacao: string;
  ativo: boolean;
}

interface Database {
  drivers: Driver[];
  vehicles: Vehicle[];
  stops: Stop[];
  routes: Route[];
  routeStops: RouteStop[];
  passengers: Passenger[];
  assignments: VeiculoRota[];
  activityLog: Activity[];
  notifications?: any[];
  invites?: any[];
}

// ===== INITIAL DATA (from migration 100_insert_data_with_triggers.sql) =====

const INITIAL_DATA: Database = {
  drivers: [
    {
      motorista_id: 1,
      nome: 'José Antonio Silva',
      cpf: '12345678901',
      cnh_numero: '12345678901',
      cnh_categoria: 'D',
      cnh_validade: '2026-12-31',
      telefone: '11987654321',
      email: 'jose.silva@empresa.com',
      data_admissao: '2020-01-15',
      status_motorista_id: DriverStatus.ATIVO,
      ativo: true,
      criacao: '2020-01-15T00:00:00.000Z',
      atualizacao: '2020-01-15T00:00:00.000Z'
    },
    {
      motorista_id: 2,
      nome: 'Maria Santos Lima',
      cpf: '23456789012',
      cnh_numero: '23456789012',
      cnh_categoria: 'AD',
      cnh_validade: '2025-08-15',
      telefone: '11976543210',
      email: 'maria.lima@empresa.com',
      data_admissao: '2019-03-10',
      status_motorista_id: DriverStatus.ATIVO,
      ativo: true,
      criacao: '2019-03-10T00:00:00.000Z',
      atualizacao: '2019-03-10T00:00:00.000Z'
    },
    {
      motorista_id: 3,
      nome: 'Carlos Eduardo Souza',
      cpf: '34567890123',
      cnh_numero: '34567890123',
      cnh_categoria: 'D',
      cnh_validade: '2027-05-20',
      telefone: '11965432109',
      email: 'carlos.souza@empresa.com',
      data_admissao: '2021-06-01',
      status_motorista_id: DriverStatus.ATIVO,
      ativo: true,
      criacao: '2021-06-01T00:00:00.000Z',
      atualizacao: '2021-06-01T00:00:00.000Z'
    },
    {
      motorista_id: 4,
      nome: 'Ana Paula Costa',
      cpf: '45678901234',
      cnh_numero: '45678901234',
      cnh_categoria: 'AE',
      cnh_validade: '2024-11-30',
      telefone: '11954321098',
      email: 'ana.costa@empresa.com',
      data_admissao: '2018-09-12',
      status_motorista_id: DriverStatus.FERIAS,
      ativo: false,
      criacao: '2018-09-12T00:00:00.000Z',
      atualizacao: '2018-09-12T00:00:00.000Z'
    },
    {
      motorista_id: 5,
      nome: 'Roberto Ferreira Santos',
      cpf: '56789012345',
      cnh_numero: '56789012345',
      cnh_categoria: 'D',
      cnh_validade: '2026-03-25',
      telefone: '11943210987',
      email: 'roberto.santos@empresa.com',
      data_admissao: '2022-02-28',
      status_motorista_id: DriverStatus.ATIVO,
      ativo: true,
      criacao: '2022-02-28T00:00:00.000Z',
      atualizacao: '2022-02-28T00:00:00.000Z'
    }
  ],
  vehicles: [
    {
      veiculo_id: 1,
      nome: 'Micro-ônibus 722',
      placa: 'OVD6954',
      modelo: 'Sprinter',
      marca: 'Volkswagen',
      ano_fabricacao: 2018,
      capacidade: 26,
      quilometragem: 324430.64,
      data_ultima_manutencao: '2025-05-11',
      data_proxima_manutencao: '2026-01-25',
      tipo_veiculo_id: VehicleType.MICROONIBUS,
      status_veiculo_id: VehicleStatus.EM_OPERACAO,
      ativo: true,
      criacao: '2025-05-11T00:00:00.000Z',
      atualizacao: '2025-05-11T00:00:00.000Z'
    },
    {
      veiculo_id: 2,
      nome: 'Van 472',
      placa: 'FVI1M30',
      modelo: 'Sprinter',
      marca: 'Ford',
      ano_fabricacao: 2010,
      capacidade: 13,
      quilometragem: 329220.91,
      data_ultima_manutencao: '2025-06-13',
      data_proxima_manutencao: '2026-01-22',
      tipo_veiculo_id: VehicleType.VAN,
      status_veiculo_id: VehicleStatus.EM_MANUTENCAO,
      ativo: false,
      criacao: '2025-06-13T00:00:00.000Z',
      atualizacao: '2025-06-13T00:00:00.000Z'
    },
    {
      veiculo_id: 3,
      nome: 'Micro-ônibus 430',
      placa: 'CWZ4362',
      modelo: 'CityClass',
      marca: 'Mercedes-Benz',
      ano_fabricacao: 2016,
      capacidade: 22,
      quilometragem: 391450.11,
      data_ultima_manutencao: '2024-12-24',
      data_proxima_manutencao: '2025-10-22',
      tipo_veiculo_id: VehicleType.MICROONIBUS,
      status_veiculo_id: VehicleStatus.INATIVO,
      ativo: false,
      criacao: '2024-12-24T00:00:00.000Z',
      atualizacao: '2024-12-24T00:00:00.000Z'
    }
  ],
  stops: [
    {
      ponto_id: 1,
      nome: 'UPA',
      latitude: -22.68914562,
      longitude: -46.98844598,
      logradouro: 'Rua Antônio Pinto Catão',
      numero_endereco: '1222',
      bairro: 'Jardim Planalto',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: '13820-000',
      referencia: 'Ao lado do UPA',
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z'
    },
    {
      ponto_id: 2,
      nome: 'Ponto Roseira',
      latitude: -22.69764820,
      longitude: -47.01604455,
      logradouro: 'Rua Jaboticabeira',
      numero_endereco: '123',
      bairro: 'Roseira de cima',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: '13917-480',
      referencia: 'Ponto de ônibus da roseira de cima',
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z'
    },
    {
      ponto_id: 3,
      nome: 'Ponto Kleber Lanches',
      latitude: -22.67832020,
      longitude: -46.97441025,
      logradouro: 'Rua Maranhão',
      numero_endereco: '3009',
      bairro: 'Imperial',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: '13911-292',
      referencia: 'Em frente ao mercado karina',
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z'
    },
    {
      ponto_id: 4,
      nome: 'Ponto Ki-Delicia',
      latitude: -22.68361624,
      longitude: -46.98219595,
      logradouro: 'Rua Alexandre Marion',
      numero_endereco: '346',
      bairro: 'Doze de Setembro',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: null,
      referencia: 'Em frente a Creche ao lado da padaria ki-delicia',
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z'
    },
    {
      ponto_id: 5,
      nome: 'ETEC João Belarmino',
      latitude: -22.70600582,
      longitude: -46.76519494,
      logradouro: 'Rua Sete de Setembro',
      numero_endereco: '299',
      bairro: 'Centro',
      cidade: 'Amparo',
      uf: 'SP',
      cep: '13903-125',
      referencia: 'Escola ETEC João Belarmino',
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z'
    }
  ],
  routes: [
    {
      rota_id: 1,
      codigo_rota: 'R001',
      nome: 'Jaguariuna - ETEC Amparo',
      descricao: null,
      origem_descricao: 'Ponto Roseira',
      destino_descricao: 'ETEC João Belarmino',
      distancia_km: 38.98,
      tempo_viagem_estimado_minutos: 47,
      status_rota_id: RouteStatus.ATIVA,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    }
  ],
  routeStops: [
    {
      ponto_rota_id: 1,
      rota_id: 1,
      ponto_id: 2,
      ordem: 1,
      horario_previsto_passagem: null,
      distancia_do_ponto_anterior_km: null,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    },
    {
      ponto_rota_id: 2,
      rota_id: 1,
      ponto_id: 1,
      ordem: 2,
      horario_previsto_passagem: null,
      distancia_do_ponto_anterior_km: null,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    },
    {
      ponto_rota_id: 3,
      rota_id: 1,
      ponto_id: 4,
      ordem: 3,
      horario_previsto_passagem: null,
      distancia_do_ponto_anterior_km: null,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    },
    {
      ponto_rota_id: 4,
      rota_id: 1,
      ponto_id: 3,
      ordem: 4,
      horario_previsto_passagem: null,
      distancia_do_ponto_anterior_km: null,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    },
    {
      ponto_rota_id: 5,
      rota_id: 1,
      ponto_id: 5,
      ordem: 5,
      horario_previsto_passagem: null,
      distancia_do_ponto_anterior_km: null,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    }
  ],
  passengers: [
    {
      passageiro_id: 1,
      nome_completo: 'João da Silva Santos',
      cpf: '12345678901',
      email: 'joao.santos@example.com',
      senha_hash: 'hashed_password_1',
      telefone: '11999999999',
      data_nascimento: '2005-05-15',
      pcd: false,
      logradouro: 'Rua Principal',
      numero_endereco: '123',
      complemento_endereco: 'Apt 45',
      bairro: 'Centro',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: '13820000',
      tipo_passageiro_id: PassengerType.ESTUDANTE,
      rota_id: 1,
      ponto_id: 2,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    },
    {
      passageiro_id: 2,
      nome_completo: 'Maria Oliveira Costa',
      cpf: '23456789012',
      email: 'maria.costa@example.com',
      senha_hash: 'hashed_password_2',
      telefone: '11988888888',
      data_nascimento: '2004-08-22',
      pcd: true,
      logradouro: 'Avenida Brasil',
      numero_endereco: '456',
      complemento_endereco: null,
      bairro: 'Vila Nova',
      cidade: 'Jaguariúna',
      uf: 'SP',
      cep: '13911292',
      tipo_passageiro_id: PassengerType.CORPORATIVO,
      rota_id: 1,
      ponto_id: 1,
      criacao: '2025-10-21T11:58:32.000Z',
      atualizacao: '2025-10-21T11:58:32.000Z',
      ativo: true
    }
  ],
  assignments: [],
  activityLog: []
};

// ===== HELPER FUNCTIONS =====

function getTimestamp(): string {
  return new Date().toISOString();
}

function generateId(): number {
  return Date.now() + Math.random();
}

// ===== LOCALSTORAGE DB CLASS =====

class LocalStorageDB {
  private db: Database;

  constructor() {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        this.db = JSON.parse(stored);
        // Migração: garantir que novas tabelas existam
        if (!this.db.assignments) this.db.assignments = [];
        if (!this.db.notifications) this.db.notifications = [];
        if (!this.db.invites) this.db.invites = [];
      } catch (e) {
        this.db = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.save();
      }
    } else {
      this.db = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.save();
    }
  }

  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.db));
  }

  // ===== DRIVERS =====
  getDrivers(page = 1, limit = 10, search = ''): PaginatedResponse<Driver> {
    let filtered = [...this.db.drivers];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(d =>
        d.nome.toLowerCase().includes(searchLower) ||
        d.cpf.includes(search) ||
        d.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, pages };
  }

  getDriverById(id: number): Driver | null {
    return this.db.drivers.find(d => d.motorista_id === id) || null;
  }

  createDriver(data: Omit<Driver, 'motorista_id' | 'criacao' | 'atualizacao'>): Driver {
    const driver: Driver = {
      ...data,
      motorista_id: Math.max(...this.db.drivers.map(d => d.motorista_id), 0) + 1,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.drivers.push(driver);
    this.logActivity('INSERT', 'Motoristas', driver.motorista_id, null, driver);
    this.save();
    return driver;
  }

  updateDriver(id: number, data: Partial<Driver>): Driver {
    const driver = this.db.drivers.find(d => d.motorista_id === id);
    if (!driver) throw new Error(`Driver ${id} not found`);

    const oldData = { ...driver };
    Object.assign(driver, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'Motoristas', id, oldData, driver);
    this.save();
    return driver;
  }

  deleteDriver(id: number) {
    const index = this.db.drivers.findIndex(d => d.motorista_id === id);
    if (index === -1) throw new Error(`Driver ${id} not found`);

    const oldData = { ...this.db.drivers[index] };
    this.db.drivers.splice(index, 1);
    this.logActivity('DELETE', 'Motoristas', id, oldData, null);
    this.save();
  }

  // ===== VEHICLES =====
  getVehicles(page = 1, limit = 10, search = ''): PaginatedResponse<Vehicle> {
    let filtered = [...this.db.vehicles];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(v =>
        v.nome.toLowerCase().includes(searchLower) ||
        v.placa.toLowerCase().includes(searchLower) ||
        v.modelo.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, pages };
  }

  getVehicleById(id: number): Vehicle | null {
    return this.db.vehicles.find(v => v.veiculo_id === id) || null;
  }

  createVehicle(data: Omit<Vehicle, 'veiculo_id' | 'criacao' | 'atualizacao'>): Vehicle {
    const vehicle: Vehicle = {
      ...data,
      veiculo_id: Math.max(...this.db.vehicles.map(v => v.veiculo_id), 0) + 1,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.vehicles.push(vehicle);
    this.logActivity('INSERT', 'Veiculos', vehicle.veiculo_id, null, vehicle);
    this.save();
    return vehicle;
  }

  updateVehicle(id: number, data: Partial<Vehicle>): Vehicle {
    const vehicle = this.db.vehicles.find(v => v.veiculo_id === id);
    if (!vehicle) throw new Error(`Vehicle ${id} not found`);

    const oldData = { ...vehicle };
    Object.assign(vehicle, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'Veiculos', id, oldData, vehicle);
    this.save();
    return vehicle;
  }

  deleteVehicle(id: number) {
    const index = this.db.vehicles.findIndex(v => v.veiculo_id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    const oldData = { ...this.db.vehicles[index] };
    this.db.vehicles.splice(index, 1);
    this.logActivity('DELETE', 'Veiculos', id, oldData, null);
    this.save();
  }

  // ===== STOPS =====
  getStops(): Stop[] {
    return JSON.parse(JSON.stringify(this.db.stops));
  }

  getStopById(id: number): Stop | null {
    return this.db.stops.find(s => s.ponto_id === id) || null;
  }

  createStop(data: Omit<Stop, 'ponto_id' | 'criacao' | 'atualizacao'>): Stop {
    const stop: Stop = {
      ...data,
      ponto_id: Math.max(...this.db.stops.map(s => s.ponto_id), 0) + 1,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.stops.push(stop);
    this.logActivity('INSERT', 'Pontos', stop.ponto_id, null, stop);
    this.save();
    return stop;
  }

  updateStop(id: number, data: Partial<Stop>): Stop {
    const stop = this.db.stops.find(s => s.ponto_id === id);
    if (!stop) throw new Error(`Stop ${id} not found`);

    const oldData = { ...stop };
    Object.assign(stop, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'Pontos', id, oldData, stop);
    this.save();
    return stop;
  }

  deleteStop(id: number) {
    const index = this.db.stops.findIndex(s => s.ponto_id === id);
    if (index === -1) throw new Error(`Stop ${id} not found`);

    const oldData = { ...this.db.stops[index] };
    this.db.stops.splice(index, 1);
    this.logActivity('DELETE', 'Pontos', id, oldData, null);
    this.save();
  }

  // ===== ROUTES =====
  getRoutes(page = 1, limit = 10, search = ''): PaginatedResponse<Route> {
    let filtered = [...this.db.routes];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.nome.toLowerCase().includes(searchLower) ||
        r.codigo_rota.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit).map(route => {
      // Buscar associação ativa para esta rota
      const assignments = this.db.assignments || [];
      const activeAssignment = assignments.find(a => a.rota_id === route.rota_id && a.ativo !== false);
      
      let driverName = null;
      let driverCnh = null;
      let vehicleName = null;
      let vehiclePlaca = null;

      if (activeAssignment) {
        const driver = this.db.drivers.find(d => d.motorista_id === activeAssignment.motorista_id);
        const vehicle = this.db.vehicles.find(v => v.veiculo_id === activeAssignment.veiculo_id);
        
        driverName = driver?.nome || null;
        driverCnh = driver?.cnh_numero || null;
        vehicleName = vehicle?.nome || null;
        vehiclePlaca = vehicle?.placa || null;
      }

      return {
        ...route,
        motorista_nome: driverName,
        motorista_cnh: driverCnh,
        veiculo_nome: vehicleName,
        veiculo_placa: vehiclePlaca
      };
    });

    return { data, total, page, limit, pages };
  }

  getRouteById(id: number): Route | null {
    return this.db.routes.find(r => r.rota_id === id) || null;
  }

  createRoute(data: Omit<Route, 'rota_id' | 'criacao' | 'atualizacao'>): Route {
    const route: Route = {
      ...data,
      rota_id: Math.max(...this.db.routes.map(r => r.rota_id), 0) + 1,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.routes.push(route);
    this.logActivity('INSERT', 'Rotas', route.rota_id, null, route);
    this.save();
    return route;
  }

  updateRoute(id: number, data: Partial<Route>): Route {
    const route = this.db.routes.find(r => r.rota_id === id);
    if (!route) throw new Error(`Route ${id} not found`);

    const oldData = { ...route };
    Object.assign(route, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'Rotas', id, oldData, route);
    this.save();
    return route;
  }

  deleteRoute(id: number) {
    const index = this.db.routes.findIndex(r => r.rota_id === id);
    if (index === -1) throw new Error(`Route ${id} not found`);

    const oldData = { ...this.db.routes[index] };
    this.db.routes.splice(index, 1);
    this.logActivity('DELETE', 'Rotas', id, oldData, null);
    this.save();
  }

  getRouteStops(routeId: number): Stop[] {
    const routeStops = this.db.routeStops.filter(rs => rs.rota_id === routeId);
    return routeStops
      .sort((a, b) => a.ordem - b.ordem)
      .map(rs => this.db.stops.find(s => s.ponto_id === rs.ponto_id))
      .filter(s => s !== undefined) as Stop[];
  }

  getRouteByIdWithStops(id: number) {
    const route = this.db.routes.find(r => r.rota_id === id);
    if (!route) throw new Error(`Route ${id} not found`);

    const stopsData = this.db.routeStops
      .filter(rs => rs.rota_id === id)
      .sort((a, b) => a.ordem - b.ordem)
      .map(rs => this.db.stops.find(s => s.ponto_id === rs.ponto_id));

    return {
      ...route,
      pontos: stopsData,
    };
  }

  // ===== PASSENGERS =====
  getPassengers(page = 1, limit = 10, search = ''): PaginatedResponse<Passenger> {
    let filtered = [...this.db.passengers];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nome_completo.toLowerCase().includes(searchLower) ||
        p.cpf.includes(search) ||
        p.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit).map(passenger => {
      const route = this.db.routes.find(r => r.rota_id === passenger.rota_id);
      const stop = this.db.stops.find(s => s.ponto_id === passenger.ponto_id);
      
      return {
        ...passenger,
        nome: passenger.nome_completo, // Frontend às vezes usa .nome
        rota_nome: route?.nome || null,
        ponto_nome: stop?.nome || null
      };
    });

    return { data, total, page, limit, pages };
  }

  getPassengerById(id: number): Passenger | null {
    return this.db.passengers.find(p => p.passageiro_id === id) || null;
  }

  createPassenger(data: Omit<Passenger, 'passageiro_id' | 'criacao' | 'atualizacao'>): Passenger {
    const passenger: Passenger = {
      ...data,
      passageiro_id: Math.max(...this.db.passengers.map(p => p.passageiro_id), 0) + 1,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.passengers.push(passenger);
    this.logActivity('INSERT', 'Passageiros', passenger.passageiro_id, null, passenger);
    this.save();
    return passenger;
  }

  updatePassenger(id: number, data: Partial<Passenger>): Passenger {
    const passenger = this.db.passengers.find(p => p.passageiro_id === id);
    if (!passenger) throw new Error(`Passenger ${id} not found`);

    const oldData = { ...passenger };
    Object.assign(passenger, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'Passageiros', id, oldData, passenger);
    this.save();
    return passenger;
  }

  deletePassenger(id: number) {
    const index = this.db.passengers.findIndex(p => p.passageiro_id === id);
    if (index === -1) throw new Error(`Passenger ${id} not found`);

    const oldData = { ...this.db.passengers[index] };
    this.db.passengers.splice(index, 1);
    this.logActivity('DELETE', 'Passageiros', id, oldData, null);
    this.save();
  }

  // ===== ACTIVITY LOG =====
  getRecentActivity(limit = 50): Activity[] {
    return this.db.activityLog.slice(-limit).reverse().map(a => ({
      ...a,
      usuario: { nome: 'Administrador (Demo)' }
    }));
  }

  logActivity(action: string, entity: string, entityId: number, oldData: any = null, newData: any = null) {
    this.db.activityLog.push({
      mudanca_id: Math.max(...this.db.activityLog.map(a => a.mudanca_id || 0), 0) + 1,
      usuario_id: 1,
      tabela: entity,
      registro_id: entityId,
      operacao: action,
      dados_antigos: oldData,
      dados_novos: newData,
      timestamp: getTimestamp()
    });

    // Keep only last 1000 records
    if (this.db.activityLog.length > 1000) {
      this.db.activityLog = this.db.activityLog.slice(-1000);
    }
    this.save();
  }

  // ===== REPORTS =====
  getStats() {
    // Calcular estatísticas de rotas
    const totalRotas = this.db.routes.length;
    const rotasAtivas = this.db.routes.filter(r => r.status_rota_id === RouteStatus.ATIVA).length;

    // Calcular estatísticas de motoristas
    const totalMotoristas = this.db.drivers.length;
    const motoristasAtivos = this.db.drivers.filter(d => 
      (d.ativo === true || d.ativo === 1) && d.status_motorista_id === DriverStatus.ATIVO
    ).length;

    // Calcular estatísticas de pontos
    const totalPontos = this.db.stops.length;
    const pontosAtivos = this.db.stops.length; // Todos os pontos do banco estão ativos

    // Calcular capacidade total dos veículos
    const totalCapacidade = this.db.vehicles.reduce((total, v) => total + (v.capacidade || 0), 0);

    // Calcular estatísticas de veículos por status
    const vehiclesByStatus = [
      {
        label: 'Em Operação',
        value: this.db.vehicles.filter(v => v.status_veiculo_id === VehicleStatus.EM_OPERACAO).length
      },
      {
        label: 'Em Manutenção',
        value: this.db.vehicles.filter(v => v.status_veiculo_id === VehicleStatus.EM_MANUTENCAO).length
      },
      {
        label: 'Inativo',
        value: this.db.vehicles.filter(v => v.status_veiculo_id === VehicleStatus.INATIVO).length
      }
    ];

    return {
      data: {
        passengers: {
          total: this.db.passengers.length
        },
        drivers: {
          total: totalMotoristas,
          ativos: motoristasAtivos,
          byStatus: [
            {
              status_nome: 'Ativo',
              total_motoristas: this.db.drivers.filter(d => d.status_motorista_id === DriverStatus.ATIVO).length
            },
            {
              status_nome: 'Férias',
              total_motoristas: this.db.drivers.filter(d => d.status_motorista_id === DriverStatus.FERIAS).length
            },
            {
              status_nome: 'Afastado',
              total_motoristas: this.db.drivers.filter(d => d.status_motorista_id === DriverStatus.AFASTADO).length
            },
            {
              status_nome: 'Inativo',
              total_motoristas: this.db.drivers.filter(d => d.status_motorista_id === DriverStatus.INATIVO).length
            }
          ]
        },
        vehicles: {
          total: this.db.vehicles.length,
          totalCapacity: totalCapacidade,
          byStatus: vehiclesByStatus
        },
        stops: {
          total_pontos: totalPontos,
          pontos_ativos: pontosAtivos,
          byCity: Array.from(
            this.db.stops.reduce((map, stop) => {
              const city = stop.cidade || 'Não informado';
              map.set(city, (map.get(city) || 0) + 1);
              return map;
            }, new Map())
          ).map(([city, count]) => ({
            cidade: city,
            total_pontos: count
          }))
        },
        routes: {
          total: totalRotas,
          ativas: rotasAtivas,
          byStatus: [
            {
              status_nome: 'Ativa',
              total_rotas: rotasAtivas
            },
            {
              status_nome: 'Inativa',
              total_rotas: this.db.routes.filter(r => r.status_rota_id === RouteStatus.INATIVA).length
            },
            {
              status_nome: 'Em Planejamento',
              total_rotas: this.db.routes.filter(r => r.status_rota_id === RouteStatus.EM_PLANEJAMENTO).length
            }
          ]
        }
      }
    };
  }

  // ===== AUTHENTICATION =====
  login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = {
      id: 1,
      email: email,
      name: email.split('@')[0],
      role: 'admin',
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };

    const token = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return { token, user };
  }

  getCurrentUser(token: string) {
    if (!token || !token.startsWith('demo_token_')) {
      throw new Error('Token inválido');
    }

    return {
      id: 1,
      email: 'admin@bushere.com',
      name: 'Admin',
      role: 'admin',
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
  }

  logout() {
    return { success: true };
  }

  // ===== MISSING STATUS/TYPE METHODS =====
  getDriverStatus() {
    return [
      { status_motorista_id: DriverStatus.ATIVO, nome: 'Ativo' },
      { status_motorista_id: DriverStatus.FERIAS, nome: 'Férias' },
      { status_motorista_id: DriverStatus.AFASTADO, nome: 'Afastado' },
      { status_motorista_id: DriverStatus.INATIVO, nome: 'Inativo' }
    ];
  }

  getVehicleStatus() {
    return [
      { status_veiculo_id: VehicleStatus.EM_OPERACAO, nome: 'Em Operação' },
      { status_veiculo_id: VehicleStatus.EM_MANUTENCAO, nome: 'Em Manutenção' },
      { status_veiculo_id: VehicleStatus.INATIVO, nome: 'Inativo' }
    ];
  }

  getVehicleTypes() {
    return [
      { tipo_veiculo_id: VehicleType.ONIBUS, nome: 'Ônibus' },
      { tipo_veiculo_id: VehicleType.MICROONIBUS, nome: 'Microônibus' },
      { tipo_veiculo_id: VehicleType.VAN, nome: 'Van' }
    ];
  }

  getRouteStatus() {
    return [
      { status_rota_id: RouteStatus.ATIVA, nome: 'Ativa' },
      { status_rota_id: RouteStatus.INATIVA, nome: 'Inativa' },
      { status_rota_id: RouteStatus.EM_PLANEJAMENTO, nome: 'Em Planejamento' }
    ];
  }

  getPassengerTypes() {
    return [
      { tipo_passageiro_id: PassengerType.ESTUDANTE, nome: 'Estudante' },
      { tipo_passageiro_id: PassengerType.CORPORATIVO, nome: 'Corporativo' }
    ];
  }

  getStopsStats() {
    return {
      data: {
        total: this.db.stops.length,
        ativo: this.db.stops.filter(s => s.ativo !== false).length,
        inativo: this.db.stops.filter(s => s.ativo === false).length
      }
    };
  }

  searchStops(name: string) {
    const searchLower = name.toLowerCase();
    return this.db.stops.filter(s =>
      s.nome.toLowerCase().includes(searchLower) ||
      s.bairro.toLowerCase().includes(searchLower) ||
      s.cidade.toLowerCase().includes(searchLower)
    );
  }

  searchPassengers(name: string) {
    const searchLower = name.toLowerCase();
    return this.db.passengers.filter(p =>
      p.nome_completo.toLowerCase().includes(searchLower) ||
      p.cpf.includes(name) ||
      p.email.toLowerCase().includes(searchLower)
    );
  }

  // ===== ASSIGNMENTS (DRIVER/VEHICLE/ROUTE ASSIGNMENTS) =====
  getAssignments(routeId: number) {
    // Initialize assignments table if not exists
    if (!this.db.assignments) {
      this.db.assignments = [];
    }
    const assignments = this.db.assignments.filter(a => a.rota_id === routeId);
    
    // Mapear campos para garantir compatibilidade com o frontend
    const mappedAssignments = assignments.map(a => {
      // Obter nomes para exibição
      const driver = this.db.drivers.find(d => d.motorista_id === a.motorista_id);
      const vehicle = this.db.vehicles.find(v => v.veiculo_id === a.veiculo_id);
      
      return {
        ...a,
        veiculo_rota_id: a.veiculo_rota_id || (a as any).escala_id,
        motorista_nome: driver?.nome || 'Não informado',
        motorista_cnh: driver?.cnh_numero || '',
        veiculo_nome: vehicle?.nome || 'Não informado',
        veiculo_placa: vehicle?.placa || '',
        ativo: a.ativo !== false
      };
    });

    return { data: mappedAssignments };
  }

  createAssignment(routeId: number, data: any) {
    if (!this.db.assignments) {
      this.db.assignments = [];
    }
    const assignment: VeiculoRota = {
      veiculo_rota_id: Math.max(...this.db.assignments.map(a => a.veiculo_rota_id || (a as any).escala_id || 0), 0) + 1,
      rota_id: routeId,
      motorista_id: data.motorista_id,
      veiculo_id: data.veiculo_id,
      observacoes: data.observacoes || null,
      ativo: true,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.assignments.push(assignment);
    this.logActivity('INSERT', 'VeiculoRota', assignment.veiculo_rota_id, null, assignment);
    this.save();
    return assignment;
  }

  updateAssignment(routeId: number, assignmentId: number, data: any) {
    if (!this.db.assignments) {
      this.db.assignments = [];
    }
    const assignment = this.db.assignments.find(a => 
      (a.veiculo_rota_id === assignmentId || (a as any).escala_id === assignmentId) && a.rota_id === routeId
    );
    if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);
    
    const oldData = { ...assignment };
    Object.assign(assignment, data, { atualizacao: getTimestamp() });
    this.logActivity('UPDATE', 'VeiculoRota', assignmentId, oldData, assignment);
    this.save();
    return assignment;
  }

  deleteAssignment(routeId: number, assignmentId: number) {
    if (!this.db.assignments) {
      this.db.assignments = [];
    }
    const index = this.db.assignments.findIndex(a =>
      (a.veiculo_rota_id === assignmentId || (a as any).escala_id === assignmentId) && a.rota_id === routeId
    );
    if (index === -1) throw new Error(`Assignment ${assignmentId} not found`);
    
    const oldData = { ...this.db.assignments[index] };
    this.db.assignments.splice(index, 1);
    this.logActivity('DELETE', 'VeiculoRota', assignmentId, oldData, null);
    this.save();
  }

  // ===== NOTIFICATIONS =====
  getNotifications() {
    if (!this.db.notifications) {
      this.db.notifications = [];
    }
    return this.db.notifications;
  }

  getNotificationScopes() {
    return ['system', 'passenger', 'driver', 'enterprise'];
  }

  createNotification(data: any) {
    if (!this.db.notifications) {
      this.db.notifications = [];
    }
    const notification = {
      id: Math.max(...(this.db.notifications.map(n => n.id) || []), 0) + 1,
      titulo: data.titulo,
      descricao: data.descricao,
      tipo: data.tipo || 'info',
      escopo: data.escopo || 'system',
      ativo: data.ativo !== false,
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.notifications.push(notification);
    this.save();
    return notification;
  }

  updateNotification(id: number, data: any) {
    if (!this.db.notifications) {
      this.db.notifications = [];
    }
    const notification = this.db.notifications.find(n => n.id === id);
    if (!notification) throw new Error(`Notification ${id} not found`);
    Object.assign(notification, data, { atualizacao: getTimestamp() });
    this.save();
    return notification;
  }

  deleteNotification(id: number) {
    if (!this.db.notifications) {
      this.db.notifications = [];
    }
    const index = this.db.notifications.findIndex(n => n.id === id);
    if (index === -1) throw new Error(`Notification ${id} not found`);
    this.db.notifications.splice(index, 1);
    this.save();
  }

  // ===== INVITES =====
  getInvites() {
    if (!this.db.invites) {
      this.db.invites = [];
    }
    return this.db.invites;
  }

  getInviteById(id: number) {
    if (!this.db.invites) {
      this.db.invites = [];
    }
    return this.db.invites.find(i => i.id === id) || null;
  }

  createInvite(data: any) {
    if (!this.db.invites) {
      this.db.invites = [];
    }
    const invite = {
      id: Math.max(...(this.db.invites.map(i => i.id) || []), 0) + 1,
      email: data.email,
      role: data.role || 'user',
      status: 'pending',
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    this.db.invites.push(invite);
    this.save();
    return invite;
  }

  // ===== REPORTS =====
  getCharts() {
    // Passageiros por cidade
    const passengersByCity = this.db.passengers.reduce((acc, p) => {
      const city = p.cidade || 'Não informado';
      const existing = acc.find(item => item.label === city);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: city, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    // Veículos por status
    const vehiclesByStatus = this.db.vehicles.reduce((acc, v) => {
      const status = getVehicleStatusName(v.status_veiculo_id);
      const existing = acc.find(item => item.label === status);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: status, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    // Veículos por tipo
    const vehiclesByType = this.db.vehicles.reduce((acc, v) => {
      const type = getVehicleTypeName(v.tipo_veiculo_id);
      const existing = acc.find(item => item.label === type);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: type, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    // Pontos por cidade
    const stopsByCity = this.db.stops.reduce((acc, s) => {
      const city = s.cidade || 'Não informado';
      const existing = acc.find(item => item.label === city);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: city, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    // Rotas por status
    const routesByStatus = this.db.routes.reduce((acc, r) => {
      const status = getRouteStatusName(r.status_rota_id);
      const existing = acc.find(item => item.label === status);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: status, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    // Motoristas por status
    const driversByStatus = this.db.drivers.reduce((acc, d) => {
      const status = getDriverStatusName(d.status_motorista_id);
      const existing = acc.find(item => item.label === status);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: status, value: 1 });
      }
      return acc;
    }, [] as Array<{ label: string; value: number }>);

    return {
      data: {
        passengersByCity,
        vehiclesByStatus,
        vehiclesByType,
        stopsByCity,
        routesByStatus,
        driversByStatus
      }
    };
  }

  getUtilization() {
    return {
      data: {
        vehicles: {
          total: this.db.vehicles.length,
          inUse: (this.db.assignments || []).length,
          available: this.db.vehicles.length - (this.db.assignments || []).length
        },
        drivers: {
          total: this.db.drivers.length,
          assigned: (this.db.assignments || []).map(a => a.motorista_id).filter((v, i, a) => a.indexOf(v) === i).length,
          available: this.db.drivers.length - (this.db.assignments || []).map(a => a.motorista_id).filter((v, i, a) => a.indexOf(v) === i).length
        }
      }
    };
  }

  getPointsOnly() {
    return {
      data: this.db.stops.map(s => ({
        ponto_id: s.ponto_id,
        nome: s.nome,
        latitude: s.latitude,
        longitude: s.longitude,
        bairro: s.bairro,
        cidade: s.cidade
      }))
    };
  }

  // ===== SEARCH & AUTOCOMPLETE =====
  searchAutocomplete(query: string) {
    const q = query.toLowerCase();
    return {
      drivers: this.db.drivers.filter(d => d.nome.toLowerCase().includes(q)).slice(0, 5),
      vehicles: this.db.vehicles.filter(v => v.nome.toLowerCase().includes(q) || v.placa.toLowerCase().includes(q)).slice(0, 5),
      stops: this.db.stops.filter(s => s.nome.toLowerCase().includes(q)).slice(0, 5),
      routes: this.db.routes.filter(r => r.nome.toLowerCase().includes(q)).slice(0, 5),
      passengers: this.db.passengers.filter(p => p.nome_completo.toLowerCase().includes(q)).slice(0, 5)
    };
  }

  // ===== MISSING HELPER METHODS =====
  register(email: string, password: string, name: string) {
    const user = {
      id: 1,
      email,
      name,
      role: 'user',
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
    const token = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { token, user };
  }

  changePassword(token: string, oldPassword: string, newPassword: string) {
    if (!token || !token.startsWith('demo_token_')) {
      throw new Error('Token inválido');
    }
    return { success: true, message: 'Senha alterada com sucesso' };
  }

  getUserById(id: number) {
    return {
      id,
      email: `user${id}@bushere.com`,
      name: `User ${id}`,
      role: 'admin',
      criacao: getTimestamp(),
      atualizacao: getTimestamp()
    };
  }

  import(data: any) {
    try {
      this.db = JSON.parse(JSON.stringify(data));
      this.save();
      return { success: true, message: 'Database imported successfully' };
    } catch (e) {
      throw new Error('Failed to import database');
    }
  }

  executeSql(sql: string) {
    // Demo implementation - return mock data
    return {
      success: true,
      message: 'SQL executed in demo mode',
      rows: []
    };
  }

  getRoutesByPassenger() {
    return {
      data: this.db.routes.map(r => ({
        rota_id: r.rota_id,
        nome: r.nome,
        origem: r.origem_descricao,
        destino: r.destino_descricao,
        passageiros: this.db.passengers.filter(p => p.rota_id === r.rota_id).length
      }))
    };
  }

  getStopsByPassenger() {
    return {
      data: this.db.stops.map(s => ({
        ponto_id: s.ponto_id,
        nome: s.nome,
        passageiros: this.db.passengers.filter(p => p.ponto_id === s.ponto_id).length
      }))
    };
  }

  export() {
    return JSON.parse(JSON.stringify(this.db));
  }
}

// ===== EXPORTS =====
export const db = new LocalStorageDB();

export function setDemoMode(enabled: boolean) {
  localStorage.setItem(DEMO_MODE_KEY, String(enabled));
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

export type { Driver, Vehicle, Stop, Route, RouteStop, Passenger, Activity, PaginatedResponse };
export { DriverStatus, VehicleStatus, RouteStatus, VehicleType, PassengerType };