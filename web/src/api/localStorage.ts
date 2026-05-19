/**
 * Sistema de Mock Database usando localStorage
 * Simula um banco de dados completo para a demo offline
 */

// Função auxiliar para gerar IDs únicos
function generateId(): number {
  return Math.floor(Math.random() * 1000000) + 1;
}

// Função auxiliar para obter timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

// Interface para resposta paginada
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Estrutura padrão de entidades
interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos de dados
interface Passenger extends BaseEntity {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  uf: string;
  cep: string;
  type: string;
}

interface Driver extends BaseEntity {
  name: string;
  cpf: string;
  cnh: string;
  email: string;
  phone: string;
  status: string;
}

interface Vehicle extends BaseEntity {
  plate: string;
  model: string;
  type: string;
  capacity: number;
  status: string;
  year: number;
}

interface Stop extends BaseEntity {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
}

interface Route extends BaseEntity {
  name: string;
  code: string;
  description: string;
  stops: number[];
  status: string;
}

interface Assignment extends BaseEntity {
  routeId: number;
  vehicleId: number;
  driverId: number;
  startDate: string;
  endDate?: string;
  status: string;
}

interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: string;
  read: boolean;
  scope: string;
}

interface Invite extends BaseEntity {
  email: string;
  status: string;
  expiresAt: string;
}

// Database structure
interface Database {
  passengers: Passenger[];
  drivers: Driver[];
  vehicles: Vehicle[];
  stops: Stop[];
  routes: Route[];
  assignments: Assignment[];
  notifications: Notification[];
  invites: Invite[];
  activityLog: any[];
}

const DB_KEY = 'bushere_demo_db';
const DEMO_MODE_KEY = 'bushere_demo_mode';

// Dados iniciais para reset
const INITIAL_DATA: Database = {
  passengers: [
    {
      id: 1,
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao@example.com',
      phone: '11987654321',
      address: 'Rua A, 123',
      city: 'São Paulo',
      uf: 'SP',
      cep: '01234-567',
      type: 'regular',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 2,
      name: 'Maria Santos',
      cpf: '987.654.321-00',
      email: 'maria@example.com',
      phone: '11912345678',
      address: 'Avenida B, 456',
      city: 'São Paulo',
      uf: 'SP',
      cep: '02345-678',
      type: 'regular',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  drivers: [
    {
      id: 1,
      name: 'Carlos Oliveira',
      cpf: '111.222.333-44',
      cnh: 'ABC123456',
      email: 'carlos@example.com',
      phone: '11988776655',
      status: 'active',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 2,
      name: 'Pedro Alves',
      cpf: '555.666.777-88',
      cnh: 'DEF789012',
      email: 'pedro@example.com',
      phone: '11999887766',
      status: 'active',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  vehicles: [
    {
      id: 1,
      plate: 'ABC1234',
      model: 'Mercedes Sprinter',
      type: 'van',
      capacity: 15,
      status: 'active',
      year: 2022,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 2,
      plate: 'DEF5678',
      model: 'Volkswagen Crafter',
      type: 'van',
      capacity: 20,
      status: 'active',
      year: 2021,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  stops: [
    {
      id: 1,
      name: 'Terminal Centro',
      address: 'Praça da Sé, 1',
      latitude: -23.5505,
      longitude: -46.6333,
      city: 'São Paulo',
      uf: 'SP',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 2,
      name: 'Estação Tatuapé',
      address: 'Avenida Tatuapé, 500',
      latitude: -23.5530,
      longitude: -46.5500,
      city: 'São Paulo',
      uf: 'SP',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 3,
      name: 'Shopping Aricanduva',
      address: 'Avenida Aricanduva, 3000',
      latitude: -23.5720,
      longitude: -46.5100,
      city: 'São Paulo',
      uf: 'SP',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  routes: [
    {
      id: 1,
      name: 'Centro - Tatuapé',
      code: 'CT-001',
      description: 'Rota do centro até estação Tatuapé',
      stops: [1, 2],
      status: 'active',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    },
    {
      id: 2,
      name: 'Centro - Aricanduva',
      code: 'CA-001',
      description: 'Rota do centro até shopping Aricanduva',
      stops: [1, 3],
      status: 'active',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  assignments: [
    {
      id: 1,
      routeId: 1,
      vehicleId: 1,
      driverId: 1,
      startDate: getTimestamp(),
      status: 'active',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }
  ],
  notifications: [],
  invites: [],
  activityLog: []
};

class LocalStorageDB {
  private db: Database;

  constructor() {
    this.loadOrInit();
  }

  /**
   * Carrega o banco de dados do localStorage ou inicializa com dados padrão
   */
  private loadOrInit() {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        this.db = JSON.parse(stored);
      } catch (e) {
        console.warn('Erro ao carregar DB do localStorage, inicializando com dados padrão');
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  /**
   * Salva o banco de dados no localStorage
   */
  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.db));
  }

  /**
   * Reseta o banco de dados para os dados iniciais
   */
  reset() {
    this.db = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
    console.log('🔄 Database resetado com dados iniciais');
  }

  /**
   * Obtém todos os dados do banco
   */
  getAllData() {
    return JSON.parse(JSON.stringify(this.db));
  }

  /**
   * Exporta o banco de dados (para download/visualização)
   */
  export() {
    return JSON.parse(JSON.stringify(this.db));
  }

  /**
   * Importa dados no banco de dados
   */
  import(data: Partial<Database>) {
    Object.assign(this.db, data);
    this.save();
    console.log('✅ Database importado com sucesso');
  }

  // ===== PASSENGERS =====
  getPassengers(page = 1, limit = 10, search = ''): PaginatedResponse<Passenger> {
    let filtered = [...this.db.passengers];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.cpf.includes(search) ||
        p.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, pages };
  }

  getPassengerById(id: number): Passenger | null {
    return this.db.passengers.find(p => p.id === id) || null;
  }

  createPassenger(data: Omit<Passenger, 'id' | 'createdAt' | 'updatedAt'>): Passenger {
    const passenger: Passenger = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.passengers.push(passenger);
    this.save();
    this.logActivity('CREATE', 'passenger', passenger.id);
    return passenger;
  }

  updatePassenger(id: number, data: Partial<Passenger>): Passenger {
    const passenger = this.db.passengers.find(p => p.id === id);
    if (!passenger) throw new Error(`Passenger ${id} not found`);

    Object.assign(passenger, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'passenger', id);
    return passenger;
  }

  deletePassenger(id: number) {
    const index = this.db.passengers.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Passenger ${id} not found`);

    this.db.passengers.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'passenger', id);
  }

  getPassengerTypes() {
    return ['regular', 'student', 'elderly', 'pcd'];
  }

  // ===== DRIVERS =====
  getDrivers(page = 1, limit = 10, search = ''): PaginatedResponse<Driver> {
    let filtered = [...this.db.drivers];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
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
    return this.db.drivers.find(d => d.id === id) || null;
  }

  createDriver(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Driver {
    const driver: Driver = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.drivers.push(driver);
    this.save();
    this.logActivity('CREATE', 'driver', driver.id);
    return driver;
  }

  updateDriver(id: number, data: Partial<Driver>): Driver {
    const driver = this.db.drivers.find(d => d.id === id);
    if (!driver) throw new Error(`Driver ${id} not found`);

    Object.assign(driver, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'driver', id);
    return driver;
  }

  deleteDriver(id: number) {
    const index = this.db.drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`Driver ${id} not found`);

    this.db.drivers.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'driver', id);
  }

  getDriverStatus() {
    return ['active', 'inactive', 'on_leave', 'suspended'];
  }

  // ===== VEHICLES =====
  getVehicles(page = 1, limit = 10, search = ''): PaginatedResponse<Vehicle> {
    let filtered = [...this.db.vehicles];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(v =>
        v.plate.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, pages };
  }

  getVehicleById(id: number): Vehicle | null {
    return this.db.vehicles.find(v => v.id === id) || null;
  }

  createVehicle(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const vehicle: Vehicle = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.vehicles.push(vehicle);
    this.save();
    this.logActivity('CREATE', 'vehicle', vehicle.id);
    return vehicle;
  }

  updateVehicle(id: number, data: Partial<Vehicle>): Vehicle {
    const vehicle = this.db.vehicles.find(v => v.id === id);
    if (!vehicle) throw new Error(`Vehicle ${id} not found`);

    Object.assign(vehicle, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'vehicle', id);
    return vehicle;
  }

  deleteVehicle(id: number) {
    const index = this.db.vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    this.db.vehicles.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'vehicle', id);
  }

  getVehicleTypes() {
    return ['van', 'bus', 'minibus', 'special'];
  }

  getVehicleStatus() {
    return ['active', 'maintenance', 'inactive'];
  }

  // ===== STOPS =====
  getStops(): Stop[] {
    return JSON.parse(JSON.stringify(this.db.stops));
  }

  getStopById(id: number): Stop | null {
    return this.db.stops.find(s => s.id === id) || null;
  }

  createStop(data: Omit<Stop, 'id' | 'createdAt' | 'updatedAt'>): Stop {
    const stop: Stop = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.stops.push(stop);
    this.save();
    this.logActivity('CREATE', 'stop', stop.id);
    return stop;
  }

  updateStop(id: number, data: Partial<Stop>): Stop {
    const stop = this.db.stops.find(s => s.id === id);
    if (!stop) throw new Error(`Stop ${id} not found`);

    Object.assign(stop, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'stop', id);
    return stop;
  }

  deleteStop(id: number) {
    const index = this.db.stops.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Stop ${id} not found`);

    this.db.stops.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'stop', id);
  }

  searchStops(name: string): Stop[] {
    return this.db.stops.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  getStopsStats() {
    return {
      total: this.db.stops.length,
      stops: this.db.stops.map(s => ({
        id: s.id,
        name: s.name,
        passengerCount: this.db.passengers.length,
        routeCount: this.db.routes.filter(r => r.stops.includes(s.id)).length
      }))
    };
  }

  // ===== ROUTES =====
  getRoutes(page = 1, limit = 10, search = ''): PaginatedResponse<Route> {
    let filtered = [...this.db.routes];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        r.code.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, pages };
  }

  getRouteById(id: number): Route | null {
    return this.db.routes.find(r => r.id === id) || null;
  }

  getRouteByIdWithStops(id: number) {
    const route = this.db.routes.find(r => r.id === id);
    if (!route) throw new Error(`Route ${id} not found`);

    return {
      ...route,
      stopsData: route.stops.map(stopId => this.db.stops.find(s => s.id === stopId))
    };
  }

  createRoute(data: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Route {
    const route: Route = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.routes.push(route);
    this.save();
    this.logActivity('CREATE', 'route', route.id);
    return route;
  }

  updateRoute(id: number, data: Partial<Route>): Route {
    const route = this.db.routes.find(r => r.id === id);
    if (!route) throw new Error(`Route ${id} not found`);

    Object.assign(route, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'route', id);
    return route;
  }

  deleteRoute(id: number) {
    const index = this.db.routes.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Route ${id} not found`);

    this.db.routes.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'route', id);
  }

  getRouteStatus() {
    return ['active', 'inactive', 'planned'];
  }

  getRouteStops(routeId: number): Stop[] {
    const route = this.db.routes.find(r => r.id === routeId);
    if (!route) return [];
    return route.stops.map(stopId => this.db.stops.find(s => s.id === stopId)).filter(Boolean) as Stop[];
  }

  // ===== ASSIGNMENTS =====
  getAssignments(routeId: number): Assignment[] {
    return JSON.parse(JSON.stringify(
      this.db.assignments.filter(a => a.routeId === routeId)
    ));
  }

  createAssignment(routeId: number, data: Omit<Assignment, 'id' | 'routeId' | 'createdAt' | 'updatedAt'>): Assignment {
    const assignment: Assignment = {
      ...data,
      routeId,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.assignments.push(assignment);
    this.save();
    this.logActivity('CREATE', 'assignment', assignment.id);
    return assignment;
  }

  updateAssignment(routeId: number, assignmentId: number, data: Partial<Assignment>): Assignment {
    const assignment = this.db.assignments.find(a => a.id === assignmentId && a.routeId === routeId);
    if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

    Object.assign(assignment, data, { updatedAt: getTimestamp() });
    this.save();
    this.logActivity('UPDATE', 'assignment', assignmentId);
    return assignment;
  }

  deleteAssignment(routeId: number, assignmentId: number) {
    const index = this.db.assignments.findIndex(a => a.id === assignmentId && a.routeId === routeId);
    if (index === -1) throw new Error(`Assignment ${assignmentId} not found`);

    this.db.assignments.splice(index, 1);
    this.save();
    this.logActivity('DELETE', 'assignment', assignmentId);
  }

  // ===== NOTIFICATIONS =====
  getNotifications(): Notification[] {
    return JSON.parse(JSON.stringify(this.db.notifications));
  }

  createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Notification {
    const notification: Notification = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.notifications.push(notification);
    this.save();
    return notification;
  }

  updateNotification(id: number, data: Partial<Notification>): Notification {
    const notification = this.db.notifications.find(n => n.id === id);
    if (!notification) throw new Error(`Notification ${id} not found`);

    Object.assign(notification, data, { updatedAt: getTimestamp() });
    this.save();
    return notification;
  }

  deleteNotification(id: number) {
    const index = this.db.notifications.findIndex(n => n.id === id);
    if (index === -1) throw new Error(`Notification ${id} not found`);

    this.db.notifications.splice(index, 1);
    this.save();
  }

  getNotificationScopes() {
    return ['system', 'passenger', 'driver', 'vehicle', 'route'];
  }

  // ===== INVITES =====
  getInvites(): Invite[] {
    return JSON.parse(JSON.stringify(this.db.invites));
  }

  createInvite(data: Omit<Invite, 'id' | 'createdAt' | 'updatedAt'>): Invite {
    const invite: Invite = {
      ...data,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    this.db.invites.push(invite);
    this.save();
    return invite;
  }

  getInviteById(id: number): Invite | null {
    return this.db.invites.find(i => i.id === id) || null;
  }

  // ===== ACTIVITY LOG =====
  getRecentActivity(limit = 100) {
    return this.db.activityLog.slice(-limit).reverse();
  }

  private logActivity(action: string, entity: string, entityId: number) {
    this.db.activityLog.push({
      id: generateId(),
      action,
      entity,
      entityId,
      timestamp: getTimestamp()
    });

    // Manter apenas os últimos 1000 registros
    if (this.db.activityLog.length > 1000) {
      this.db.activityLog = this.db.activityLog.slice(-1000);
    }
  }

  // ===== REPORTS =====
  getStats() {
    return {
      passengers: this.db.passengers.length,
      drivers: this.db.drivers.length,
      vehicles: this.db.vehicles.length,
      stops: this.db.stops.length,
      routes: this.db.routes.length,
      activeRoutes: this.db.routes.filter(r => r.status === 'active').length,
      activeVehicles: this.db.vehicles.filter(v => v.status === 'active').length,
      activeDrivers: this.db.drivers.filter(d => d.status === 'active').length
    };
  }

  getCharts() {
    return {
      routeUsage: this.db.routes.map(r => ({
        name: r.name,
        passengers: this.db.passengers.length,
        stops: r.stops.length
      })),
      vehicleUtilization: this.db.vehicles.map(v => ({
        plate: v.plate,
        model: v.model,
        utilization: Math.floor(Math.random() * 100)
      }))
    };
  }

  getUtilization() {
    return {
      totalCapacity: this.db.vehicles.reduce((sum, v) => sum + v.capacity, 0),
      currentPassengers: this.db.passengers.length,
      utilizationRate: (this.db.passengers.length / this.db.vehicles.reduce((sum, v) => sum + v.capacity, 0) * 100).toFixed(2)
    };
  }
}

// Exporta instância única
export const db = new LocalStorageDB();

// Função para ativar/desativar modo demo
export function setDemoMode(enabled: boolean) {
  localStorage.setItem(DEMO_MODE_KEY, String(enabled));
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}
