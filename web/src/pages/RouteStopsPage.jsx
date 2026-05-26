import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useStops, 
  useNotification, 
  useRouteWithStops, 
  useMapMarkers 
} from '@web/hooks';
import { CONSTANTS, centerMapWithStops } from '@web/utils/routeStopsUtils';
import MapComponent from '@web/components/core/layout/MapComponent';
import PainelControle from '@web/components/features/route-planning/PainelControle';
import LoadingSpinner from '@web/components/common/feedback/LoadingSpinner';
import ErrorAlert from '@web/components/common/feedback/ErrorAlert';
import PopUpComponent from '@web/components/core/feedback/PopUpComponent';
import TutorialContent from '@web/components/features/route-planning/TutorialContent';
import FloatingInstructions from '@web/components/features/route-planning/FloatingInstructions';
import FloatingPointsCounter from '@web/components/features/route-planning/FloatingPointsCounter';
import FloatingMobileButton from '@web/components/features/route-planning/FloatingMobileButton';
import MobileControlPanel from '@web/components/features/route-planning/MobileControlPanel';
import { RouteControls } from '@web/components/features/route-planning/RouteControls';

/**
 * @typedef {Object} PontoSelecionado
 * @property {string} id
 * @property {number} [ponto_id]
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} nome
 * @property {number} ordem
 * @property {string} [logradouro]
 * @property {string} [bairro]
 * @property {string} [cidade]
 * @property {string} [horario_previsto_passagem] - Horário previsto de passagem no formato HH:MM
 */

/**
 * @typedef {Object} Rota
 * @property {string} nome
 * @property {PontoSelecionado[]} pontos
 * @property {number} distanciaTotal
 * @property {number} tempoEstimado
 */

function RouteStopsPage({ pageFunctions, isDark }) {
    const navigate = useNavigate();
    const { routeId } = useParams(); // Para capturar ID da rota em caso de edição
    const isEditMode = Boolean(routeId); // Determina se está em modo de edição
    
    const { stops, loading: stopsLoading, error: stopsError } = useStops();
    const { showNotification } = useNotification();
    
    // Refs
    const popUpRef = useRef(null);
    const mapRef = useRef(null);

    // Estados da aplicação
    const [pontosSelecionados, setPontosSelecionados] = useState([]);
    const [rota, setRota] = useState(null);
    const [instructionsMinimized, setInstructionsMinimized] = useState(false);
    const [mapCenter, setMapCenter] = useState([CONSTANTS.MAP_CENTER.lat, CONSTANTS.MAP_CENTER.lng]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [useRealRoutes, setUseRealRoutes] = useState(true);

    // Hook unificado para gerenciar rotas e handlers
    const { 
        loading: routeLoading, 
        error: routeError, 
        createRouteWithStops,
        updateRouteWithAssignment,
        getRouteWithAssignments,
        calculateRouteStats,
        setError: setRouteError,
        handleSelectExistingStop,
        handleRemoveStop,
        handleClearAll
    } = useRouteWithStops(
        pontosSelecionados, 
        setPontosSelecionados, 
        showNotification, 
        mapRef
    );

    // Objeto de handlers para compatibilidade com useMapMarkers
    const routeHandlers = {
        handleSelectExistingStop,
        handleRemoveStop,
        handleClearAll
    };

    // Marcadores e polylines do mapa
    const { markers, polylines, routingLoading, cacheStats, advancedStats, currentSpeed, handleSpeedChange } = useMapMarkers(stops, pontosSelecionados, routeHandlers, useRealRoutes);

    // Handler para abrir o tutorial
    const handleOpenTutorial = () => {
        if (popUpRef.current) {
            const tutorialTitle = isEditMode 
                ? 'Tutorial - Edição de Rotas' 
                : 'Tutorial - Criação de Rotas';
            
            popUpRef.current.show({
                content: (props) => <TutorialContent {...props} />,
                title: tutorialTitle
            });
        }
    };

    // Handler para minimizar/expandir instruções
    const toggleInstructions = () => {
        setInstructionsMinimized(prev => !prev);
    };

    // Efeito para configurar página
    useEffect(() => {
        const pageTitle = isEditMode ? "Editar Rota" : "Nova Rota";
        pageFunctions.set(pageTitle, true, true);
    }, [pageFunctions, isEditMode]);

    // Efeito para detectar mudanças no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 992;
            setIsMobile(newIsMobile);
            
            // Fechar offcanvas se mudou para desktop
            if (!newIsMobile) {
                const offcanvasElement = document.getElementById('mobileControls');
                if (offcanvasElement) {
                    const offcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvasElement);
                    if (offcanvas) {
                        offcanvas.hide();
                    }
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Efeito para carregar dados da rota em modo de edição
    useEffect(() => {
        if (isEditMode && routeId && !initialDataLoaded) {
            loadRouteData();
        }
    }, [isEditMode, routeId, initialDataLoaded]);

    // Função para carregar dados da rota existente
    const loadRouteData = async () => {
        try {
            setRouteError(null);
            const routeData = await getRouteWithAssignments(routeId);
            
            if (routeData.success) {
                const route = routeData.data;
                
                // Definir dados básicos da rota
                setRota({
                    nome: route.nome,
                    codigo_rota: route.codigo_rota,
                    origem_descricao: route.origem_descricao,
                    destino_descricao: route.destino_descricao,
                    distancia_km: route.distancia_km,
                    tempo_viagem_estimado_minutos: route.tempo_viagem_estimado_minutos,
                    status_rota_id: route.status_rota_id,
                    ativo: route.ativo,
                    veiculo_id: route.veiculo_id,
                    motorista_id: route.motorista_id,
                    observacoes_assignment: route.observacoes_assignment || ''
                });

                // Carregar pontos da rota se existirem
                if (route.pontos && route.pontos.length > 0) {
                    const pontosFormatados = route.pontos.map((ponto, index) => {
                        const formatted = {
                            id: `stop-selected-${ponto.ponto_id}`,
                            ponto_id: ponto.ponto_id,
                            latitude: parseFloat(ponto.latitude),
                            longitude: parseFloat(ponto.longitude),
                            nome: ponto.nome,
                            ordem: ponto.ordem || index + 1,
                            logradouro: ponto.logradouro || '',
                            bairro: ponto.bairro || '',
                            cidade: ponto.cidade || '',
                            horario_previsto_passagem: ponto.horario_previsto_passagem || ''
                        };
                        
                        // Debug: verificar se coordenadas são válidas
                        if (isNaN(formatted.latitude) || isNaN(formatted.longitude)) {
                            console.warn(`Ponto ${ponto.nome} tem coordenadas inválidas:`, {
                                latitude: ponto.latitude,
                                longitude: ponto.longitude
                            });
                        }
                        
                        return formatted;
                    });

                    // Ordenar pontos pela ordem
                    pontosFormatados.sort((a, b) => a.ordem - b.ordem);
                    
                    console.log('Pontos formatados carregados para edição:', {
                        quantidade: pontosFormatados.length,
                        primeiroPonto: pontosFormatados[0],
                        todos: pontosFormatados
                    });
                    
                    setPontosSelecionados(pontosFormatados);

                    // Centralizar mapa nos pontos da rota
                    if (pontosFormatados.length > 0) {
                        const center = centerMapWithStops(pontosFormatados);
                        setMapCenter(center);
                    }
                }

                setInitialDataLoaded(true);
                showNotification(`Dados da rota "${route.nome}" carregados para edição`, 'success');
            } else {
                setRouteError(routeData.error || 'Erro ao carregar dados da rota');
                showNotification('Erro ao carregar dados da rota', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar rota:', error);
            setRouteError('Erro inesperado ao carregar dados da rota');
            showNotification('Erro inesperado ao carregar dados da rota', 'error');
        }
    };

    // Efeito para centralizar o mapa com base nos pontos existentes
    useEffect(() => {
        const novoCenter = centerMapWithStops(stops);
        setMapCenter(novoCenter);
    }, [stops]);

    // Handler para salvar rota (criação ou atualização)
    const handleSalvarRota = async (dadosRota) => {
        try {
            setRouteError(null);

            // Usar estatísticas avançadas se disponíveis, senão calcular básicas
            const stats = advancedStats || calculateRouteStats(pontosSelecionados);
            
            // Preparar pontos para envio ao backend
            const pontosParaBackend = pontosSelecionados.map(ponto => ({
                ponto_id: ponto.ponto_id,
                ordem: ponto.ordem,
                horario_previsto_passagem: ponto.horario_previsto_passagem || null
            }));
            
            // Adicionar estatísticas e pontos aos dados da rota
            const rotaComEstatisticas = {
                ...dadosRota,
                distancia_km: stats.totalDistance.toFixed(2), // Garantir formato correto
                tempo_viagem_estimado_minutos: Math.round(stats.estimatedTime),
                pontos: pontosParaBackend
            };

            let resultado;

            if (isEditMode) {
                // Modo de edição - atualizar rota existente
                resultado = await updateRouteWithAssignment(routeId, rotaComEstatisticas);
            } else {
                // Modo de criação - criar nova rota
                resultado = await createRouteWithStops(rotaComEstatisticas);
            }

            if (resultado.success) {
                const action = isEditMode ? 'atualizada' : 'criada';
                showNotification(resultado.message || `Rota ${action} com sucesso!`, 'success');

                // Limpar formulário e voltar para página de rotas
                if (!isEditMode) {
                    setPontosSelecionados([]);
                    setRota(null);
                }
                
                setTimeout(() => {
                    if (isEditMode) {
                        navigate(-1); // Voltar para a página anterior
                    } else {
                        navigate('/routes'); // Voltar para lista de rotas
                    }
                }, 1500);
            } else {
                showNotification(resultado.error, 'error');
            }

        } catch (error) {
            console.error('Erro inesperado ao salvar rota:', error);
            const action = isEditMode ? 'atualizar' : 'salvar';
            showNotification(`Erro inesperado ao ${action} rota`, 'error');
        }
    };

    // Renderização
    if (stopsLoading || (isEditMode && !initialDataLoaded)) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <LoadingSpinner />
                <div className="ms-3">
                    {stopsLoading ? 'Carregando pontos...' : 'Carregando dados da rota...'}
                </div>
            </div>
        );
    }

    if (stopsError) {
        return (
            <div className="container mt-4">
                <ErrorAlert 
                    message={`Erro ao carregar pontos: ${stopsError}`}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="route-stops-page w-100 h-100 d-flex flex-column flex-lg-row position-relative">
            {/* Painel de Controle Desktop */}
            <div 
                className="painel-controle d-none d-lg-block border-end" 
                style={{ 
                    width: CONSTANTS.FLOATING_ELEMENTS.PANEL_WIDTH, 
                    minWidth: CONSTANTS.FLOATING_ELEMENTS.PANEL_MIN_WIDTH 
                }}
            >
                <PainelControle
                    pontosSelecionados={pontosSelecionados}
                    setPontosSelecionados={setPontosSelecionados}
                    onSalvarRota={handleSalvarRota}
                    onLimparTudo={routeHandlers.handleClearAll}
                    loading={routeLoading}
                    rota={rota}
                    setRota={setRota}
                    instanceId="desktop"
                    initialData={rota}
                    isEditMode={isEditMode}
                    useRealRoutes={useRealRoutes}
                    onToggleRealRoutes={setUseRealRoutes}
                    routingLoading={routingLoading}
                    cacheStats={cacheStats}
                    advancedStats={advancedStats}
                    currentSpeed={currentSpeed}
                    onSpeedChange={handleSpeedChange}
                />
            </div>

            {/* Painel Mobile */}
            <MobileControlPanel
                pontosSelecionados={pontosSelecionados}
                setPontosSelecionados={setPontosSelecionados}
                onSalvarRota={handleSalvarRota}
                onLimparTudo={routeHandlers.handleClearAll}
                loading={routeLoading}
                rota={rota}
                setRota={setRota}
                initialData={rota}
                isEditMode={isEditMode}
                useRealRoutes={useRealRoutes}
                onToggleRealRoutes={setUseRealRoutes}
                routingLoading={routingLoading}
                cacheStats={cacheStats}
                advancedStats={advancedStats}
            />

            {/* Mapa */}
            <div className="map-container flex-grow-1 position-relative">
                {/* Alertas de erro */}
                {routeError && (
                    <div className="floating-element position-absolute top-0 start-0 end-0 p-3">
                        <ErrorAlert 
                            message={routeError}
                            onClose={() => setRouteError(null)}
                        />
                    </div>
                )}

                {/* Loading de salvamento */}
                {routeLoading && (
                    <div className="floating-element high-priority position-absolute top-50 start-50 translate-middle">
                        <div className="bg-white rounded p-3 shadow-lg text-center">
                            <LoadingSpinner size="sm" />
                            <div className="mt-2 text-primary fw-bold">Salvando rota...</div>
                        </div>
                    </div>
                )}

                {/* Componente do Mapa */}
                <MapComponent 
                    ref={mapRef}
                    className='w-100 h-100' 
                    center={mapCenter}
                    zoom={CONSTANTS.MAP_ZOOM}
                    markers={markers}
                    polylines={polylines}
                    isDark={isDark}
                />

                {/* Elementos flutuantes */}
                <FloatingMobileButton pontosSelecionados={pontosSelecionados} />
                
                <FloatingInstructions
                    instructionsMinimized={instructionsMinimized}
                    onToggleInstructions={toggleInstructions}
                    onOpenTutorial={handleOpenTutorial}
                />

                <FloatingPointsCounter pontosSelecionados={pontosSelecionados} />

                {/* Controles de Roteamento */}
                {pontosSelecionados.length >= 2 && (
                    <div 
                        className="position-absolute" 
                        style={{ 
                            bottom: '120px', 
                            right: '20px', 
                            zIndex: 1000,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                            border: '1px solid #dee2e6'
                        }}
                    >
                        <RouteControls
                            useRealRoutes={useRealRoutes}
                            onToggleRealRoutes={setUseRealRoutes}
                            routingLoading={routingLoading}
                            cacheStats={cacheStats}
                            size="compact"
                        />
                    </div>
                )}
            </div>

            {/* PopUp Component para Tutorial */}
            <PopUpComponent ref={popUpRef} />
        </div>
    );
}

export default RouteStopsPage;