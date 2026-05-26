import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState, useEffect, useRef} from 'react'

import { AuthProvider } from "./context/authContext";
import { KeybindProvider } from "./context/KeybindContext";
import PopUpComponent from "./components/core/feedback/PopUpComponent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PassengersPage from "./pages/PassengersPage";
import DriversPage from "./pages/DriversPage";
import VehiclesPage from "./pages/VehiclesPage";
import RoutesPage from "./pages/RoutesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import StopsPage from "./pages/StopsPage";
import DemoPage from "./pages/DemoPage";
import ErrorPage from "./pages/ErrorPage";

import PassengerDetail from "./pages/details/PassengerDetail";
import DriverDetail from "./pages/details/DriverDetail";
import VehicleDetail from "./pages/details/VehicleDetail";
import RouteDetail from "./pages/details/RouteDetail";
import StopDetail from "./pages/details/StopDetail";
import RouteStopsPage from "./pages/RouteStopsPage";

import SideBar from "./components/core/layout/SideBar";
import Header from "./components/core/layout/Header";


// Funçãoa para forçar o tema escuro nas páginas de login e registro
function ThemeEnforcer({ isDark, setIsDark }) {
  const location = useLocation();
  const previousThemeRef = useRef(null);

  useEffect(() => {
    const pathname = location.pathname || "";
    const isForcedDarkPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (isForcedDarkPage) {
      if (previousThemeRef.current === null) {
        const saved = localStorage.getItem('theme');
        previousThemeRef.current = saved ?? 'light';
      }
      if (!isDark) {
        setIsDark(true);
      }
    } else {
      if (previousThemeRef.current !== null) {
        const prev = previousThemeRef.current;
        previousThemeRef.current = null;
        setIsDark(prev === 'dark');
      }
    }
  }, [location.pathname]);

  return null;
}

function App({ isDark, setIsDark }) {
  const [pageName, setPageName] = useState("Giraldi");
  const [showSideBar, setShowSideBar] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  // funcoes de navegação para serem usadas pelas paginas
  const pageFunctions = {
    setPageName: (newName) => setPageName(newName),
    getPageName: () => pageName,

    setShowSideBar: (show) => setShowSideBar(show),
    getShowSideBar: () => showSideBar,
    toggleShowSideBar: () => setShowSideBar(!showSideBar),

    setShowHeader: (show) => setShowHeader(show),
    getShowHeader: () => showHeader,
    toggleShowHeader: () => setShowHeader(!showHeader),

    // Função para definir o nome da página, visibilidade da barra lateral e do cabeçalho
    set: (newPageName, newShowSideBar, newShowHeader) => {
      setPageName(newPageName ?? pageName);
      setShowSideBar(newShowSideBar ?? showSideBar);
      setShowHeader(newShowHeader ?? showHeader);
    }
  }
  return (
    <Router>
      <AuthProvider>
        <KeybindProvider>
          <ThemeEnforcer isDark={isDark} setIsDark={setIsDark} />
          <div className="d-flex w-100" style={{overflow: "hidden", height:"100vh"}}>
            {showSideBar && <SideBar/>}
            <main className="flex-grow-1 d-flex flex-column" style={{overflow: "auto", height: "100vh"}}>
              {showHeader && <Header pageName={pageName}/>}
              <div className="py-0 w-100 flex-grow-1" style={{minHeight: "0"}}>
                <Routes>
                  <Route path="/" index element={<HomePage pageFunctions={pageFunctions} />} />
                  <Route path="/passengers" element={<PassengersPage pageFunctions={pageFunctions}/>} />
                  <Route path="/drivers" element={<DriversPage pageFunctions={pageFunctions}/>} />
                  <Route path="/vehicles" element={<VehiclesPage pageFunctions={pageFunctions}/>} />
                  <Route path="/routes" element={<RoutesPage pageFunctions={pageFunctions}/>} />
                  <Route path="/stops" element={<StopsPage pageFunctions={pageFunctions} isDark={isDark}/>} />
                  <Route path="/notifications" element={<NotificationsPage pageFunctions={pageFunctions}/>} />
                  <Route path="/demo" element={<DemoPage pageFunctions={pageFunctions}/>} />
                  <Route path="/reports" element={<ReportsPage pageFunctions={pageFunctions}/>} />
                  <Route path="/settings" element={<SettingsPage pageFunctions={pageFunctions} isDark={isDark} setIsDark={setIsDark}/>} />
                  <Route path="/vehicles/:vehicleId" element={<VehicleDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/passengers/:passengerId" element={<PassengerDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/drivers/:driverId" element={<DriverDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/routes/:routeId" element={<RouteDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/stops/:stopId" element={<StopDetail pageFunctions={pageFunctions}/>} />
                  <Route path="/routes/new" element={<RouteStopsPage pageFunctions={pageFunctions} isDark={isDark}/>} />
                  <Route path="/routes/:routeId/edit" element={<RouteStopsPage pageFunctions={pageFunctions} isDark={isDark}/>} />
                  <Route path="/search/:searchTerm" element={<SearchPage pageFunctions={pageFunctions}  />} />
                  <Route path="/login" element={<LoginPage pageFunctions={pageFunctions}/>} />
                  <Route path="/register" element={<RegisterPage pageFunctions={pageFunctions}/>} />
                  <Route path="/error" element={<ErrorPage />} />
                  <Route path="*" element={<Navigate to="/error" />} />
                </Routes>
              </div>
            </main>
          </div>
        </KeybindProvider>
      </AuthProvider>
    </Router>
  );
}



export default App
