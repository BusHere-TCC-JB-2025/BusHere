import { useState, useEffect } from 'react';
import api from '@web/api/api';

// Hook para carregar opções de veículos com filtros
export const useVehicleOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.vehicles.list(1, 100);
      const allVehicles = response.data || [];
      console.log('Veículos carregados do API:', allVehicles);
      
      // Debug: Verificar campos de cada veículo
      if (allVehicles.length > 0) {
        console.log('Primeiro veículo completo:', JSON.stringify(allVehicles[0], null, 2));
      }
      
      // Filtrar veículos: remover aqueles que têm ativo=false explicitamente
      // Se não tiver status_veiculo_id ou ativo, incluir (compatibilidade)
      const filteredVehicles = allVehicles.filter(vehicle => {
        // Se tiver ativo=false, excluir
        if (vehicle.ativo === false || vehicle.ativo === 0) {
          console.log(`Veículo ${vehicle.nome}: EXCLUÍDO (ativo=false)`);
          return false;
        }
        
        // Se tiver status != 1 E o campo existir, excluir
        if (vehicle.status_veiculo_id && vehicle.status_veiculo_id !== 1) {
          console.log(`Veículo ${vehicle.nome}: EXCLUÍDO (status=${vehicle.status_veiculo_id})`);
          return false;
        }
        
        console.log(`Veículo ${vehicle.nome}: INCLUÍDO`);
        return true;
      });
      
      console.log('Veículos filtrados (final):', filteredVehicles);
      setOptions(filteredVehicles);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar veículos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, error, reload: loadOptions };
};

// Hook para carregar opções de motoristas com filtros
export const useDriverOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.drivers.list(1, 100);
      const allDrivers = response.data || [];
      console.log('Motoristas carregados do API:', allDrivers);
      
      // Debug: Verificar campos de cada motorista
      if (allDrivers.length > 0) {
        console.log('Primeiro motorista completo:', JSON.stringify(allDrivers[0], null, 2));
      }
      
      // Filtrar motoristas: remover aqueles que têm ativo=false explicitamente
      // Se não tiver status_motorista_id ou ativo, incluir (compatibilidade)
      const filteredDrivers = allDrivers.filter(driver => {
        // Se tiver ativo=false, excluir
        if (driver.ativo === false || driver.ativo === 0) {
          console.log(`Motorista ${driver.nome}: EXCLUÍDO (ativo=false)`);
          return false;
        }
        
        // Se tiver status != 1 E o campo existir, excluir
        if (driver.status_motorista_id && driver.status_motorista_id !== 1) {
          console.log(`Motorista ${driver.nome}: EXCLUÍDO (status=${driver.status_motorista_id})`);
          return false;
        }
        
        console.log(`Motorista ${driver.nome}: INCLUÍDO`);
        return true;
      });
      
      console.log('Motoristas filtrados (final):', filteredDrivers);
      setOptions(filteredDrivers);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar motoristas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, error, reload: loadOptions };
};

// Hook para formatar opções de veículos para select
export const useFormattedVehicleOptions = () => {
  const { options, loading, error, reload } = useVehicleOptions();
  
  const formattedOptions = options.map(vehicle => ({
    value: vehicle.veiculo_id,
    label: `${vehicle.nome} - ${vehicle.placa} (${vehicle.marca} ${vehicle.modelo})`
  }));

  return { options: formattedOptions, loading, error, reload };
};

// Hook para formatar opções de motoristas para select
export const useFormattedDriverOptions = () => {
  const { options, loading, error, reload } = useDriverOptions();
  
  const formattedOptions = options.map(driver => ({
    value: driver.motorista_id,
    label: `${driver.nome} - CNH: ${driver.cnh_numero}`
  }));

  return { options: formattedOptions, loading, error, reload };
};
