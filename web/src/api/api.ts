import { findStateByLabel } from "@shared/brazilianStates";
import { db } from "./localStorage";

function getBearerToken() {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
}

// ===== MODO DEMO - Substituir requisições HTTP por localStorage =====
const USE_LOCALSTORAGE = true;
const isDevelopment = import.meta.env.DEV;

// Simula delay de rede para melhor UX
const simulateNetworkDelay = () => new Promise(r => setTimeout(r, 100));

const api = {
  _request: async (method: string, url: string, data: any = null, options: RequestInit = {}) => {
    if (!USE_LOCALSTORAGE) {
      // Fallback para HTTP (mantém compatibilidade)
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/enterprise';
      const token = getBearerToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };
      if (token) headers['Authorization'] = token;

      const config = { method, headers, ...options };
      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          const error = new Error(errorData.error || errorData.message || 'Ocorreu um erro na requisição') as Error & { status: number; data: any };
          error.status = response.status;
          error.data = errorData;
          throw error;
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      } catch (error) {
        if (isDevelopment) console.error("❌ Erro na requisição:", url, error);
        throw error;
      }
    }

    // ===== MODO DEMO ATIVO - Usar localStorage =====
    await simulateNetworkDelay(); // Simula latência de rede

    if (isDevelopment) {
      console.log(`📦 DEMO ${method} ${url}`, { data: data ? 'Dados enviados' : 'Sem dados' });
    }

    try {
      // Rotear requisições para as funções corretas do localStorage
      return api._handleLocalStorageRequest(method, url, data, options);
    } catch (error) {
      if (isDevelopment) console.error("❌ Erro no DEMO:", url, error);
      const err = error as Error & { status?: number; data?: any };
      if (!err.status) err.status = 500;
      throw err;
    }
  },

  _handleLocalStorageRequest: (method: string, url: string, data: any, options: RequestInit = {}) => {
    // Extract path without query parameters for matching
    const urlPath = url.split('?')[0];

    // ===== PASSENGERS =====
    if (urlPath.startsWith('/passengers')) {
      if (method === 'GET' && urlPath === '/passengers' && !url.includes('tipos') && !url.includes('rotas') && !url.includes('pontos') && !url.includes('search')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const search = params.get('search') || '';
        return db.getPassengers(page, limit, search);
      } else if (method === 'GET' && urlPath === '/passengers/tipos') {
        return db.getPassengerTypes();
      } else if (method === 'GET' && urlPath === '/passengers/rotas') {
        return db.getRoutesByPassenger();
      } else if (method === 'GET' && urlPath === '/passengers/pontos') {
        return db.getStopsByPassenger();
      } else if (method === 'GET' && urlPath.includes('/passengers/search')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const name = params.get('name') || '';
        return db.searchPassengers(name);
      } else if (method === 'GET' && urlPath.match(/\/passengers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const passenger = db.getPassengerById(id);
        if (!passenger) throw Object.assign(new Error('Passenger not found'), { status: 404 });
        return passenger;
      } else if (method === 'POST' && urlPath === '/passengers') {
        return db.createPassenger(data);
      } else if (method === 'PUT' && urlPath.match(/\/passengers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.updatePassenger(id, data);
      } else if (method === 'DELETE' && urlPath.match(/\/passengers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deletePassenger(id);
        return { success: true };
      }
    }

    // ===== DRIVERS =====
    if (urlPath.startsWith('/drivers')) {
      if (method === 'GET' && urlPath === '/drivers' && !url.includes('status')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const search = params.get('search') || '';
        return db.getDrivers(page, limit, search);
      } else if (method === 'GET' && urlPath === '/drivers/status') {
        return db.getDriverStatus();
      } else if (method === 'GET' && urlPath.match(/\/drivers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const driver = db.getDriverById(id);
        if (!driver) throw Object.assign(new Error('Driver not found'), { status: 404 });
        return driver;
      } else if (method === 'POST' && urlPath === '/drivers') {
        return db.createDriver(data);
      } else if (method === 'PUT' && urlPath.match(/\/drivers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.updateDriver(id, data);
      } else if (method === 'DELETE' && urlPath.match(/\/drivers\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deleteDriver(id);
        return { success: true };
      }
    }

    // ===== VEHICLES =====
    if (urlPath.startsWith('/vehicles')) {
      if (method === 'GET' && urlPath === '/vehicles' && !url.includes('status') && !url.includes('types')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const search = params.get('search') || '';
        return db.getVehicles(page, limit, search);
      } else if (method === 'GET' && urlPath === '/vehicles/types') {
        return db.getVehicleTypes();
      } else if (method === 'GET' && urlPath === '/vehicles/status') {
        return db.getVehicleStatus();
      } else if (method === 'GET' && urlPath.match(/\/vehicles\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const vehicle = db.getVehicleById(id);
        if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
        return vehicle;
      } else if (method === 'POST' && urlPath === '/vehicles') {
        return db.createVehicle(data);
      } else if (method === 'PUT' && urlPath.match(/\/vehicles\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.updateVehicle(id, data);
      } else if (method === 'DELETE' && urlPath.match(/\/vehicles\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deleteVehicle(id);
        return { success: true };
      }
    }

    // ===== STOPS =====
    if (urlPath.startsWith('/stops')) {
      if (method === 'GET' && urlPath === '/stops' && !url.includes('stats') && !url.includes('search')) {
        return db.getStops();
      } else if (method === 'GET' && urlPath === '/stops/stats') {
        return db.getStopsStats();
      } else if (method === 'GET' && urlPath.includes('/stops/search')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const name = params.get('name') || '';
        return db.searchStops(name);
      } else if (method === 'GET' && urlPath.match(/\/stops\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const stop = db.getStopById(id);
        if (!stop) throw Object.assign(new Error('Stop not found'), { status: 404 });
        return stop;
      } else if (method === 'POST' && urlPath === '/stops') {
        return db.createStop(data);
      } else if (method === 'PUT' && urlPath.match(/\/stops\/\d+$/) && !url.includes('status')) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.updateStop(id, data);
      } else if (method === 'DELETE' && urlPath.match(/\/stops\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deleteStop(id);
        return { success: true };
      } else if (method === 'PATCH' && url.includes('/stops/') && url.includes('/status')) {
        const id = parseInt(urlPath.split('/')[2]);
        return db.updateStop(id, { ativo: data.ativo });
      }
    }

    // ===== ROUTES =====
    if (urlPath.startsWith('/routes')) {
      if (method === 'GET' && urlPath === '/routes' && !url.includes('status') && !url.includes('stops') && !url.includes('assignments')) {
        const params = new URL(`http://dummy${url}`).searchParams;
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const search = params.get('search') || '';
        return db.getRoutes(page, limit, search);
      } else if (method === 'GET' && urlPath === '/routes/status') {
        return db.getRouteStatus();
      } else if (method === 'GET' && url.includes('includeStops=true')) {
        const id = parseInt(urlPath.split('/')[2]);
        return db.getRouteByIdWithStops(id);
      } else if (method === 'GET' && urlPath.match(/\/routes\/\d+\/stops$/)) {
        const id = parseInt(urlPath.split('/')[2]);
        return db.getRouteStops(id);
      } else if (method === 'GET' && urlPath.match(/\/routes\/stops\/\d+$/)) {
        const id = parseInt(urlPath.split('/')[3]);
        return db.getRouteStops(id);
      } else if (url.includes('/routes/') && url.includes('/assignments') && method === 'GET' && !urlPath.match(/\/assignments\/\d+$/)) {
        const routeId = parseInt(urlPath.split('/')[2]);
        return db.getAssignments(routeId);
      } else if (url.includes('/routes/') && url.includes('/assignments') && method === 'POST') {
        const routeId = parseInt(urlPath.split('/')[2]);
        return db.createAssignment(routeId, data);
      } else if (url.includes('/assignments/') && method === 'PUT') {
        const parts = urlPath.split('/');
        const routeId = parseInt(parts[2]);
        const assignmentId = parseInt(parts[4]);
        return db.updateAssignment(routeId, assignmentId, data);
      } else if (url.includes('/assignments/') && method === 'DELETE') {
        const parts = urlPath.split('/');
        const routeId = parseInt(parts[2]);
        const assignmentId = parseInt(parts[4]);
        db.deleteAssignment(routeId, assignmentId);
        return { success: true };
      } else if (method === 'GET' && urlPath.match(/\/routes\/\d+$/) && !url.includes('assignments')) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const route = db.getRouteById(id);
        if (!route) throw Object.assign(new Error('Route not found'), { status: 404 });
        return route;
      } else if (method === 'POST' && urlPath === '/routes') {
        return db.createRoute(data);
      } else if (method === 'POST' && urlPath === '/routes/new') {
        return db.createRoute(data);
      } else if (method === 'PUT' && urlPath.match(/\/routes\/\d+$/) && !url.includes('with-stops')) {
        const id = parseInt(urlPath.split('/')[2]);
        return db.updateRoute(id, data);
      } else if (method === 'PUT' && url.includes('/with-stops')) {
        const id = parseInt(urlPath.split('/')[2]);
        return db.updateRoute(id, data);
      } else if (method === 'DELETE' && urlPath.match(/\/routes\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deleteRoute(id);
        return { success: true };
      }
    }

    // ===== REPORTS =====
    if (urlPath === '/reports/stats' && method === 'GET') {
      return db.getStats();
    }
    if (urlPath === '/reports/charts' && method === 'GET') {
      return db.getCharts();
    }
    if (urlPath === '/reports/utilization' && method === 'GET') {
      return db.getUtilization();
    }
    if (urlPath === '/reports/points-only' && method === 'GET') {
      return db.getPointsOnly();
    }

    // ===== SEARCH =====
    if ((urlPath === '/search/autocomplete' || urlPath === '/autocomplete') && method === 'GET') {
      const params = new URL(`http://dummy${url}`).searchParams;
      const query = params.get('q') || params.get('search') || '';
      return db.searchAutocomplete(query);
    }

    // ===== NOTIFICATIONS =====
    if (urlPath.startsWith('/notifications')) {
      if (method === 'GET' && urlPath === '/notifications') {
        return db.getNotifications();
      } else if (method === 'GET' && urlPath === '/notifications/scopes') {
        return db.getNotificationScopes();
      } else if (method === 'GET' && urlPath.match(/\/notifications\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const notification = db.getNotifications().find(n => n.id === id);
        if (!notification) throw Object.assign(new Error('Notification not found'), { status: 404 });
        return notification;
      } else if (method === 'POST') {
        return db.createNotification(data);
      } else if (method === 'PUT') {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.updateNotification(id, data);
      } else if (method === 'DELETE') {
        const id = parseInt(urlPath.split('/').pop() || '0');
        db.deleteNotification(id);
        return { success: true };
      }
    }

    // ===== INVITES =====
    if (urlPath.startsWith('/invites')) {
      if (method === 'GET' && urlPath === '/invites') {
        return db.getInvites();
      } else if (method === 'GET' && urlPath.match(/\/invites\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        const invite = db.getInviteById(id);
        if (!invite) throw Object.assign(new Error('Invite not found'), { status: 404 });
        return invite;
      } else if (method === 'POST') {
        return db.createInvite(data);
      }
    }

    // ===== ACTIVITY LOG =====
    if (urlPath === '/lastChanges' && method === 'GET') {
      const params = new URL(`http://dummy${url}`).searchParams;
      const limit = parseInt(params.get('limit') || '100');
      return db.getRecentActivity(limit);
    }

    // ===== DATABASE OPERATIONS (DEMO) =====
    if (urlPath === '/database/export' && method === 'GET') {
      return db.export();
    }
    if (urlPath === '/database/import' && method === 'POST') {
      return db.import(data.data);
    }
    if (urlPath === '/database/sql' && method === 'POST') {
      return db.executeSql(data.sql);
    }
    if (urlPath === '/database/reset' && method === 'POST') {
      db.reset();
      return { success: true };
    }

    // ===== AUTH =====
    if (urlPath.startsWith('/auth')) {
      if (method === 'GET' && urlPath === '/auth/') {
        return { status: 'ok' };
      } else if (method === 'POST' && urlPath === '/auth/register') {
        return db.register(data.email, data.password, data.name);
      } else if (method === 'POST' && urlPath === '/auth/login') {
        return db.login(data.email, data.password);
      } else if (method === 'POST' && urlPath === '/auth/logout') {
        return db.logout();
      } else if (method === 'GET' && urlPath === '/auth/me') {
        const token = data.token || '';
        return db.getCurrentUser(token);
      } else if (method === 'POST' && urlPath === '/auth/change-password') {
        const token = data.token || '';
        return db.changePassword(token, data.oldPassword, data.newPassword);
      } else if (method === 'GET' && urlPath.match(/\/auth\/\d+$/)) {
        const id = parseInt(urlPath.split('/').pop() || '0');
        return db.getUserById(id);
      }
    }

    // ===== ENTERPRISE USERS =====
    if (urlPath.startsWith('/enterpriseUsers')) {
      if (method === 'GET' && urlPath.match(/\/enterpriseUsers\/\d+$/)) {
        // Mock response for enterprise users
        const id = parseInt(urlPath.split('/').pop() || '0');
        return {
          id: id,
          nome: 'Admin User',
          email: 'admin@bushere.com',
          role: 'admin'
        };
      }
    }
    if (urlPath === '/auth/login' && method === 'POST') {
      return db.login(data.email, data.password);
    }
    if (urlPath === '/auth/register' && method === 'POST') {
      return db.register(data);
    }
    if (urlPath === '/auth/me' && method === 'GET') {
      const headers = options.headers as Record<string, string> || {};
      const authHeader = headers['Authorization'] || '';
      const token = authHeader.replace('Bearer ', '');
      return db.getCurrentUser(token || '');
    }
    if (urlPath === '/auth/change-password' && method === 'POST') {
      return db.changePassword(data.email, data.oldPassword, data.newPassword);
    }
    if (urlPath === '/auth/logout' && method === 'POST') {
      return db.logout();
    }

    // Route não encontrada
    throw Object.assign(new Error(`Route not found: ${method} ${urlPath}`), { status: 404 });
  },

  get: (url, options?) => api._request('GET', url, null, options),
  post: (url, data?, options?) => api._request('POST', url, data, options),
  put: (url, data, options?) => api._request('PUT', url, data, options),
  patch: (url, data, options?) => api._request('PATCH', url, data, options),
  delete: (url, options?) => api._request('DELETE', url, null, options),

  // Funções específicas para passageiros
  passengers: {
    // Listar todos os passageiros (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search) queryParams.append('search', search);
      
      return api.get(`/passengers?${queryParams.toString()}`);
    },
    
    // Obter detalhes de um passageiro específico pelo ID
    getById: (id) => {
      return api.get(`/passengers/${id}`);
    },
    
    // Criar novo passageiro
    create: (passengerData) => {
      return api.post('/passengers', passengerData);
    },
    
    // Atualizar dados de um passageiro existente
    update: (id, edits) => {
      return api.put(`/passengers/${id}`, edits);
    },
    
    // Excluir passageiro
    delete: (id) => {
      return api.delete(`/passengers/${id}`);
    },

    // Buscar tipos de passageiro
    getTypes: () => {
      return api.get('/passengers/tipos');
    },

    // Buscar rotas disponíveis (retorna lista de rotas)
    getRoutes: () => {
      return api.get('/routes');
    },

    // Buscar pontos disponíveis
    getStops: () => {
      return api.get('/stops');
    },

    // Buscar dados de endereço por CEP
    getAddressByCep: async (cep) => {
      try {
        const cleanCep = cep.replace(/\D/g, ''); // Remove formatação
        if (cleanCep.length !== 8) {
          throw new Error('CEP deve ter 8 dígitos');
        }

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP');
        }

        const data = await response.json();
        
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }

        return {
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
          cep: data.cep || cleanCep
        };
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
      }
    }
  },

  // Funções específicas para motoristas
  drivers: {
    // Listar todos os motoristas (com suporte à paginação e busca)
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      if (search) queryParams.append('search', search);
      
      return api.get(`/drivers?${queryParams.toString()}`);
    },
    
    // Obter detalhes de um motorista específico pelo ID
    getById: (id) => {
      return api.get(`/drivers/${id}`);
    },
    
    // Criar novo motorista
    create: (driverData) => {
      return api.post('/drivers', driverData);
    },
    
    // Atualizar dados de um motorista existente
    update: (id, edits) => {
      return api.put(`/drivers/${id}`, edits);
    },
    
    // Excluir motorista
    delete: (id) => {
      return api.delete(`/drivers/${id}`);
    },

    // Buscar status de motorista
    getStatus: () => {
      return api.get('/drivers/status');
    }
  },

  routes: {
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        search: String(search) 
      });
      return api.get(`/routes?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/routes/${id}`),
    getByIdWithStops: (id) => api.get(`/routes/${id}?includeStops=true`),
    create: (routeData) => api.post('/routes', routeData),
    createWithStops: (routeData) => api.post('/routes/new', routeData),
    update: (id, edits) => api.put(`/routes/${id}`, edits),
    updateWithStops: (id, routeData) => api.put(`/routes/${id}/with-stops`, routeData),
    delete: (id) => api.delete(`/routes/${id}`),
    getStatus: () => api.get('/routes/status'),
    getStops: (id) => api.get(`/routes/stops/${id}`),
    
    // Endpoints para associações veículo-motorista-rota
    getAssignments: (routeId) => api.get(`/routes/${routeId}/assignments`),
    createAssignment: (routeId, assignmentData) => api.post(`/routes/${routeId}/assignments`, assignmentData),
    updateAssignment: (routeId, assignmentId, assignmentData) => api.put(`/routes/${routeId}/assignments/${assignmentId}`, assignmentData),
    deleteAssignment: (routeId, assignmentId) => api.delete(`/routes/${routeId}/assignments/${assignmentId}`)
  },

  vehicles: {
    list: (page = 1, limit = 10, search = '') => {
      const queryParams = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        search: String(search) 
      });
      return api.get(`/vehicles?${queryParams.toString()}`);
    },
    getById: (id) => api.get(`/vehicles/${id}`),
    create: (vehicleData) => api.post('/vehicles', vehicleData),
    update: (id, edits) => api.put(`/vehicles/${id}`, edits),
    delete: (id) => api.delete(`/vehicles/${id}`),
    getStatus: () => api.get('/vehicles/status'),
    getTypes: () => api.get('/vehicles/types'),
  },

  stops: {
    // Listar todos os pontos
    list: () => {
      return api.get('/stops');
    },

    // Obter estatísticas dos pontos (passageiros e rotas)
    getStats: () => {
      return api.get('/stops/stats');
    },

    // Obter detalhes de um ponto específico pelo ID
    getById: (id) => {
      return api.get(`/stops/${id}`);
    },

    // Criar novo ponto
    create: (stopData) => {
      return api.post('/stops', stopData);
    },

    // Atualizar dados de um ponto existente
    update: (id, edits) => {
      return api.put(`/stops/${id}`, edits);
    },

    // Excluir ponto
    delete: (id) => {
      return api.delete(`/stops/${id}`);
    },

    // Buscar pontos por nome
    search: (name) => {
      const queryParams = new URLSearchParams({ name });
      return api.get(`/stops/search?${queryParams.toString()}`);
    },
  },

  // Funções específicas para relatórios
  reports: {
    // Obter estatísticas gerais
    getStats: () => {
      return api.get('/reports/stats');
    },
    
    // Obter dados para gráficos
    getCharts: () => {
      return api.get('/reports/charts');
    },
    
    // Obter dados de utilização
    getUtilization: () => {
      return api.get('/reports/utilization');
    }
  },

  // Funções de geolocalização com o nominatim
  geolocation: {
    // Cache pra armazenar resultados do CEP
    _cepCache: new Map(),
    // Cache pra armazenar resultados da geolocalização
    _geoCache: new Map(),

    // Função pra gerar chave de cache do CEP
    _getCepCacheKey: (uf, city, road) => {
      return `${uf.toUpperCase()}-${city.toLowerCase()}-${road.toLowerCase()}`;
    },

    // Função pra gerar chave de cache da geolocalização
    _getGeoCacheKey: (lat, lon) => {
      // Arredonda as coordenadas pra 6 casas pea melhorar cache
      return `${parseFloat(lat).toFixed(6)}-${parseFloat(lon).toFixed(6)}`;
    },

    getCepFromStreet: async (uf, city, road) => {
      try {
        // Verifica se já existe no cache
        const cacheKey = api.geolocation._getCepCacheKey(uf, city, road);
        if (api.geolocation._cepCache.has(cacheKey)) {
          return api.geolocation._cepCache.get(cacheKey);
        }

        // Se não estiver no cache faz a requisição
        const data = await fetch(
          `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(city)}/${encodeURIComponent(road)}/json/`,
          { 
            headers: { 'Accept': 'application/json' },
            cache: 'force-cache' // Usa cache do navegador se der 
          }
        );

        if (!data.ok) {
          throw new Error(`Erro ao obter CEP: ${data.statusText}`);
        }

        const json = await data.json();
        if (!Array.isArray(json) || json.length === 0) {
          const emptyCep = '';
          api.geolocation._cepCache.set(cacheKey, emptyCep);
          return emptyCep;
        }

        const cep = json[0].cep || '';
        // Armazena no cache
        api.geolocation._cepCache.set(cacheKey, cep);
        return cep;
      } catch (error) {
        console.error("Erro na requisição de CEP:", error);
        throw error;
      }
    },

    getInfoFromCoordinates: async (lat, lon) => {
      try {
        // Verifica se já existe no cache
        const cacheKey = api.geolocation._getGeoCacheKey(lat, lon);
        if (api.geolocation._geoCache.has(cacheKey)) {
          return api.geolocation._geoCache.get(cacheKey);
        }

        const queryParams = new URLSearchParams({
          format: String("json"),
          lat: String(parseFloat(lat).toFixed(6)),
          lon: String(parseFloat(lon).toFixed(6)),
          addressdetails: String(1),
          extratags: String(1),
          limit: String(1)
        });

        // Adiciona um tempo de 5 segundos para a requisição
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${queryParams.toString()}`,
          {
            headers: {
              'Accept-Language': 'pt-BR',
              'Accept': 'application/json'
            },
            signal: controller.signal,
            cache: 'force-cache' // Usa cache do navegador se for possível
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erro ao obter informações de geolocalização: ${response.statusText}`);
        }

        const data = await response.json();
        const state = findStateByLabel(data.address.state || data.address.region || '');
        if (!state) {
          throw new Error(`Estado não encontrado: ${data.address.state || data.address.region}`);
        }

        const result = {
          road: data.address.road || '',
          suburb: data.address.suburb || '',
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          uf: state.value,
          cep: '',
          coordinates: {
            latitude: parseFloat(lat).toFixed(6),
            longitude: parseFloat(lon).toFixed(6)
          },
          data: data,
        };

        // Busca o CEP apenas se tivermos todas as informações precisas
        if (result.uf && result.city && result.road) {
          try {
            result.cep = await api.geolocation.getCepFromStreet(result.uf, result.city, result.road);
          } catch (error) {
            console.warn("Erro ao buscar CEP:", error);
            result.cep = '';
          }
        }

        // Armazena no cache
        api.geolocation._geoCache.set(cacheKey, result);
        return result;

      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Tempo limite excedido ao buscar informações de geolocalização');
        }
        console.error("Erro na requisição de geolocalização:", error);
        throw error;
      }
    },

    // Método para limpar o cache se necessário
    clearCache: () => {
      api.geolocation._cepCache.clear();
      api.geolocation._geoCache.clear();
    }
  },

  auth: {
    me: async () => {
      const token = getBearerToken();
      if (!token) {
        throw new Error('Usuário não autenticado. Token ausente.');
      }

      try {
        const response = await api.get('/auth/me', {headers: { 'Authorization': token }});
        return response; // Retorna os dados do usuário autenticado
      } catch (error) {
        console.error("Erro ao obter informações do usuário:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    login: async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Armazena o token no localStorage
          return response; // Retorna os dados do usuário logado
        } else {
          throw new Error('Login falhou: resposta inválida do servidor');
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    logout: async (): Promise<void> => {
      try {
        await api.post('/auth/logout'); // Chama a API para logout
        localStorage.removeItem('token'); // Remove o token do localStorage
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      try {
        const response = await api.post('/auth/change-password', 
          {
            old_password: currentPassword,
            new_password: newPassword
          })
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },

    register: async (userData) => {
      const requiredFields = ['nome', 'email', 'password'];

      // Verifica se todos os campos obrigatórios estão presentes
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }

      try {
        const response = await api.post('/auth/register', userData);
        return response; // Retorna a resposta da API
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    }
  },
  recentActivity: {
    // Método para obter a atividade recente
    get: async (limit = 100) => {
      const queryParams = new URLSearchParams({
        limit: String(limit)
      });
      try {
        const response = await api.get(`/lastChanges?${queryParams.toString()}`);
        return response; // Retorna os dados da atividade recente
      } catch (error) {
        console.error("Erro ao obter atividade recente:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    }
  },

  enterpriseUsers: {
    // Método para listar usuários de uma empresa
    get: async (enterpriseUserId: number) => {
      if (!enterpriseUserId) {
        throw new Error('ID do usuario-empresa é obrigatório para listar usuários');
      }
      try {
        const response = await api.get(`/enterpriseUsers/${enterpriseUserId}`);
        return response; // Retorna os dados dos usuários da empresa
      } catch (error) {
        console.error("Erro ao obter usuários da empresa:", error);
        throw error; // Propaga o erro para ser tratado onde for chamado
      }
    },
  },

  notifications: {

    // Lista todos os avisos
    list: async () => {
      try {
        const response = await api.get('/notifications');
        return response;
      } catch (error) {
        console.error("Erro ao listar avisos:", error);
        throw error;
      }
    },

    create: async (notificationData) => {
      try {
        const response = await api.post('/notifications', notificationData);
        return response;
      } catch (error) {
        console.error("Erro ao criar aviso:", error);
        throw error;
      }
    },

    update: async (id, notificationData) => {
      try {
        const response = await api.put(`/notifications/${id}`, notificationData);
        return response;
      } catch (error) {
        console.error("Erro ao atualizar aviso:", error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await api.delete(`/notifications/${id}`);
        return response;
      } catch (error) {
        console.error("Erro ao excluir aviso:", error);
        throw error;
      }
    },

    getScopes: async () => {
      try {
        const response = await api.get('/notifications/scopes');
        return response;
      } catch (error) {
        console.error("Erro ao buscar escopos de aviso:", error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const response = await api.get(`/notifications/${id}`);
        return response;
      } catch (error) {
        console.error("Erro ao buscar aviso por ID:", error);
        throw error;
      }
    }
  },

  invites: {
    list: async () => {
      try {
        const response = await api.get('/invites');
        return response;
      } catch (error) {
        console.error("Erro ao listar convites:", error);
        throw error;
      }
    },

    create: async (inviteData) => {
      try {
        const response = await api.post('/invites', inviteData);
        return response;
      } catch (error) {
        console.error("Erro ao criar convite:", error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const response = await api.get(`/invites/${id}`);
        return response;
      } catch (error) {
        console.error("Erro ao buscar convite por ID:", error);
        throw error;
      }
    }
  },
};

export default api;