import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLocation } from "react-router-dom";


function SideButton({name, icon, href = "#", isOpen = false, style = {}, keybindId, keybindLabel}) {
    const location = useLocation();
    const isActive = location.pathname === (href.startsWith('/') ? href : `/${href}`);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    
    return (
  <Link
    to={href}
    className={`sidebar-button d-flex align-items-center rounded-3 text-decoration-none w-100 mb-1 position-relative overflow-hidden ${isActive ? 'active' : ''}`}
    style={{
      transition: "all 0.3s ease",
      padding: "12px",
      minHeight: "44px",
      ...style
    }}
    onMouseEnter={() => setIsButtonHovered(true)}
    onMouseLeave={() => setIsButtonHovered(false)}
    data-keybind-id={keybindId}
  >
        <div className="d-flex align-items-center w-100">
          <i className={`bi bi-${icon}`} 
             style={{ 
                 fontSize: "1.2rem", 
                 minWidth: "24px",
                 transition: "color 0.3s ease"
             }} />
          <span 
              className="fw-medium ms-3"
              style={{
                  opacity: isOpen ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between"
              }}
          > 
            {name} {/* <span className="border bg-light-subtle pe-1 ps-1" style={{marginRight: "15px"}}>{keybindLabel}</span> */}
          </span>
        </div>
        
        {/* Indicador de ativo */}
        {isActive && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-3"
                 style={{
                     opacity: isOpen ? 1 : 0,
                     transition: "opacity 0.3s ease"
                 }}>
                <div className="bg-primary rounded-circle" 
                     style={{ 
                         width: "6px", 
                         height: "6px"
                     }}></div>
            </div>
        )}
    </Link>
    );
}


function SideBar() {
    const [isHovered, setIsHovered] = useState(false);
    const sidebarWidth = isHovered ? "240px" : "70px"; // Largura do sidebar

  const menuItems = [
    { path: '/', icon: 'house-fill', label: 'Início', keybindId: 'sidebar-1', keybindLabel: "Alt+1" },
    { path: '/passengers', icon: 'people-fill', label: 'Passageiros', keybindId: 'sidebar-2', keybindLabel: "Alt+2" },
    { path: '/drivers', icon: 'person-fill-gear', label: 'Motoristas', keybindId: 'sidebar-3', keybindLabel: "Alt+3" },
    { path: '/vehicles', icon: 'car-front-fill', label: 'Veículos', keybindId: 'sidebar-4', keybindLabel: "Alt+4" },
    { path: '/routes', icon: 'signpost-split-fill', label: 'Rotas', keybindId: 'sidebar-5', keybindLabel: "Alt+5" },
    { path: '/stops', icon: 'geo-alt-fill', label: 'Pontos', keybindId: 'sidebar-6', keybindLabel: "Alt+6" },
    { path: '/notifications', icon: 'bell-fill', label: 'Avisos', keybindId: 'sidebar-7', keybindLabel: "Alt+7" },
    { path: '/demo', icon: 'lock-fill', label: 'Demonstração', keybindId: 'sidebar-demo', keybindLabel: "Alt+D" },
    { path: '/reports', icon: 'graph-up', label: 'Relatórios', keybindId: 'sidebar-8', keybindLabel: "Alt+8" },
    { path: '/settings', icon: 'gear-fill', label: 'Configurações', keybindId: 'sidebar-9', keybindLabel: "Alt+9" }
  ];

    return (
      <aside
        id="sidebar"
        className="d-flex flex-column shadow-sm"
        style={{
          height: "100vh",
          width: sidebarWidth,
          transition: "width 0.3s ease",
          overflow: "hidden",
          flexShrink: 0,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header da Sidebar */}
        <div className="sidebar-header border-bottom p-3">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-center">
              <img src="/logo.svg" alt="Logo" className="logo-primary" style={{ width: "40px", height: "40px" }} />
            </div>
            <h5 className="sidebar-title mb-0 fw-bold ms-3"
                style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    whiteSpace: "nowrap"
                }}>
                BusHere!
            </h5>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-grow-1 p-2">
          {menuItems.slice(0, -1).map((item) => (
            <SideButton
              key={item.path}
              name={item.label}
              icon={item.icon}
              href={item.path}
              isOpen={isHovered}
              keybindId={item.keybindId}
              keybindLabel={item.keybindLabel}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer p-2 border-top">
          <SideButton
            name={menuItems[menuItems.length - 1].label}
            icon={menuItems[menuItems.length - 1].icon}
            href={menuItems[menuItems.length - 1].path}
            isOpen={isHovered}
            keybindId={menuItems[menuItems.length - 1].keybindId}
            keybindLabel={menuItems[menuItems.length - 1].keybindLabel}
          />
        </div>
      </aside>
    );
}


export default SideBar