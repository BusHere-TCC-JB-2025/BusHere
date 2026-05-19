import { useState } from "react";
import api from "../../../api/api";
import "./DemoReset.scss";

function DemoReset() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    setLoading(true);
    try {
      await api.post("/database/reset");
      setMessage("✅ Banco de dados resetado com sucesso!");
      setShowConfirm(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao resetar banco de dados:", error);
      setMessage("❌ Erro ao resetar banco de dados");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      {/* Button */}
      <button
        className="btn btn-danger btn-sm demo-button"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        <i className="bi bi-arrow-counterclockwise me-2"></i>
        {loading ? "Resetando..." : "Resetar Dados"}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-backdrop-reset" onClick={() => !loading && setShowConfirm(false)}>
          <div className="modal-reset" onClick={(e) => e.stopPropagation()}>
            <div className="modal-reset-header">
              <i className="bi bi-exclamation-triangle"></i>
              <h2>Resetar Banco de Dados</h2>
            </div>

            <div className="modal-reset-body">
              <p className="warning-text">
                ⚠️ Essa ação é <strong>irreversível</strong>. Todos os dados serão apagados e o banco será reinicializado com dados padrão.
              </p>
              <div className="reset-info">
                <p>O banco de dados será reinicializado com:</p>
                <ul>
                  <li>✓ 2 Passageiros</li>
                  <li>✓ 2 Motoristas</li>
                  <li>✓ 2 Veículos</li>
                  <li>✓ 3 Pontos de parada</li>
                  <li>✓ 2 Rotas</li>
                  <li>✓ 1 Atribuição</li>
                </ul>
              </div>
              {message && (
                <div className={`reset-message ${message.includes("✅") ? "success" : "error"}`}>
                  {message}
                </div>
              )}
            </div>

            <div className="modal-reset-footer">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                <i className="bi bi-x me-2"></i>
                Cancelar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleReset}
                disabled={loading}
              >
                <i className="bi bi-check me-2"></i>
                {loading ? "Resetando..." : "Confirmar Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DemoReset;
