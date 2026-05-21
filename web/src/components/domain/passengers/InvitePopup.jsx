import React, { useState, useEffect, useRef, useCallback } from "react";
import ActionButton from "@web/components/common/buttons/ActionButton";
import api from "@web/api/api";
import { useNotification } from "@web/hooks/ui/useNotification";

const STATUS_CONVITE = {
    1: "Pendente",
    2: "Aceito", 
    3: "Expirado",
    4: "Cancelado"
};

const STATUS_COLORS = {
    1: "warning",
    2: "success",
    3: "danger",
    4: "secondary"
};

const STATUS_ICONS = {
    1: "bi-clock-history",
    2: "bi-check-circle-fill",
    3: "bi-x-circle-fill",
    4: "bi-dash-circle-fill"
};

function InvitesTable({ invites, onCopyLink }) {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (codigoConvite, inviteId) => {
        onCopyLink(codigoConvite);
        setCopiedId(inviteId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (invites.length === 0) {
        return (
            <div className="invites-list__empty">
                <i className="bi bi-envelope-open invites-list__empty-icon"></i>
                <h5 className="invites-list__empty-title">Nenhum convite enviado ainda</h5>
                <p className="invites-list__empty-text">
                    Os convites criados aparecerão aqui
                </p>
            </div>
        );
    }

    return (
        <div className="row g-3">
            {invites.map((invite, index) => (
                <div 
                    key={invite.convite_passageiro_id} 
                    className="col-12 invites-list__card"
                >
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="row align-items-center">
                                {/* Código do Convite */}
                                <div className="col-md-3">
                                    <div className="invites-list__card-code">
                                        <i className={`bi ${STATUS_ICONS[invite.status_convite_id]} text-${STATUS_COLORS[invite.status_convite_id]} invites-list__card-code-icon`}></i>
                                        <div>
                                            <div className="invites-list__card-code-label">Código</div>
                                            <code>
                                                {invite.codigo_convite.substring(0, 12)}...
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-md-4 invites-list__card-email">
                                    <div className="invites-list__card-email-label">
                                        <i className="bi bi-envelope"></i>
                                        Email
                                    </div>
                                    <div className="invites-list__card-email-value text-truncate" title={invite.email_convidado}>
                                        {invite.email_convidado}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-md-3 invites-list__card-status">
                                    <div className="invites-list__card-status-label">Status</div>
                                    <span className={`badge bg-${STATUS_COLORS[invite.status_convite_id]}`}>
                                        <i className={`bi ${STATUS_ICONS[invite.status_convite_id]}`}></i>
                                        {STATUS_CONVITE[invite.status_convite_id] || 'Desconhecido'}
                                    </span>
                                </div>

                                {/* Ações */}
                                <div className="col-md-2 text-end invites-list__card-actions">
                                    <button
                                        className={`btn btn-sm ${copiedId === invite.convite_passageiro_id ? 'btn-success' : 'btn-outline-primary'}`}
                                        onClick={() => handleCopy(invite.codigo_convite, invite.convite_passageiro_id)}
                                        title="Copiar link do convite"
                                        disabled={copiedId === invite.convite_passageiro_id}
                                    >
                                        <i className={`bi ${copiedId === invite.convite_passageiro_id ? 'bi-check2' : 'bi-copy'} me-1`}></i>
                                        {copiedId === invite.convite_passageiro_id ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function InviteForm({ onInviteCreated, onReset }) {
    const [email, setEmail] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [linkCopied, setLinkCopied] = useState(false);
    const { showSuccess, showError } = useNotification();
    const formRef = useRef(null);

    // Resetar formulário quando solicitado
    useEffect(() => {
        if (onReset) {
            const resetForm = () => {
                setEmail("");
                setGeneratedLink("");
                setShowSuccessAnimation(false);
                setEmailError("");
                setLinkCopied(false);
            };
            onReset.current = resetForm;
        }
    }, [onReset]);

    // Validação robusta de email
    const validateEmail = (email) => {
        const trimmedEmail = email.trim();
        
        if (!trimmedEmail) {
            return "Email é obrigatório";
        }
        
        // Regex completo para validação de email
        const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(trimmedEmail)) {
            return "Email inválido. Use o formato: email@exemplo.com";
        }
        
        // Validações adicionais
        const parts = trimmedEmail.split('@');
        if (parts.length !== 2) {
            return "Email deve conter exatamente um @";
        }
        
        const [localPart, domainPart] = parts;
        
        // Validar parte local (antes do @)
        if (localPart.length === 0 || localPart.length > 64) {
            return "Parte local do email inválida";
        }
        
        // Validar domínio
        if (domainPart.length === 0 || domainPart.length > 255) {
            return "Domínio do email inválido";
        }
        
        // Verificar se tem pelo menos um ponto no domínio
        if (!domainPart.includes('.')) {
            return "Domínio deve conter pelo menos um ponto";
        }
        
        // Verificar extensão do domínio
        const domainParts = domainPart.split('.');
        const extension = domainParts[domainParts.length - 1];
        if (extension.length < 2) {
            return "Extensão do domínio inválida";
        }
        
        return "";
    };

    // Validar email ao digitar
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        
        if (newEmail.trim()) {
            const error = validateEmail(newEmail);
            setEmailError(error);
        } else {
            setEmailError("");
        }
    };

    // Limpar campo de email e link gerado
    const handleClearEmail = () => {
        setEmail("");
        setEmailError("");
        setGeneratedLink("");
        setShowSuccessAnimation(false);
        setLinkCopied(false);
    };

    const handleInvite = async () => {
        const error = validateEmail(email);
        
        if (error) {
            setEmailError(error);
            showError(error);
            return;
        }

        setIsLoading(true);
        try {
            const newInvite = { 
                email: email.trim(),
                status_convite_id: 1
            };
            
            const response = await api.invites.create(newInvite);
            const inviteLink = `localhost:5174/convite/${response.data.codigo_convite}`;
            
            setGeneratedLink(inviteLink);
            setShowSuccessAnimation(true);
            setEmailError("");
            showSuccess(`Convite enviado com sucesso para ${email.trim()}!`);
            
            // Notificar o pai sem redirecionar
            if (onInviteCreated) {
                onInviteCreated(inviteLink);
            }
            
        } catch (error) {
            console.error("Erro ao criar convite:", error);
            const errorMessage = error.response?.data?.error || "Erro ao enviar convite. Tente novamente.";
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyGeneratedLink = async () => {
        if (!generatedLink) return;
        
        try {
            await navigator.clipboard.writeText(generatedLink);
            setLinkCopied(true);
            showSuccess("Link copiado para a área de transferência!");
            
            setTimeout(() => {
                setLinkCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Erro ao copiar link:", error);
            showError("Erro ao copiar link. Tente novamente.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email.trim() && !isLoading) {
            handleInvite();
        }
    };

    return (
        <div className="invite-form" ref={formRef}>
            {/* Cabeçalho do formulário */}
            <div className="invite-form__header">
                <div className="invite-form__header-icon">
                    <i className="bi bi-person-plus-fill"></i>
                </div>
                <h5 className="invite-form__header-title">Criar Novo Convite</h5>
                <p className="invite-form__header-subtitle">
                    Digite o email do passageiro para gerar um link de convite
                </p>
            </div>

            <div className="row g-4">
                {/* Campo de Email */}
                <div className="col-12">
                    <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        Email do Passageiro
                        <span className="text-danger ms-1">*</span>
                    </label>
                    <div className="row g-2">
                        {/* Input de Email - 83.33% (5/6) */}
                        <div className="col-10">
                            <div className="input-group input-group-lg invite-form__email-field">
                                <span className="input-group-text">
                                    <i className={`bi ${emailError ? 'bi-exclamation-circle text-danger' : 'bi-envelope text-primary'}`}></i>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${emailError ? 'is-invalid' : email.trim() && !emailError ? 'is-valid' : ''}`}
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                        {/* Botão Limpar - 16.67% (1/6) */}
                        <div className="col-2 d-flex align-items-stretch">
                            <button
                                className="btn btn-outline-primary w-100 invite-form__clear-btn"
                                type="button"
                                onClick={handleClearEmail}
                                disabled={!email.trim()}
                                title="Limpar campo e link gerado"
                            >
                                <i className="bi bi-x-circle me-1"></i>
                                <span className="d-none d-xl-inline">Limpar</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Mensagens de validação */}
                    {emailError && (
                        <div className="invalid-feedback d-block mt-2">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            {emailError}
                        </div>
                    )}
                    {!emailError && (
                        <div className="form-text mt-2">
                            <i className="bi bi-info-circle me-1"></i>
                            O convite será enviado para este email
                        </div>
                    )}
                </div>
                
                {/* Link Gerado com Animação */}
                {generatedLink && (
                    <div className="col-12 invite-form__success-card">
                        <div className={`card ${showSuccessAnimation ? 'animate' : ''}`}>
                            <div className="card-body">
                                <div className="invite-form__success-card-header">
                                    <div className="invite-form__success-card-header-icon">
                                        <i className="bi bi-check-circle-fill"></i>
                                    </div>
                                    <div className="invite-form__success-card-header-content">
                                        <h6>Convite criado com sucesso!</h6>
                                        <small>Link gerado e pronto para compartilhar</small>
                                    </div>
                                </div>
                                
                                <label htmlFor="generatedLink" className="form-label fw-semibold small text-muted mb-2">
                                    <i className="bi bi-link-45deg me-1"></i>
                                    Link do Convite
                                </label>
                                <div className="input-group invite-form__success-card-link">
                                    <input
                                        type="text"
                                        id="generatedLink"
                                        className="form-control"
                                        value={generatedLink}
                                        readOnly
                                    />
                                    <button
                                        className={`btn ${linkCopied ? 'btn-success' : 'btn-success'}`}
                                        type="button"
                                        onClick={handleCopyGeneratedLink}
                                        title="Copiar link"
                                        disabled={linkCopied}
                                    >
                                        <i className={`bi ${linkCopied ? 'bi-check2-circle' : 'bi-copy'} me-2`}></i>
                                        {linkCopied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Botão de Envio */}
            <div className="mt-3 invite-form__submit-btn">
                <ActionButton 
                    text={isLoading ? "Gerando convite..." : "Gerar Convite"} 
                    icon="bi bi-send-fill"
                    onClick={handleInvite}
                    loading={isLoading}
                    disabled={!email.trim() || isLoading}
                    variant="primary"
                />
            </div>
        </div>
    );
}

function InvitePopup({ close }) {
     const [invites, setInvites] = useState([]);
    const [activeTab, setActiveTab] = useState("create"); // Inicia na aba de criar
    const { showSuccess, showError } = useNotification();
    const formResetRef = useRef(null);

    // Mostrar alerta ao abrir o modal
    useEffect(() => {
        alert("A função de enviar convites não está disponível na demo");
    }, []);

    const fetchInvites = async () => {
        try {
            const response = await api.invites.list();
            setInvites(response.data);
        } catch (error) {
            console.error("Erro ao buscar convites:", error);
            showError("Erro ao carregar convites");
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleCopyLink = async (codigoConvite) => {
        const link = `localhost:5174/convite/${codigoConvite}`;
        try {
            await navigator.clipboard.writeText(link);
            showSuccess("Link do convite copiado com sucesso!");
        } catch (error) {
            console.error("Erro ao copiar link:", error);
            showError("Erro ao copiar link. Tente novamente.");
        }
    };

    const handleInviteCreated = useCallback((inviteLink) => {
        // Apenas atualizar lista de convites, sem redirecionar
        fetchInvites();
    }, []);

    return (
        <div className="invite-popup-container">
            {/* Navegação por abas moderna */}
            <div className="nav nav-pills nav-fill mb-4 mt-1 invite-tabs me-1 ms-1">
                <button
                    className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("create")}
                >
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Criar Novo Convite
                </button>
                <button
                    className={`nav-link ms-2 ${activeTab === "list" ? "active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("list")}
                >
                    <i className="bi bi-envelope-check-fill me-2"></i>
                    Convites Enviados
                    {invites.length > 0 && (
                        <span className="badge bg-light text-primary ms-2">{invites.length}</span>
                    )}
                </button>
            </div>

            {/* Conteúdo das abas */}
            <div className="tab-content">
                {/* Aba: Criar Convite */}
                <div className={`tab-pane fade ${activeTab === "create" ? "show active" : ""}`}>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <InviteForm 
                                onInviteCreated={handleInviteCreated} 
                                onReset={formResetRef}
                            />
                        </div>
                    </div>
                </div>

                {/* Aba: Lista de Convites */}
                <div className={`tab-pane fade ${activeTab === "list" ? "show active" : ""}`}>
                    <div className="card border-0 shadow-sm">
                        <div className="card-header invites-header">
                            <div className="invites-header__content">
                                <i className="bi bi-envelope-check-fill"></i>
                                <div>
                                    <h5>Convites Enviados</h5>
                                    <small>
                                        Total de {invites.length} {invites.length === 1 ? 'convite' : 'convites'}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <InvitesTable invites={invites} onCopyLink={handleCopyLink} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvitePopup;
