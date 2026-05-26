import React, { useState, useEffect, useCallback } from 'react';
import { CONSTANTS } from '@web/utils/routeStopsUtils';
import { ExistingStopPopup, SelectedStopPopup } from '@web/components/features/route-planning/StopPopups';
import { useRouting } from './useRouting';
import { useAdvancedRouteStats } from './useAdvancedRouteStats';

/**
 * Hook para gerar marcadores do mapa
 */
export const useMapMarkers = (stops, pontosSelecionados, handlers, useRealRoutes = true) => {
    const { handleSelectExistingStop, handleRemoveStop } = handlers;
    const { calculateRealRoute, combineRouteSegments, loading: routingLoading, cacheStats } = useRouting();
    const { calculateAdvancedRouteStats } = useAdvancedRouteStats();
    const [realRouteCoordinates, setRealRouteCoordinates] = useState([]);
    const [routeSegments, setRouteSegments] = useState([]);
    const [advancedStats, setAdvancedStats] = useState(null);
    const [currentSpeed, setCurrentSpeed] = useState(50); // Estado para velocidade atual

    // Efeito para calcular rota real quando os pontos mudam
    useEffect(() => {
        const calculateRoute = async () => {
            // Validar pontos antes de calcular rota
            const pontosValidos = pontosSelecionados && pontosSelecionados.filter(p => 
                p && !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude))
            );

            if (useRealRoutes && pontosValidos && pontosValidos.length >= 2) {
                try {
                    const segments = await calculateRealRoute(pontosValidos, 'osrm');
                    const combinedCoordinates = combineRouteSegments(segments);
                    
                    setRealRouteCoordinates(combinedCoordinates);
                    setRouteSegments(segments);
                    
                    // Calcular estatísticas avançadas com rota real
                    const stats = calculateAdvancedRouteStats(pontosValidos, segments, {
                        averageSpeed: currentSpeed, // Usar velocidade atual
                        useRealRoutes: true
                    });
                    setAdvancedStats(stats);
                    
                } catch (error) {
                    console.error('Erro ao calcular rota real:', error);
                    // Fallback para linha reta
                    setRealRouteCoordinates(
                        pontosValidos.map(ponto => [ponto.latitude, ponto.longitude])
                    );
                    setRouteSegments([]);
                    
                    // Calcular estatísticas com linha reta
                    const stats = calculateAdvancedRouteStats(pontosValidos, null, {
                        averageSpeed: currentSpeed,
                        useRealRoutes: false
                    });
                    setAdvancedStats(stats);
                }
            } else if (pontosValidos && pontosValidos.length >= 2) {
                // Modo linha reta
                setRealRouteCoordinates([]);
                setRouteSegments([]);
                
                // Calcular estatísticas com linha reta
                const stats = calculateAdvancedRouteStats(pontosValidos, null, {
                    averageSpeed: currentSpeed,
                    useRealRoutes: false
                });
                setAdvancedStats(stats);
            } else {
                setRealRouteCoordinates([]);
                setRouteSegments([]);
                setAdvancedStats(null);
            }
        };

        calculateRoute();
    }, [pontosSelecionados, useRealRoutes, currentSpeed, calculateRealRoute, combineRouteSegments, calculateAdvancedRouteStats]);

    // Função para alterar a velocidade
    const handleSpeedChange = useCallback((newSpeed) => {
        setCurrentSpeed(newSpeed);
    }, []);

    const markers = [
        // Pontos existentes (azuis) - filtrar os já selecionados
        ...(stops || [])
            .filter(stop => !pontosSelecionados.some(ponto => ponto.ponto_id === stop.ponto_id))
            .map(stop => ({
                id: `stop-${stop.ponto_id}`,
                position: { lat: parseFloat(stop.latitude), lng: parseFloat(stop.longitude) },
                title: stop.nome,
                color: CONSTANTS.MARKER_COLORS.EXISTING_STOP,
                size: CONSTANTS.MARKER_SIZES.EXISTING,
                popupContent: (
                    <ExistingStopPopup 
                        stop={stop} 
                        onAddToRoute={handleSelectExistingStop} 
                    />
                ),
                data: stop
            })),
        // Pontos selecionados (verdes, com numeração)
        ...pontosSelecionados.map((ponto, index) => {
            const marker = {
                id: `selected-${ponto.id}`,
                position: { lat: ponto.latitude, lng: ponto.longitude },
                title: `${index + 1}. ${ponto.nome}`,
                color: CONSTANTS.MARKER_COLORS.SELECTED_STOP,
                size: CONSTANTS.MARKER_SIZES.SELECTED,
                popupContent: (
                    <SelectedStopPopup 
                        ponto={ponto} 
                        index={index} 
                        onRemoveFromRoute={handleRemoveStop} 
                    />
                ),
                data: ponto
            };
            
            // Debug: Verificar se marcador verde está sendo criado
            if (pontosSelecionados.length > 0 && index === 0) {
                console.log('Primeiro marcador selecionado:', marker);
            }
            
            return marker;
        })
    ];

    // Polylines para conectar os pontos selecionados
    const polylines = pontosSelecionados.length >= 2 ? [{
        positions: useRealRoutes && realRouteCoordinates.length > 0 
            ? realRouteCoordinates 
            : pontosSelecionados.map(ponto => [ponto.latitude, ponto.longitude]),
        ...CONSTANTS.POLYLINE_CONFIG,
        // Adicionar estilo diferente se estiver carregando
        ...(routingLoading && useRealRoutes ? { 
            color: '#ffc107', 
            dashArray: '5, 10',
            opacity: 0.6 
        } : {})
    }] : [];

    return { 
        markers, 
        polylines, 
        routingLoading, 
        useRealRoutes: useRealRoutes && realRouteCoordinates.length > 0,
        cacheStats,
        advancedStats, // Novas estatísticas avançadas
        currentSpeed, // Velocidade atual
        handleSpeedChange // Função para mudar velocidade
    };
};
