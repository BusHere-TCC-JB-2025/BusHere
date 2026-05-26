import React, { useEffect } from 'react';

function DemoPage({ pageFunctions }) {
  useEffect(() => {
    pageFunctions.set("Demonstração", true, true);
  }, [pageFunctions]);

  return (
    <div className="container-fluid p-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex align-items-center">
            <div className="text-primary rounded-circle p-2 me-3">
              <i className="bi bi-lock-fill fs-3"></i>
            </div>
            <h1 className="h3 mb-0 fw-semibold">Informações da Demonstração</h1>
          </div>
        </div>
        <div className="card-body p-5">
          <div className="text-center py-5">
            <i className="bi bi-info-circle text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h2 className="text-muted fw-light mb-4">Bem-vindo à Demonstração Local</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Esta página conterá informações detalhadas sobre as limitações e funcionalidades 
              desta versão de demonstração. Por enquanto, aproveite para explorar o sistema!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoPage;
