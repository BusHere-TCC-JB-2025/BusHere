import { useState } from "react";
import api from "../../../api/api";
import "./DemoDatabase.scss";

function DemoDatabase() {
  const [isOpen, setIsOpen] = useState(false);
  const [databaseData, setDatabaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const openDatabaseViewer = async () => {
    setLoading(true);
    try {
      const data = await api.get("/database/export");
      setDatabaseData(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Erro ao exportar banco de dados:", error);
      alert("Erro ao carregar banco de dados");
    } finally {
      setLoading(false);
    }
  };

  const closeDatabaseViewer = () => {
    setIsOpen(false);
    setActiveTab("summary");
  };

  const getSummary = () => {
    if (!databaseData) return {};
    return {
      Passageiros: databaseData.passengers?.length || 0,
      Motoristas: databaseData.drivers?.length || 0,
      Veículos: databaseData.vehicles?.length || 0,
      Pontos: databaseData.stops?.length || 0,
      Rotas: databaseData.routes?.length || 0,
      Atribuições: databaseData.assignments?.length || 0,
      Notificações: databaseData.notifications?.length || 0,
      Convites: databaseData.invites?.length || 0,
    };
  };

  const downloadJSON = () => {
    if (!databaseData) return;
    const dataStr = JSON.stringify(databaseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bushere-database-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Button */}
      <button
        className="btn btn-info btn-sm demo-button"
        onClick={openDatabaseViewer}
        disabled={loading}
      >
        <i className="bi bi-database me-2"></i>
        {loading ? "Carregando..." : "Ver Banco de Dados"}
      </button>

      {/* Modal */}
      {isOpen && databaseData && (
        <div className="modal-backdrop-demo" onClick={closeDatabaseViewer}>
          <div className="modal-demo" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-demo-header">
              <h2>
                <i className="bi bi-database me-2"></i>
                Banco de Dados Demo
              </h2>
              <button
                className="btn-close-demo"
                onClick={closeDatabaseViewer}
                title="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="modal-demo-tabs">
              <button
                className={`tab ${activeTab === "summary" ? "active" : ""}`}
                onClick={() => setActiveTab("summary")}
              >
                <i className="bi bi-pie-chart me-1"></i> Resumo
              </button>
              <button
                className={`tab ${activeTab === "json" ? "active" : ""}`}
                onClick={() => setActiveTab("json")}
              >
                <i className="bi bi-code me-1"></i> JSON
              </button>
            </div>

            {/* Content */}
            <div className="modal-demo-content">
              {activeTab === "summary" && (
                <div className="summary-view">
                  <div className="summary-grid">
                    {Object.entries(getSummary()).map(([key, value]) => (
                      <div key={key} className="summary-card">
                        <div className="summary-value">{value}</div>
                        <div className="summary-label">{key}</div>
                      </div>
                    ))}
                  </div>
                  <div className="summary-info">
                    <p>
                      <i className="bi bi-info-circle me-2"></i>
                      Este é o banco de dados simulado em localStorage para a versão demo offline.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "json" && (
                <div className="json-view">
                  <pre>{JSON.stringify(databaseData, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-demo-footer">
              <button className="btn btn-primary btn-sm" onClick={downloadJSON}>
                <i className="bi bi-download me-2"></i>
                Download JSON
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={closeDatabaseViewer}
              >
                <i className="bi bi-x me-2"></i>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DemoDatabase;
