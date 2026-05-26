import React from 'react';

const PerformanceIndicator = ({ title, percentage, gradient, description }) => {
  return (
    <div className="col-lg-6 col-xl-3 mb-3">
      <div className="text-center p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="text-muted mb-0 fw-semibold">{title}</h6>
          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
            {percentage}%
          </span>
        </div>
        <div className="progress mb-3" style={{height: '12px', borderRadius: '10px'}}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{
              width: `${Math.min(100, percentage)}%`,
              background: gradient,
              borderRadius: '10px'
            }}
          ></div>
        </div>
        <small className="text-muted">{description}</small>
      </div>
    </div>
  );
};

const PerformanceSection = ({ reportData }) => {
  // Funções auxiliares para obter dados de motoristas
  const getDriverData = () => {
    if (reportData.stats?.drivers?.total) return reportData.stats.drivers.total;
    if (reportData.drivers && Array.isArray(reportData.drivers)) {
      return reportData.drivers.length;
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

  const indicators = [
    {
      title: "Taxa de Utilização da Frota",
      percentage: (() => {
        const totalPassageiros = reportData.stats?.passengers?.total || 0;
        const capacidadeTotal = reportData.stats?.vehicles?.totalCapacity || 
                               (reportData.vehicles && Array.isArray(reportData.vehicles) ? 
                                reportData.vehicles.reduce((total, vehicle) => total + (parseInt(vehicle.capacidade) || 0), 0) : 0);
        
        if (capacidadeTotal === 0) return 0;
        return ((totalPassageiros / capacidadeTotal) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #12BE4D 0%, #5CE98B 100%)",
      description: "Passageiros vs Capacidade Total"
    },
    {
      title: "Pontos Ativos",
      percentage: (() => {
        const totalPontos = reportData.stats?.stops?.total_pontos || 0;
        const pontosAtivos = reportData.stats?.stops?.pontos_ativos || 0;
        
        if (totalPontos === 0) return 0;
        return ((pontosAtivos / totalPontos) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #1E90FF 0%, #12BEA0 100%)",
      description: (() => {
        const totalPontos = reportData.stats?.stops?.total_pontos || 0;
        const pontosAtivos = reportData.stats?.stops?.pontos_ativos || 0;
        return `${pontosAtivos} de ${totalPontos} pontos`;
      })()
    },
    {
      title: "Eficiência de Rotas",
      percentage: (() => {
        const rotasAtivas = reportData.stats?.routes?.ativas || 0;
        const totalRotas = reportData.stats?.routes?.total || 0;
        
        if (totalRotas === 0) return 0;
        return ((rotasAtivas / totalRotas) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #FF6B6B 0%, #FFC107 100%)",
      description: "Rotas Ativas vs Total"
    },
    {
      title: "Eficiência de Motoristas",
      percentage: (() => {
        const motoristasAtivos = reportData.stats?.drivers?.ativos || 0;
        const totalMotoristas = reportData.stats?.drivers?.total || 0;
        
        if (totalMotoristas === 0) return 0;
        return ((motoristasAtivos / totalMotoristas) * 100).toFixed(1);
      })(),
      gradient: "linear-gradient(90deg, #E74C3C 0%, #F39C12 100%)",
      description: (() => {
        const motoristasAtivos = reportData.stats?.drivers?.ativos || 0;
        const totalMotoristas = reportData.stats?.drivers?.total || 0;
        return `${motoristasAtivos} de ${totalMotoristas} motoristas`;
      })()
    }
  ];

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card border-0 shadow-sm performance-card">
          <div className="card-header bg-transparent border-0 p-4">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-tachometer-alt text-success"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-primary">Indicadores de Performance</h5>
                <small className="text-muted">Métricas de eficiência operacional</small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-4">
              {indicators.map((indicator, index) => (
                <PerformanceIndicator
                  key={index}
                  title={indicator.title}
                  percentage={indicator.percentage}
                  gradient={indicator.gradient}
                  description={indicator.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
