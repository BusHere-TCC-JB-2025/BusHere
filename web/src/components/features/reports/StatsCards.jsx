import React, { useRef, useMemo } from 'react';
import PopUpComponent from '../../core/feedback/PopUpComponent';
import { Table } from '@web/components/common/data-display';
import StatCard from '../../common/data-display/StatCard';
import { isVehicleActive, isRouteActive, getActiveVehicles, getActiveRoutes } from '@web/utils/reportFilters';

const StatsCards = ({ reportData }) => {
  const popUpRef = useRef(null);

  // Funções auxiliares para obter dados corretos
  const getActiveVehicleData = () => {
    if (reportData.stats?.vehicles?.ativos) return reportData.stats.vehicles.ativos;
    if (reportData.stats?.vehicles?.byStatus && Array.isArray(reportData.stats.vehicles.byStatus)) {
      const activeStatuses = ['Ativo', 'Em Operação', 'Disponível'];
      return reportData.stats.vehicles.byStatus
        .filter(status => activeStatuses.includes(status.status_nome))
        .reduce((total, status) => total + (status.total_veiculos || 0), 0);
    }
    if (reportData.vehicles && Array.isArray(reportData.vehicles)) {
      return reportData.vehicles.filter(vehicle => vehicle.ativo === true || vehicle.ativo === 1).length;
    }
    return 0;
  };

  const getActiveRouteData = () => {
    if (reportData.stats?.routes?.ativas) return reportData.stats.routes.ativas;
    if (reportData.stats?.routes?.byStatus && Array.isArray(reportData.stats.routes.byStatus)) {
      const activeStatuses = ['Ativa', 'Em Operação', 'Disponível'];
      return reportData.stats.routes.byStatus
        .filter(status => activeStatuses.includes(status.status_nome))
        .reduce((total, status) => total + (status.total_rotas || 0), 0);
    }
    if (reportData.routes && Array.isArray(reportData.routes)) {
      return reportData.routes.filter(route => route.ativo === true || route.ativo === 1).length;
    }
    return 0;
  };

  const getActiveDriverData = () => {
    if (reportData.stats?.drivers?.ativos) return reportData.stats.drivers.ativos;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.filter(driver => 
        (driver.ativo === true || driver.ativo === 1) && 
        (driver.status_nome === 'Ativo' || driver.status_motorista_id === 1)
      ).length;
    }
    return 0;
  };

  const STATS_CONFIG = {
    passengers: {
      title: "Total de Passageiros",
      iconClass: "bi bi-people-fill",
      gradient: "bg-gradient-primary",
      popupTitle: 'Total de Passageiros',
      data: reportData.stats?.passengers?.total || reportData.passengers?.length || 0
    },
    vehicles: {
      title: "Veículos Ativos",
      iconClass: "bi bi-car-front-fill",
      gradient: "bg-gradient-info",
      popupTitle: 'Veículos Ativos',
      data: getActiveVehicleData()
    },
    routes: {
      title: "Rotas Ativas",
      iconClass: "bi bi-signpost-split-fill",
      gradient: "bg-gradient-warning",
      popupTitle: 'Rotas Ativas',
      data: getActiveRouteData()
    },
    drivers: {
      title: "Motoristas Ativos",
      iconClass: "bi bi-person-fill-gear",
      gradient: "bg-gradient-danger",
      popupTitle: 'Motoristas Ativos',
      data: getActiveDriverData()
    }
  };

  // Função para mostrar popup com detalhes
  const showStatsPopup = (statsType) => {
    const config = STATS_CONFIG[statsType];
    
    popUpRef.current.show({
      title: config.popupTitle,
      content: StatsDetailsPopup,
      props: {
        statsType,
        config,
        reportData
      }
    });
  };

  return (
    <>
      <div className="row mb-4 g-3">
        {Object.entries(STATS_CONFIG).map(([statsType, config]) => (
          <StatCard
            key={statsType}
            title={config.title}
            value={config.data}
            iconClass={config.iconClass}
            gradient={config.gradient}
            onClick={() => showStatsPopup(statsType)}
            className="col-xl-3 col-md-6 mb-4"
          />
        ))}
      </div>
      <PopUpComponent ref={popUpRef} />
    </>
  );
};

// Componente de popup para mostrar detalhes das estatísticas
const StatsDetailsPopup = ({ statsType, config, reportData }) => {
  const getPopupContent = () => {
    switch (statsType) {
      case 'passengers':
        return (
          <div className="text-center p-4">
            <i className="bi bi-people-fill fs-1 text-muted mb-3 d-block"></i>
            <h5 className="mb-3">{config.title}</h5>
            <p className="text-muted mb-0">
              Total de {config.data} passageiro(s) cadastrado(s) no sistema.
            </p>
          </div>
        );
      
      case 'vehicles':
        return (
          <div className="text-center p-4">
            <i className="bi bi-car-front-fill fs-1 text-muted mb-3 d-block"></i>
            <h5 className="mb-3">{config.title}</h5>
            <p className="text-muted mb-0">
              {config.data} veículo(s) ativo(s) em operação no sistema.
            </p>
          </div>
        );
      
      case 'routes':
        return (
          <div className="text-center p-4">
            <i className="bi bi-signpost-split-fill fs-1 text-muted mb-3 d-block"></i>
            <h5 className="mb-3">{config.title}</h5>
            <p className="text-muted mb-0">
              {config.data} rota(s) ativa(s) em operação no sistema.
            </p>
          </div>
        );
      
      case 'drivers':
        return (
          <div className="text-center p-4">
            <i className="bi bi-person-fill-gear fs-1 text-muted mb-3 d-block"></i>
            <h5 className="mb-3">{config.title}</h5>
            <p className="text-muted mb-0">
              {config.data} motorista(s) ativo(s) em operação no sistema.
            </p>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-4">
            <p className="text-muted">Informações não disponíveis.</p>
          </div>
        );
    }
  };

  return (
    <div className="stats-details-popup" style={{ maxWidth: '90vw', width: '100%', minWidth: '400px' }}>
      {getPopupContent()}
    </div>
  );
};

export default StatsCards;
