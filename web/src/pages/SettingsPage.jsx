import { useRef, useEffect, useState } from "react";
import PopUpComponent from "../components/core/feedback/PopUpComponent";
import { useAuth } from "../context/authContext";
import api from "../api/api";
import "./SettingsPage.scss";

// Componentes reutilizáveis
import PageHeader from "../components/features/settings/PageHeader";
import UserProfile from "../components/features/settings/UserProfile";
import ThemeSwitch from "../components/features/settings/ThemeSwitch";
import SettingSection from "../components/features/settings/SettingSection";
import SettingItem from "../components/features/settings/SettingItem";
import SystemInfo from "../components/features/settings/SystemInfo";
import SettingsActions from "../components/features/settings/SettingsActions";
import DemoDatabase from "../components/features/settings/DemoDatabase";
import DemoReset from "../components/features/settings/DemoReset";

function Settings({ pageFunctions, isDark, setIsDark }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const popUpRef = useRef(null);

  useEffect(() => {
    pageFunctions.set("Configurações", true, true);
  }, [pageFunctions]);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState([
    { 
      id: 1, 
      name: "Notificações", 
      description: "Receba alertas sobre atualizações do sistema",
      value: "Ativado",
      icon: "bi-bell"
    },
    { 
      id: 2, 
      name: "Atualizações Automáticas", 
      description: "Permita que o sistema se atualize automaticamente",
      value: "Ativado",
      icon: "bi-download"
    },
    // { 
    //   id: 3, 
    //   name: "Som do Sistema", 
    //   description: "Reproduzir sons para ações e notificações",
    //   value: "Ativado",
    //   icon: "bi-volume-up"
    // }
  ]);

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState([
    {
      id: 1,
      name: "Sessão Automática",
      description: "Manter logado automaticamente",
      value: "Ativado",
      icon: "bi-person-check"
    },
    // {
    //   id: 2,
    //   name: "Verificação em Duas Etapas",
    //   description: "Segurança adicional para sua conta",
    //   value: "Desativado",
    //   icon: "bi-shield-check"
    // }
  ]);

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState([
    {
      id: 1,
      name: "Dados de Uso",
      description: "Compartilhar dados anônimos para melhorias",
      value: "Ativado",
      icon: "bi-graph-up"
    },
    {
      id: 2,
      name: "Localização",
      description: "Permitir acesso à localização para funcionalidades",
      value: "Ativado",
      icon: "bi-geo-alt"
    }
  ]);

  const options = {
    "Notificações": ["Desativado", "Ativado"],
    "Atualizações Automáticas": ["Desativado", "Ativado"],
    "Som do Sistema": ["Desativado", "Ativado"],
    "Sessão Automática": ["Desativado", "Ativado"],
    "Verificação em Duas Etapas": ["Desativado", "Ativado"],
    "Dados de Uso": ["Desativado", "Ativado"],
    "Localização": ["Desativado", "Ativado"]
  };

  const changeValue = (settingsArray, setSettingsArray, id, direction) => {
    const updated = settingsArray.map(setting => {
      if (setting.id === id) {
        const list = options[setting.name];
        let index = list.indexOf(setting.value);
        index = direction === "left" ? (index - 1 + list.length) % list.length : (index + 1) % list.length;
        return { ...setting, value: list[index] };
      }
      return setting;
    });
    setSettingsArray(updated);
  };

  // Função simplificada para toggle de configurações
  const handleToggleSetting = (settingsArray, setSettingsArray, id) => {
    changeValue(settingsArray, setSettingsArray, id, "right");
  };

  return (
    <div className="container-fluid px-4 pt-3">
      <div className="row g-4 align-items-stretch">
        {/* Left Column */}
        <div className="col-lg-8 d-flex flex-column">
          {/* Page Header */}
          <PageHeader
            title="Configurações"
            description="Personalize sua experiência no sistema"
            icon="bi-gear-fill"
          />

          {/* User Profile Section */}
          {isAuthenticated && user && (
            <UserProfile
              user={user}
              logout={logout}
              popUpRef={popUpRef}
              animationDelay="0.1s"
            />
          )}

          {/* Theme Settings Section */}
          <ThemeSwitch
            isDark={isDark}
            onToggle={() => setIsDark(!isDark)}
            animationDelay="0.2s"
          />

          {/* General Settings Section */}
          <SettingSection
            title="Configurações Gerais"
            description="Ajustes básicos do sistema"
            icon="bi-sliders"
            iconBg="bg-success"
            animationDelay="0.3s"
          >
            {generalSettings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onToggle={(id) => handleToggleSetting(generalSettings, setGeneralSettings, id)}
              />
            ))}
          </SettingSection>

          {/* Account Settings Section */}
          <SettingSection
            title="Conta e Segurança"
            description="Configurações de login e segurança"
            icon="bi-person-gear"
            iconBg="bg-warning"
            animationDelay="0.4s"
          >
            {accountSettings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onToggle={(id) => handleToggleSetting(accountSettings, setAccountSettings, id)}
              />
            ))}
          </SettingSection>

          {/* Demo Tools Section */}
          <SettingSection
            title="Ferramentas da Demo"
            description="Controle o banco de dados para testes"
            icon="bi-tools"
            iconBg="bg-info"
            animationDelay="0.5s"
          >
            <div className="demo-tools-container">
              <div className="demo-tool-item">
                <div className="tool-info">
                  <h4>Visualizar Banco de Dados</h4>
                  <p>Veja o conteúdo completo do banco de dados em modo resumido ou JSON</p>
                </div>
                <DemoDatabase />
              </div>
              
              <div className="demo-tool-item">
                <div className="tool-info">
                  <h4>Resetar Dados</h4>
                  <p>Reinicialize o banco com dados padrão (irá perder todas as mudanças)</p>
                </div>
                <DemoReset />
              </div>
            </div>
          </SettingSection>

          {/* Privacy Settings Section
          <SettingSection
            title="Privacidade"
            description="Controle suas informações pessoais"
            icon="bi-shield-check"
            iconBg="bg-danger"
            animationDelay="0.5s"
          >
            {privacySettings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onToggle={(id) => handleToggleSetting(privacySettings, setPrivacySettings, id)}
              />
            ))}
          </SettingSection> */}

          {/* Settings Actions Section */}
          {/* <SettingsActions
            isDark={isDark}
            setIsDark={setIsDark}
            generalSettings={generalSettings}
            setGeneralSettings={setGeneralSettings}
            accountSettings={accountSettings}
            setAccountSettings={setAccountSettings}
            privacySettings={privacySettings}
            setPrivacySettings={setPrivacySettings}
            popUpRef={popUpRef}
            animationDelay="0.6s"
          /> */}
        </div>
      
        {/* Right Column - System Information */}
        <div className="col-lg-4 d-flex">
          <SystemInfo animationDelay="0.7s" />
        </div>
      </div>

      <PopUpComponent ref={popUpRef} />
    </div>
  );
}

export default Settings;