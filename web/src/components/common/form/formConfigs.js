// Configurações para o componente GenericForm
import api from '../../../api/api';
import { validateCPF, validateEmail, validatePhoneNumber, validateCEP, validateDate } from '@shared/validators';
import { formatCPF, formatPhoneNumber, formatCEP, formatDate, formatDateFromDatabase, formatPlate } from '@shared/formatters';
import { reverseTransformDate, validateBirthDate, validateAdmissionDate, validateCNHValidity, validateLastMaintenanceDate, validateNextMaintenanceDate } from '@shared/dateUtils';
import { createFakeBusData, createFakeRouteData, createFakeStopData, createFakeDriverData, createFakeVehicleData } from '../../../utils/fakers';
import { BRAZILIAN_STATES, isValidUF } from '@shared/brazilianStates';
import { formatters } from '../detail/detailConfigs';

export const passengerFormConfig = {
  fields: [
    // {
    //   name: 'nome',
    //   type: 'text',
    //   label: 'Nome',
    //   labelIcon: 'bi bi-person-fill',
    //   inputIcon: 'bi bi-person',
    //   placeholder: 'Nome completo',
    //   maxLength: 255,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     return !value.trim() ? 'Nome é obrigatório' : null;
    //   }
    // },
    // {
    //   name: 'email',
    //   type: 'email',
    //   label: 'E-mail',
    //   labelIcon: 'bi bi-envelope-fill',
    //   inputIcon: 'bi bi-envelope',
    //   placeholder: 'email@exemplo.com',
    //   maxLength: 255,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     if (!value.trim()) return 'E-mail é obrigatório';
    //     if (!validateEmail(value)) return 'E-mail inválido';
    //     return null;
    //   }
    // },
    // {
    //   name: 'cpf',
    //   type: 'text',
    //   label: 'CPF',
    //   labelIcon: 'bi bi-card-text',
    //   inputIcon: 'bi bi-123',
    //   placeholder: '000.000.000-00',
    //   maxLength: 14,
    //   required: true,
    //   size: 'lg',
    //   formatter: (value) => formatCPF((value || '').toString()),
    //   additionalProps: { 
    //     autoComplete: 'new-password',
    //     'data-form-type': 'other',
    //     'data-lpignore': 'true',
    //     'data-1p-ignore': 'true'
    //   },
    //   validator: (value) => {
    //     if (!value.trim()) return 'CPF é obrigatório';
    //     if (!validateCPF(value)) return 'CPF inválido';
    //     return null;
    //   }
    // },
    // {
    //   name: 'telefone',
    //   type: 'tel',
    //   label: 'Telefone',
    //   labelIcon: 'bi bi-telephone-fill',
    //   inputIcon: 'bi bi-telephone',
    //   placeholder: '(00) 00000-0000',
    //   maxLength: 15,
    //   size: 'lg',
    //   formatter: (value) => formatPhoneNumber((value || '').toString()),
    //   validator: (value) => {
    //     if (value && !validatePhoneNumber(value)) return 'Formato: (00) 00000-0000';
    //     return null;
    //   }
    // },
    // {
    //   name: 'data_nascimento',
    //   type: 'date',
    //   label: 'Data de Nascimento',
    //   labelIcon: 'bi bi-calendar-plus-fill',
    //   inputIcon: 'bi bi-calendar-plus',
    //   placeholder: 'Data de nascimento',
    //   size: 'lg',
    //   additionalProps: { 
    //     max: new Date().toISOString().split('T')[0],
    //     autoComplete: 'new-password',
    //     'data-form-type': 'other',
    //     'data-lpignore': 'true',
    //     'data-1p-ignore': 'true'
    //   },
    //   reverseTransform: reverseTransformDate,
    //   validator: validateBirthDate
    // },
    // {
    //   name: 'pcd',
    //   type: 'checkbox',
    //   label: 'Pessoa com Deficiência (PCD)',
    //   labelIcon: 'bi bi-universal-access',
    //   inputIcon: 'bi bi-universal-access',
    //   size: 'lg',
    //   className: 'pcd-checkbox',
    //   additionalProps: { 
    //     'data-form-type': 'other'
    //   }
    // },
    {
      name: 'tipo_passageiro',
      alternativeKey: 'tipo_passageiro_id',
      type: 'select',
      label: 'Tipo de Passageiro',
      labelIcon: 'bi bi-person-badge-fill',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o tipo de passageiro',
      required: true,
      size: 'lg',
      loadOptions: () => api.passengers.getTypes(),
      defaultOptions: [
        { tipo_passageiro_id: 1, nome: 'Estudante', descricao: 'Passageiro estudante' },
        { tipo_passageiro_id: 2, nome: 'Corporativo', descricao: 'Passageiro corporativo' }
      ],
      optionValue: 'tipo_passageiro_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Tipo de passageiro é obrigatório';
        return null;
      }
    },
    // Seção de Endereço - CEP primeiro para preenchimento automático
    // {
    //   name: 'cep',
    //   type: 'text',
    //   label: 'CEP',
    //   labelIcon: 'bi bi-mailbox',
    //   inputIcon: 'bi bi-envelope',
    //   placeholder: '00000-000',
    //   maxLength: 9,
    //   required: true,
    //   size: 'lg',
    //   formatter: (value) => formatCEP((value || '').toString()),
    //   validator: (value) => {
    //     if (!value.trim()) return 'CEP é obrigatório';
    //     if (!validateCEP(value)) return 'CEP deve ter o formato 00000-000';
    //     return null;
    //   },
    //   onBlur: 'handleCepBlur', // Evento para buscar dados do CEP
    //   helpText: 'Digite o CEP para preenchimento automático do endereço'
    // },
    // {
    //   name: 'logradouro',
    //   type: 'text',
    //   label: 'Logradouro',
    //   labelIcon: 'bi bi-house-fill',
    //   inputIcon: 'bi bi-geo',
    //   placeholder: 'Nome da rua/avenida',
    //   maxLength: 255,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     if (!value.trim()) return 'Logradouro é obrigatório';
    //     return null;
    //   }
    // },
    // {
    //   name: 'numero_endereco',
    //   type: 'text',
    //   label: 'Número',
    //   labelIcon: 'bi bi-123',
    //   inputIcon: 'bi bi-hash',
    //   placeholder: 'Número do endereço',
    //   maxLength: 20,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     if (!value.trim()) return 'Número é obrigatório';
    //     return null;
    //   }
    // },
    // {
    //   name: 'complemento_endereco',
    //   type: 'text',
    //   label: 'Complemento',
    //   labelIcon: 'bi bi-house-door',
    //   inputIcon: 'bi bi-plus-circle',
    //   placeholder: 'Apartamento, bloco, etc.',
    //   maxLength: 100,
    //   size: 'lg'
    // },
    // {
    //   name: 'bairro',
    //   type: 'text',
    //   label: 'Bairro',
    //   labelIcon: 'bi bi-building',
    //   inputIcon: 'bi bi-buildings',
    //   placeholder: 'Nome do bairro',
    //   maxLength: 100,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     if (!value.trim()) return 'Bairro é obrigatório';
    //     return null;
    //   }
    // },
    // {
    //   name: 'cidade',
    //   type: 'text',
    //   label: 'Cidade',
    //   labelIcon: 'bi bi-geo-alt',
    //   inputIcon: 'bi bi-building',
    //   placeholder: 'Nome da cidade',
    //   maxLength: 100,
    //   required: true,
    //   size: 'lg',
    //   validator: (value) => {
    //     if (!value.trim()) return 'Cidade é obrigatória';
    //     return null;
    //   }
    // },
    // {
    //   name: 'uf',
    //   type: 'select',
    //   label: 'UF',
    //   labelIcon: 'bi bi-flag',
    //   inputIcon: 'bi bi-flag',
    //   placeholder: 'Selecione o estado',
    //   required: true,
    //   size: 'lg',
    //   defaultOptions: BRAZILIAN_STATES,
    //   optionValue: 'value',
    //   optionLabel: 'label',
    //   validator: (value) => {
    //     if (!value) return 'Estado é obrigatório';
    //     if (!isValidUF(value)) return 'Estado inválido';
    //     return null;
    //   }
    // },
    // Relacionamentos
    {
      name: 'rota_id',
      type: 'select',
      label: 'Rota',
      labelIcon: 'bi bi-signpost-split-fill',
      inputIcon: 'bi bi-signpost-split',
      placeholder: 'Selecione uma rota (opcional)',
      size: 'lg',
      loadOptions: () => api.passengers.getRoutes(),
      defaultOptions: [],
      optionValue: 'rota_id',
      optionLabel: (option) => `${option.nome} (${option.codigo_rota})`,
      validator: (value) => {
        return null; // Opcional
      }
    },
    {
      name: 'ponto_id',
      type: 'select',
      label: 'Ponto de Embarque',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-pin-map',
      placeholder: 'Selecione uma rota primeiro',
      size: 'lg',
      dependsOn: 'rota_id',
      loadOptions: (rotaId) => api.routes.getStops(rotaId),
      defaultOptions: [],
      optionValue: 'ponto_id',
      optionLabel: (option) => `${option.nome} - ${option.cidade}/${option.uf}`,
      validator: (value) => {
        return null; // Opcional
      }
    }
  ],
  steps: [
    {
      title: 'Informações Básicas',
      icon: 'bi bi-person-lines-fill',
      fields: [
        'nome',
        'email', 
        'cpf',
        'telefone',
        'data_nascimento',
        'pcd',
        'tipo_passageiro'
      ]
    },
    {
      title: 'Endereço e Localização',
      icon: 'bi bi-geo-alt-fill',
      fields: [
        'cep',
        'logradouro',
        'numero_endereco',
        'complemento_endereco',
        'bairro',
        'cidade',
        'uf',
        'rota_id',
        'ponto_id'
      ]
    }
  ]
};

// Configuração específica para edição de passageiros - apenas campos editáveis
export const passengerEditFormConfig = {
  fields: [
    {
      name: 'tipo_passageiro',
      alternativeKey: 'tipo_passageiro_id',
      type: 'select',
      label: 'Tipo de Passageiro',
      labelIcon: 'bi bi-person-badge-fill',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o tipo de passageiro',
      required: true,
      size: 'lg',
      loadOptions: () => api.passengers.getTypes(),
      defaultOptions: [
        { tipo_passageiro_id: 1, nome: 'Estudante', descricao: 'Passageiro estudante' },
        { tipo_passageiro_id: 2, nome: 'Corporativo', descricao: 'Passageiro corporativo' }
      ],
      optionValue: 'tipo_passageiro_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Tipo de passageiro é obrigatório';
        return null;
      }
    },
    {
      name: 'rota_id',
      type: 'select',
      label: 'Rota',
      labelIcon: 'bi bi-signpost-split-fill',
      inputIcon: 'bi bi-signpost-split',
      placeholder: 'Selecione uma rota (opcional)',
      size: 'lg',
      loadOptions: () => api.passengers.getRoutes(),
      defaultOptions: [],
      optionValue: 'rota_id',
      optionLabel: (option) => `${option.nome} (${option.codigo_rota})`,
      validator: (value) => {
        return null; // Opcional
      }
    },
    {
      name: 'ponto_id',
      type: 'select',
      label: 'Ponto de Embarque',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-pin-map',
      placeholder: 'Selecione uma rota primeiro',
      size: 'lg',
      dependsOn: 'rota_id',
      loadOptions: (rotaId) => api.routes.getStops(rotaId),
      defaultOptions: [],
      optionValue: 'ponto_id',
      optionLabel: (option) => `${option.nome} - ${option.cidade}/${option.uf}`,
      validator: (value) => {
        return null; // Opcional
      }
    }
  ],
  steps: [
    {
      title: 'Editar Informações do Passageiro',
      icon: 'bi bi-pencil-square',
      fields: [
        'tipo_passageiro',
        'rota_id',
        'ponto_id'
      ]
    }
  ]
};

export const routeFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome da Rota',
      labelIcon: 'bi bi-signpost-split-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome identificador da rota',
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome da rota é obrigatório' : null;
      }
    },
    {
      name: 'codigo_rota',
      type: 'text',
      label: 'Código da Rota',
      labelIcon: 'bi bi-upc',
      inputIcon: 'bi bi-hash',
      placeholder: 'Código único da rota',
      required: true,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return 'Código da rota é obrigatório';
        if (value.length < 3) return 'Código deve ter pelo menos 3 caracteres';
        return null;
      }
    },
    {
      name: 'origem_descricao',
      type: 'text',
      label: 'Origem',
      labelIcon: 'bi bi-geo-alt',
      inputIcon: 'bi bi-pin-map',
      placeholder: 'Descrição do ponto de origem',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 5 ? 'Descrição da origem deve ter pelo menos 5 caracteres' : null;
      }
    },
    {
      name: 'destino_descricao',
      type: 'text',
      label: 'Destino',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-pin-map-fill',
      placeholder: 'Descrição do ponto de destino',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 5 ? 'Descrição do destino deve ter pelo menos 5 caracteres' : null;
      }
    },
    {
      name: 'distancia_km',
      type: 'number',
      label: 'Distância (km)',
      labelIcon: 'bi bi-rulers',
      inputIcon: 'bi bi-speedometer',
      placeholder: 'Distância em quilômetros',
      additionalProps: { step: '0.1', min: '0', max: '999.9' },
      size: 'lg',
      validator: (value) => {
        if (value === '') return null;
        const distancia = parseFloat(value);
        if (isNaN(distancia)) return 'Distância deve ser um número';
        if (distancia <= 0) return 'Distância deve ser maior que zero';
        if (distancia > 1000) return 'Distância deve ser menor que 1000 km';
        return null;
      }
    },
    {
      name: 'tempo_viagem_estimado_minutos',
      type: 'number',
      label: 'Tempo de Viagem (min)',
      labelIcon: 'bi bi-clock',
      inputIcon: 'bi bi-stopwatch',
      placeholder: 'Tempo estimado em minutos',
      additionalProps: { min: '0', max: '1440' },
      size: 'lg',
      validator: (value) => {
        if (value === '') return null;
        const tempo = parseInt(value);
        if (isNaN(tempo)) return 'Tempo deve ser um número inteiro';
        if (tempo <= 0) return 'Tempo deve ser maior que zero';
        if (tempo > 1440) return 'Tempo deve ser menor que 24 horas (1440 min)';
        return null;
      }
    },
    {
      name: 'status_rota_id',
      type: 'select',
      label: 'Status da Rota',
      labelIcon: 'bi bi-check2-circle',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione o status',
      required: true,
      size: 'lg',
      loadOptions: () => api.routes.getStatus(),
      defaultOptions: [
        { status_rota_id: 1, nome: 'Ativa', descricao: 'Rota ativa e em funcionamento' },
        { status_rota_id: 2, nome: 'Inativa', descricao: 'Rota temporariamente inativa' },
        { status_rota_id: 3, nome: 'Em Planejamento', descricao: 'Rota em fase de planejamento' }
      ],
      optionValue: 'status_rota_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Status da rota é obrigatório';
        return null;
      }
    },
    {
      name: 'veiculo_id',
      type: 'select',
      label: 'Veículo',
      labelIcon: 'bi bi-bus-front',
      inputIcon: 'bi bi-car-front',
      placeholder: 'Selecione o veículo',
      required: false,
      size: 'lg',
      loadOptions: () => api.vehicles.list(1, 100).then(response => {
        const allVehicles = response.data || [];
        // Filtrar apenas veículos ativos e em operação
        return allVehicles.filter(vehicle => 
          (vehicle.ativo === true || vehicle.ativo === 1) && // ativo = true
          (vehicle.status_nome === 'Em Operação') // status = "Em Operação"
        );
      }),
      defaultOptions: [],
      optionValue: 'veiculo_id',
      optionLabel: (option) => `${option.nome} - ${option.placa} (${option.marca} ${option.modelo})`,
      validator: (value) => {
        // Veículo é opcional durante a criação da rota
        return null;
      }
    },
    {
      name: 'motorista_id',
      type: 'select',
      label: 'Motorista',
      labelIcon: 'bi bi-person-badge',
      inputIcon: 'bi bi-person-check',
      placeholder: 'Selecione o motorista',
      required: false,
      size: 'lg',
      loadOptions: () => api.drivers.list(1, 100).then(response => {
        const allDrivers = response.data || [];
        // Filtrar apenas motoristas ativos e com status "Ativo"
        return allDrivers.filter(driver => 
          (driver.ativo === true || driver.ativo === 1) && // ativo = true
          (driver.status_nome === 'Ativo') // status = "Ativo"
        );
      }),
      defaultOptions: [],
      optionValue: 'motorista_id',
      optionLabel: (option) => `${option.nome} - CNH: ${option.cnh_numero}`,
      validator: (value, formData) => {
        // Se um veículo foi selecionado, o motorista também deve ser selecionado
        if (formData && formData.veiculo_id && !value) {
          return 'Motorista é obrigatório quando um veículo é selecionado';
        }
        return null;
      }
    },
    {
      name: 'observacoes_assignment',
      type: 'textarea',
      label: 'Observações da Associação',
      labelIcon: 'bi bi-chat-text',
      inputIcon: 'bi bi-pencil-square',
      placeholder: 'Observações sobre a associação do veículo e motorista com esta rota',
      required: false,
      size: 'lg',
      rows: 3,
      validator: (value) => {
        if (value && value.length > 500) {
          return 'Observações devem ter no máximo 500 caracteres';
        }
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeRouteData
};

export const stopFormConfig = {
  fields: [
    {
      name: 'latitude',
      type: 'hidden'
    },
    {
      name: 'longitude',
      type: 'hidden'
    },
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      labelIcon: 'bi bi-geo-alt-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome da parada',
      maxLength: 255,
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome é obrigatório' : null;
      }
    },
    {
      name: 'logradouro',
      type: 'text',
      label: 'Logradouro',
      labelIcon: 'bi bi-house-fill',
      inputIcon: 'bi bi-geo',
      placeholder: 'Nome da rua/avenida',
      maxLength: 255,
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Logradouro deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'numero_endereco',
      type: 'number',
      label: 'Número do Endereço',
      labelIcon: 'bi bi-123',
      inputIcon: 'bi bi-hash',
      placeholder: 'Número do endereço',
      maxLength: 10,
      size: 'lg'
    },
    {
      name: 'bairro',
      type: 'text',
      label: 'Bairro',
      labelIcon: 'bi bi-building',
      inputIcon: 'bi bi-buildings',
      placeholder: 'Nome do bairro',
      maxLength: 100,
      size: 'lg'
    },
    {
      name: 'cidade',
      type: 'text',
      label: 'Cidade',
      labelIcon: 'bi bi-geo-alt',
      inputIcon: 'bi bi-building',
      placeholder: 'Nome da cidade',
      maxLength: 100,
      size: 'lg'
    },
    {
      name: 'uf',
      type: 'select',
      label: 'UF',
      labelIcon: 'bi bi-flag',
      inputIcon: 'bi bi-flag',
      placeholder: 'Selecione o estado',
      size: 'lg',
      defaultOptions: BRAZILIAN_STATES,
      optionValue: 'value',
      optionLabel: 'label',
      validator: (value) => {
        if (value && !isValidUF(value)) {
          return 'Estado inválido';
        }
        return null;
      }
    },
    {
      name: 'cep',
      type: 'text',
      label: 'CEP',
      labelIcon: 'bi bi-mailbox',
      inputIcon: 'bi bi-envelope',
      placeholder: '00000-000',
      maxLength: 9,
      size: 'lg',
      formatter: (value) => formatCEP((value || '').toString()),
      validator: (value) => {
        if (!value.trim()) return null;
        if (!validateCEP(value)) return 'CEP deve ter o formato 00000-000 e conter apenas números e hífen';
        return null;
      }
    },
    {
      name: 'referencia',
      type: 'text',
      label: 'Referência',
      labelIcon: 'bi bi-bookmark',
      inputIcon: 'bi bi-bookmark',
      placeholder: 'Ponto de referência',
      maxLength: 255,      
      size: 'lg'
    }
  ],
  fakeDataGenerator: createFakeStopData
};

export const driverFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      labelIcon: 'bi bi-person-fill',
      inputIcon: 'bi bi-person',
      placeholder: 'Nome completo do motorista',
      maxLength: 255,
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome é obrigatório' : null;
      }
    },
    {
      name: 'cpf',
      type: 'text',
      label: 'CPF',
      labelIcon: 'bi bi-card-text',
      inputIcon: 'bi bi-123',
      placeholder: '000.000.000-00',
      maxLength: 14,
      required: true,
      size: 'lg',
      formatter: (value) => formatCPF((value || '').toString()),
      additionalProps: { 
        autoComplete: 'new-password',
        'data-form-type': 'other',
        'data-lpignore': 'true',
        'data-1p-ignore': 'true'
      },
      validator: (value) => {
        if (!value.trim()) return 'CPF é obrigatório';
        if (!validateCPF(value)) return 'CPF inválido';
        return null;
      }
    },
    {
      name: 'cnh_numero',
      type: 'text',
      label: 'Número da CNH',
      labelIcon: 'bi bi-person-vcard',
      inputIcon: 'bi bi-123',
      placeholder: 'Número da CNH',
      maxLength: 11,
      required: true,
      size: 'lg',
      additionalProps: { 
        autoComplete: 'new-password',
        'data-form-type': 'other',
        'data-lpignore': 'true',
        'data-1p-ignore': 'true'
      },
      validator: (value) => {
        if (!value.trim()) return 'Número da CNH é obrigatório';
        if (value.length < 10) return 'Número da CNH deve ter pelo menos 10 dígitos';
        return null;
      }
    },
    {
      name: 'cnh_categoria',
      type: 'select',
      label: 'Categoria da CNH',
      labelIcon: 'bi bi-award-fill',
      inputIcon: 'bi bi-award',
      placeholder: 'Selecione a categoria',
      required: true,
      size: 'lg',
      defaultOptions: [
        { value: 'A', label: 'A - Motocicleta' },
        { value: 'B', label: 'B - Automóvel' },
        { value: 'C', label: 'C - Veículo de carga' },
        { value: 'D', label: 'D - Ônibus e similares' },
        { value: 'E', label: 'E - Combinação de veículos' },
        { value: 'AB', label: 'AB - A + B' },
        { value: 'AC', label: 'AC - A + C' },
        { value: 'AD', label: 'AD - A + D' },
        { value: 'AE', label: 'AE - A + E' }
      ],
      optionValue: 'value',
      optionLabel: 'label',
      validator: (value) => {
        if (!value) return 'Categoria da CNH é obrigatória';
        return null;
      }
    },
    {
      name: 'cnh_validade',
      type: 'date',
      label: 'Validade da CNH',
      labelIcon: 'bi bi-calendar-fill',
      inputIcon: 'bi bi-calendar',
      placeholder: 'Data de validade da CNH',
      required: true,
      size: 'lg',
      additionalProps: { 
        min: new Date().toISOString().split('T')[0],
        autoComplete: 'new-password',
        'data-form-type': 'other',
        'data-lpignore': 'true',
        'data-1p-ignore': 'true'
      },
      reverseTransform: reverseTransformDate,
      validator: validateCNHValidity
    },
    {
      name: 'telefone',
      type: 'tel',
      label: 'Telefone',
      labelIcon: 'bi bi-telephone-fill',
      inputIcon: 'bi bi-telephone',
      placeholder: '(00) 00000-0000',
      maxLength: 15,
      size: 'lg',
      formatter: (value) => formatPhoneNumber((value || '').toString()),
      validator: (value) => {
        if (value && !validatePhoneNumber(value)) return 'Formato: (00) 00000-0000';
        return null;
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      labelIcon: 'bi bi-envelope-fill',
      inputIcon: 'bi bi-envelope',
      placeholder: 'email@exemplo.com',
      maxLength: 255,
      size: 'lg',
      validator: (value) => {
        if (value && !validateEmail(value)) return 'E-mail inválido';
        return null;
      }
    },
    {
      name: 'data_admissao',
      type: 'date',
      label: 'Data de Admissão',
      labelIcon: 'bi bi-calendar-plus-fill',
      inputIcon: 'bi bi-calendar-plus',
      placeholder: 'Data de admissão',
      size: 'lg',
      additionalProps: { 
        max: new Date().toISOString().split('T')[0],
        autoComplete: 'new-password',
        'data-form-type': 'other',
        'data-lpignore': 'true',
        'data-1p-ignore': 'true'
      },
      reverseTransform: reverseTransformDate,
      validator: validateAdmissionDate
    },
    {
      name: 'status_motorista_id',
      alternativeKey: 'status_motorista_id',
      type: 'select',
      label: 'Status',
      labelIcon: 'bi bi-flag-fill',
      inputIcon: 'bi bi-flag',
      placeholder: 'Selecione o status',
      required: true,
      size: 'lg',
      loadOptions: () => api.drivers.getStatus(),
      defaultOptions: [
        { status_motorista_id: 1, nome: 'Ativo', descricao: 'Motorista em operação normal' },
        { status_motorista_id: 2, nome: 'Férias', descricao: 'Motorista de férias' },
        { status_motorista_id: 3, nome: 'Afastado', descricao: 'Motorista afastado' },
        { status_motorista_id: 4, nome: 'Inativo', descricao: 'Motorista inativo' }
      ],
      optionValue: 'status_motorista_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Status é obrigatório';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeDriverData
};

export const vehicleFormConfig = {
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome do Veículo',
      labelIcon: 'bi bi-car-front-fill',
      inputIcon: 'bi bi-info-circle',
      placeholder: 'Nome identificador do veículo',
      required: true,
      size: 'lg',
      validator: (value) => {
        return !value.trim() ? 'Nome do veículo é obrigatório' : null;
      }
    },
    {
      name: 'placa',
      type: 'text',
      label: 'Placa',
      labelIcon: 'bi bi-card-text',
      inputIcon: 'bi bi-signpost',
      placeholder: 'ABC-1234 ou ABC1D23',
      maxLength: 7,
      required: true,
      size: 'lg',
      formatter: (value) => formatPlate((value || '').toString()),
      validator: (value) => {
        if (!value.trim()) return 'Placa é obrigatória';
        const cleanValue = value.replace(/[-\s]/g, '').toUpperCase();
        const placaRegex = /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
        if (!placaRegex.test(cleanValue)) {
          return 'Formato de placa inválido (ex: ABC-1234 ou ABC1D23)';
        }
        return null;
      }
    },
    {
      name: 'tipo_veiculo_id',
      type: 'select',
      label: 'Tipo de Veículo',
      labelIcon: 'bi bi-truck',
      inputIcon: 'bi bi-truck-front',
      placeholder: 'Selecione o tipo de veículo',
      required: true,
      size: 'lg',
      loadOptions: () => api.vehicles.getTypes(),
      defaultOptions: [
        { tipo_veiculo_id: 1, nome: 'Ônibus', descricao: 'Veículo de transporte coletivo com capacidade para 40+ passageiros' },
        { tipo_veiculo_id: 2, nome: 'Micro-ônibus', descricao: 'Veículo de transporte coletivo com capacidade para 15-30 passageiros' },
        { tipo_veiculo_id: 3, nome: 'Van', descricao: 'Veículo de transporte coletivo com capacidade para 8-15 passageiros' }
      ],
      optionValue: 'tipo_veiculo_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Tipo de veículo é obrigatório';
        return null;
      }
    },
    {
      name: 'modelo',
      type: 'text',
      label: 'Modelo',
      labelIcon: 'bi bi-car-front',
      inputIcon: 'bi bi-gear',
      placeholder: 'Modelo do veículo',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Modelo deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'marca',
      type: 'text',
      label: 'Marca',
      labelIcon: 'bi bi-building',
      inputIcon: 'bi bi-award',
      placeholder: 'Marca do veículo',
      size: 'lg',
      validator: (value) => {
        return value.trim() && value.length < 2 ? 'Marca deve ter pelo menos 2 caracteres' : null;
      }
    },
    {
      name: 'ano_fabricacao',
      type: 'text',
      label: 'Ano de Fabricação',
      labelIcon: 'bi bi-calendar-event',
      inputIcon: 'bi bi-calendar',
      placeholder: 'Ano de fabricação',
      maxLength: 4,
      additionalProps: { max: new Date().getFullYear() + 1, min: 1950 },
      size: 'lg',
      formatter: (value) => (value || '').toString().replace(/\D/g, ''), // Remove tudo que não for dígito
      validator: (value) => {
        if (value === '') return null;
        const currentYear = new Date().getFullYear();
        const ano = parseInt(value);
        if (isNaN(ano)) return 'Ano deve ser um número';
        if (ano < 1950) return 'Ano deve ser maior que 1950';
        if (ano > currentYear + 1) return `Ano não pode ser maior que ${currentYear + 1}`;
        if (value.length > 4) return 'Ano deve ter no máximo 4 dígitos';
        return null;
      }
    },
    {
      name: 'capacidade',
      type: 'text',
      label: 'Capacidade',
      labelIcon: 'bi bi-people',
      inputIcon: 'bi bi-person-plus',
      placeholder: 'Número de passageiros',
      maxLength: 3,
      additionalProps: { max: 200, min: 1 },
      required: true,
      size: 'lg',
      formatter: (value) => (value || '').toString().replace(/\D/g, ''), // Remove tudo que não for dígito
      validator: (value) => {
        if (value === '') return 'Capacidade é obrigatória';
        const capacidade = parseInt(value);
        if (isNaN(capacidade)) return 'Capacidade deve ser um número';
        if (capacidade < 1) return 'Capacidade deve ser maior que zero';
        if (capacidade > 200) return 'Capacidade deve ser menor que 200';
        return null;
      }
    },
    {
      name: 'quilometragem',
      type: 'text',
      label: 'Quilometragem',
      labelIcon: 'bi bi-speedometer2',
      inputIcon: 'bi bi-graph-up',
      placeholder: 'Quilometragem atual',
      maxLength: 10,
      size: 'lg',
      formatter: (value) => {
        const formatted = (value || '').toString().replace(/[^\d.]/g, '');
        const [intPart, ...decParts] = formatted.split('.');
        return decParts.length ? `${intPart}.${decParts.join('').substring(0, 2)}` : intPart;
      },
      validator: (value) => {
        if (value === '') return null;
        const quilometragem = parseFloat(value);
        if (isNaN(quilometragem)) return 'Quilometragem deve ser um número';
        if (quilometragem < 0) return 'Quilometragem não pode ser negativa';
        if (quilometragem > 9999999) return 'Quilometragem muito alta';
        return null;
      }
    },
    {
      name: 'data_ultima_manutencao',
      type: 'date',
      label: 'Última Manutenção',
      labelIcon: 'bi bi-tools',
      inputIcon: 'bi bi-calendar-check',
      placeholder: 'Data da última manutenção',
      size: 'lg',
      additionalProps: { max: new Date().toISOString().split('T')[0] },
      reverseTransform: reverseTransformDate,
      validator: validateLastMaintenanceDate
    },
    {
      name: 'data_proxima_manutencao',
      type: 'date',
      label: 'Próxima Manutenção',
      labelIcon: 'bi bi-calendar-plus',
      inputIcon: 'bi bi-calendar-event',
      placeholder: 'Data da próxima manutenção',
      size: 'lg',
      additionalProps: { min: new Date().toISOString().split('T')[0] },
      reverseTransform: reverseTransformDate,
      validator: validateNextMaintenanceDate
    },
    {
      name: 'status_veiculo_id',
      alternativeKey: 'status_veiculo_id',
      type: 'select',
      label: 'Status',
      labelIcon: 'bi bi-flag-fill',
      inputIcon: 'bi bi-flag',
      placeholder: 'Selecione o status',
      required: true,
      size: 'lg',
      loadOptions: () => api.vehicles.getStatus(),
      defaultOptions: [
        { status_veiculo_id: 1, nome: 'Em Operação', descricao: 'Veículo em operação normal' },
        { status_veiculo_id: 2, nome: 'Em Manutenção', descricao: 'Veículo em manutenção' },
        { status_veiculo_id: 3, nome: 'Inativo', descricao: 'Veículo inativo' }
      ],
      optionValue: 'status_veiculo_id',
      optionLabel: 'nome',
      validator: (value) => {
        if (!value) return 'Status é obrigatório';
        return null;
      }
    }
  ],
  fakeDataGenerator: createFakeVehicleData
};

// Configuração do formulário de avisos/notificações
export const notificationFormConfig = {
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título',
      labelIcon: 'bi bi-card-heading',
      inputIcon: 'bi bi-text-left',
      placeholder: 'Título do aviso',
      maxLength: 100,
      required: true,
      size: 'lg',
      validator: (value) => {
        if (!value.trim()) return 'Título é obrigatório';
        if (value.length < 3) return 'Título deve ter no mínimo 3 caracteres';
        return null;
      }
    },
    {
      name: 'conteudo',
      type: 'textarea',
      label: 'Conteúdo',
      labelIcon: 'bi bi-card-text',
      inputIcon: 'bi bi-textarea-t',
      placeholder: 'Descreva o conteúdo do aviso...',
      required: true,
      size: 'lg',
      rows: 5,
      validator: (value) => {
        if (!value.trim()) return 'Conteúdo é obrigatório';
        if (value.length < 10) return 'Conteúdo deve ter no mínimo 10 caracteres';
        return null;
      }
    },
    {
      name: 'prioridade',
      type: 'select',
      label: 'Prioridade',
      labelIcon: 'bi bi-exclamation-triangle-fill',
      inputIcon: 'bi bi-flag',
      placeholder: 'Selecione a prioridade',
      required: true,
      size: 'lg',
      defaultOptions: [
        { value: 'BAIXA', label: 'Baixa' },
        { value: 'MEDIA', label: 'Média' },
        { value: 'ALTA', label: 'Alta' }
      ],
      optionValue: 'value',
      optionLabel: 'label',
      validator: (value) => {
        if (!value) return 'Prioridade é obrigatória';
        return null;
      }
    },
    {
      name: 'data_expiracao',
      type: 'date',
      label: 'Data de Expiração (opcional)',
      labelIcon: 'bi bi-calendar-x',
      inputIcon: 'bi bi-calendar-event',
      placeholder: 'Data de expiração',
      size: 'lg',
      additionalProps: { 
        min: new Date().toISOString().split('T')[0]
      },
      reverseTransform: reverseTransformDate,
      validator: (value) => {
        if (!value) return null;
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return 'Data de expiração não pode ser no passado';
        if (date.getFullYear() > today.getFullYear() + 1) return 'Data de expiração deve ser dentro de um ano a partir de hoje';
        return null;
      }
    },
    {
      name: 'escopo_aviso_id',
      type: 'select',
      label: 'Escopo do Aviso',
      labelIcon: 'bi bi-diagram-3-fill',
      inputIcon: 'bi bi-diagram-3',
      placeholder: 'Selecione o escopo',
      required: true,
      size: 'lg',
      loadOptions: () => api.notifications.getScopes(),
      defaultOptions: [],
      optionValue: 'escopo_aviso_id',
      optionLabel: 'nome_escopo',
      validator: (value) => {
        if (!value) return 'Escopo é obrigatório';
        return null;
      }
    },
    {
      name: 'rota_alvo_id',
      type: 'select',
      label: 'Rota Alvo',
      labelIcon: 'bi bi-signpost-split-fill',
      inputIcon: 'bi bi-signpost-split',
      placeholder: 'Selecione uma rota',
      size: 'lg',
      loadOptions: () => api.passengers.getRoutes(),
      defaultOptions: [],
      optionValue: 'rota_id',
      optionLabel: (option) => `${option.nome} (${option.codigo_rota})`,
      dependsOn: 'escopo_aviso_id',
      disabled: (formData) => {
        // Habilita apenas quando escopo = "Por Rota" (ID 2)
        return formData.escopo_aviso_id !== 2 && formData.escopo_aviso_id !== '2';
      },
      helpText: 'Disponível apenas para escopo "Por Rota"',
      validator: (value, formData) => {
        // Só valida se o campo estiver habilitado
        const isEnabled = formData.escopo_aviso_id === 2 || formData.escopo_aviso_id === '2';
        if (isEnabled && !value) {
          return 'Rota é obrigatória para o escopo selecionado';
        }
        return null;
      },
      shouldValidate: (formData) => {
        // Só deve validar se estiver habilitado
        return formData.escopo_aviso_id === 2 || formData.escopo_aviso_id === '2';
      }
    },
    {
      name: 'tipo_passageiro_alvo_id',
      type: 'select',
      label: 'Tipo de Passageiro Alvo',
      labelIcon: 'bi bi-person-badge-fill',
      inputIcon: 'bi bi-tag',
      placeholder: 'Selecione um tipo',
      size: 'lg',
      loadOptions: () => api.passengers.getTypes(),
      defaultOptions: [],
      optionValue: 'tipo_passageiro_id',
      optionLabel: 'nome',
      dependsOn: 'escopo_aviso_id',
      disabled: (formData) => {
        // Habilita apenas quando escopo = "Por Tipo de Passageiro" (ID 3)
        return formData.escopo_aviso_id !== 3 && formData.escopo_aviso_id !== '3';
      },
      helpText: 'Disponível apenas para escopo "Por Tipo de Passageiro"',
      validator: (value, formData) => {
        // Só valida se o campo estiver habilitado
        const isEnabled = formData.escopo_aviso_id === 3 || formData.escopo_aviso_id === '3';
        if (isEnabled && !value) {
          return 'Tipo de passageiro é obrigatório para o escopo selecionado';
        }
        return null;
      },
      shouldValidate: (formData) => {
        // Só deve validar se estiver habilitado
        return formData.escopo_aviso_id === 3 || formData.escopo_aviso_id === '3';
      }
    },
    {
      name: 'passageiro_alvo_id',
      type: 'select',
      label: 'Passageiro Alvo',
      labelIcon: 'bi bi-person-fill',
      inputIcon: 'bi bi-person',
      placeholder: 'Selecione um passageiro',
      size: 'lg',
      loadOptions: async () => {
        const response = await api.passengers.list(1, 1000, '');
        return response;
      },
      defaultOptions: [],
      optionValue: 'passageiro_id',
      optionLabel: (option) => `${option.nome_completo} - ${option.cpf}`,
      dependsOn: 'escopo_aviso_id',
      disabled: (formData) => {
        // Habilita apenas quando escopo = "Passageiro Específico" (ID 4)
        return formData.escopo_aviso_id !== 4 && formData.escopo_aviso_id !== '4';
      },
      helpText: 'Disponível apenas para escopo "Passageiro Específico"',
      validator: (value, formData) => {
        // Só valida se o campo estiver habilitado
        const isEnabled = formData.escopo_aviso_id === 4 || formData.escopo_aviso_id === '4';
        if (isEnabled && !value) {
          return 'Passageiro é obrigatório para o escopo selecionado';
        }
        return null;
      },
      shouldValidate: (formData) => {
        // Só deve validar se estiver habilitado
        return formData.escopo_aviso_id === 4 || formData.escopo_aviso_id === '4';
      }
    },
    {
      name: 'enviar_push',
      type: 'switch',
      label: 'Enviar Notificação Push',
      labelIcon: 'bi bi-bell-fill',
      inputIcon: 'bi bi-bell',
      size: 'lg',
      defaultValue: true,
      helpText: 'Enviar notificação push para o aplicativo móvel'
    },
    {
      name: 'enviar_email',
      type: 'switch',
      label: 'Enviar Email',
      labelIcon: 'bi bi-envelope-fill',
      inputIcon: 'bi bi-envelope',
      size: 'lg',
      defaultValue: false,
      helpText: 'Enviar aviso por email'
    },
    {
      name: 'enviar_sms',
      type: 'switch',
      label: 'Enviar SMS',
      labelIcon: 'bi bi-phone-fill',
      inputIcon: 'bi bi-phone',
      size: 'lg',
      defaultValue: false,
      helpText: 'Enviar aviso por SMS'
    },
    {
      name: 'ativo',
      type: 'switch',
      label: 'Aviso Ativo',
      labelIcon: 'bi bi-toggle-on',
      inputIcon: 'bi bi-toggle-on',
      size: 'lg',
      defaultValue: true,
      helpText: 'Define se o aviso está ativo ou inativo'
    }
  ],
  steps: [
    {
      title: 'Informações Básicas',
      icon: 'bi bi-card-text',
      fields: [
        'titulo',
        'conteudo',
        'prioridade',
        'data_expiracao'
      ]
    },
    {
      title: 'Destino e Canais',
      icon: 'bi bi-send-fill',
      fields: [
        'escopo_aviso_id',
        'rota_alvo_id',
        'tipo_passageiro_alvo_id',
        'passageiro_alvo_id',
        'enviar_push',
        'enviar_email',
        'enviar_sms',
        'ativo'
      ]
    }
  ]
};