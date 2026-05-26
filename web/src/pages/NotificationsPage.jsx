import React, { useRef, useEffect, useCallback } from "react";
import PopUpComponent from "@web/components/core/feedback/PopUpComponent";
import NotificationForm from "@web/components/domain/notifications/NotificationForm";
import NotificationDetails from "@web/components/domain/notifications/NotificationDetails";
import NotificationsStatsCards from "@web/components/domain/notifications/NotificationsStatsCards";
import Table from "@web/components/common/data-display/Table";
import Notification from "@web/components/common/feedback/Notification";
import LoadingSpinner from "@web/components/common/feedback/LoadingSpinner";
import ErrorAlert from "@web/components/common/feedback/ErrorAlert";
import ActionButton from "@web/components/common/buttons/ActionButton";
import { Dialog } from "@web/components/common/feedback";
import { useNotifications, useNotification } from "@web/hooks";

// Formatador para prioridade
const formatPriority = (value) => {
  const priorityMap = {
    'BAIXA': { className: 'badge bg-secondary', text: 'Baixa' },
    'MEDIA': { className: 'badge bg-warning', text: 'Média' },
    'ALTA': { className: 'badge bg-danger', text: 'Alta' }
  };
  const priority = priorityMap[value] || { className: 'badge bg-secondary', text: value };
  return React.createElement('span', { className: priority.className }, priority.text);
};

// Formatador para status
const formatStatus = (value) => {
  const className = value ? 'badge bg-success' : 'badge bg-secondary';
  const text = value ? 'Ativo' : 'Inativo';
  return React.createElement('span', { className }, text);
};

const TABLE_HEADERS = [
  { id: "id", label: "ID", sortable: true },
  { id: "titulo", label: "Título", sortable: true },
  { id: "escopo_nome", label: "Escopo", sortable: true },
  { id: "prioridade", 
    label: "Prioridade", 
    sortable: true,
    formatter: formatPriority
  },
  { id: "data_publicacao", label: "Data Publicação", sortable: true },
  { id: "data_expiracao", label: "Data Expiração", sortable: true, formatter: (value) => value || "Sem expiração" },
  { id: "ativo", 
    label: "Status", 
    sortable: true,
    formatter: formatStatus
  },
];

function NotificationsPage({ pageFunctions }) {
  const popUpRef = useRef(null);
  const dialogRef = useRef(null);
  
  // Usar hook customizado para gerenciar dados dos avisos
  const {
    notifications,
    isLoading,
    error,
    createNotification,
    updateNotification,
    deleteNotification,
    refetch
  } = useNotifications();

  // Hook para notificações
  const { notification, hideNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    pageFunctions.set("Avisos", true, true);
  }, [pageFunctions]);

  const handleCreateNotification = useCallback(() => {
    popUpRef.current.show({
      title: "Novo Aviso",
      content: NotificationForm,
      props: {
        onSubmit: async (formData) => {
          const result = await createNotification(formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Aviso criado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
        isCreateForm: true
      }
    });
  }, [createNotification, showSuccess, showError]);

  const handleEditNotification = useCallback((notificationItem) => {
    const initialData = {
      titulo: notificationItem.titulo,
      conteudo: notificationItem.conteudo,
      escopo_aviso_id: parseInt(notificationItem.escopo_aviso_id),
      prioridade: notificationItem.prioridade,
      data_expiracao: notificationItem.data_expiracao,
      rota_alvo_id: notificationItem.rota_alvo_id,
      tipo_passageiro_alvo_id: notificationItem.tipo_passageiro_alvo_id,
      passageiro_alvo_id: notificationItem.passageiro_alvo_id,
      enviar_push: notificationItem.enviar_push,
      enviar_email: notificationItem.enviar_email,
      enviar_sms: notificationItem.enviar_sms,
      ativo: notificationItem.ativo
    };

    popUpRef.current.show({
      title: `Editar Aviso: ${notificationItem.titulo}`,
      content: NotificationForm,
      props: {
        initialData: initialData,
        onSubmit: async (formData) => {
          const result = await updateNotification(notificationItem.id, formData);
          if (result.success) {
            popUpRef.current.hide();
            showSuccess("Aviso atualizado com sucesso!");
          } else {
            showError(result.error);
          }
        },
        onCancel: () => popUpRef.current.hide(),
      }
    });
  }, [updateNotification, showSuccess, showError]);

  const handleDeleteNotification = useCallback(async (id) => {
    dialogRef.current.showConfirm({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este aviso?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        const result = await deleteNotification(id);
        if (result.success) {
          popUpRef.current.hide();
          showSuccess("Aviso excluído com sucesso!");
        } else {
          showError(result.error);
        }
      },
      onCancel: () => {}
    });
  }, [deleteNotification, showSuccess, showError]);

  const handleRowClick = useCallback((notificationItem) => {
    popUpRef.current.show({
      title: `Aviso: ${notificationItem.titulo}`,
      content: NotificationDetails,
      props: {
        notification: notificationItem,
        onEdit: handleEditNotification,
        onDelete: handleDeleteNotification,
      }
    });
  }, [handleEditNotification, handleDeleteNotification]);

  return (
    <div className="ps-3 pe-3 pt-3">
      {/* Cards de Estatísticas */}
      <NotificationsStatsCards notifications={notifications} />
      
      <div className="container-fluid">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-bell-fill fs-3"></i>
                </div>
                <h1 className="h3 mb-0 fw-semibold">Avisos e Notificações</h1>
              </div>
              
              <ActionButton
                onClick={handleCreateNotification}
                icon="bi bi-plus-circle"
                text="Novo Aviso"
                variant="primary"
                size="lg"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="card-body p-5">
            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
              <i className="bi bi-info-circle text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <h3 className="text-muted fw-light mb-2">Não disponível na Versão de Demonstração</h3>
              <p className="text-muted">
                Clique <a href="#" className="text-primary text-decoration-none fw-bold">Aqui</a> para saber mais
              </p>
            </div>
          </div>
        </div>
        
        <div className="card border-0 bg-light shadow-sm mb-4 p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
            <p className="mb-0 text-muted">
              <strong>Dica:</strong> Clique em uma linha da tabela para ver os detalhes completos do aviso.
              Para adicionar um novo aviso, clique no botão "Novo Aviso".
            </p>
          </div>
        </div>
        <br/>

        <PopUpComponent 
          ref={popUpRef}
        />

        {/* Dialog unificado para confirmações */}
        <Dialog ref={dialogRef} />

        {/* Componente de Notificação */}
        <Notification 
          notification={notification} 
          onClose={hideNotification} 
        />
      </div>
    </div>
  );
}

export default NotificationsPage;