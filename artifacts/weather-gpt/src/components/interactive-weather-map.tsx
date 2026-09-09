import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Compass,
  Crosshair,
  Layers,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Radio,
  RotateCcw,
  ShieldAlert,
  SunMedium,
  CloudRain,
  Palette,
  ArrowLeft,
} from 'lucide-react';
import {
  MapAlertItem,
  MAP_THEMES,
  PAN_INDIA_WEATHER_STATIONS,
  getAlertIconSvg,
  getSeverityColors,
  getWeatherConditionSvg,
  resolveCoordinates,
} from '@/lib/india-map-utils';

interface InteractiveWeatherMapProps {
  alerts: MapAlertItem[];
  selectedId: string | null;
  onSelectAlert: (id: string) => void;
  className?: string;
  initialLayer?: 'alerts' | 'weather' | 'radar';
}

const INDIA_CENTER: [number, number] = [22.8, 82.0];
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [37.5, 97.5],
];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [4.0, 64.0],
  [39.0, 100.0],
];

export function InteractiveWeatherMap({
  alerts,
  selectedId,
  onSelectAlert,
  className = '',
  initialLayer = 'alerts',
}: InteractiveWeatherMapProps) {
  const rootWrapperRef = useRef<HTMLDivElement | null>(null);
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radarLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [activeTheme, setActiveTheme] = useState<'voyager' | 'light' | 'dark'>('voyager');
  const [activeLayer, setActiveLayer] = useState<'alerts' | 'weather' | 'radar'>(initialLayer);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [boundaryLoaded, setBoundaryLoaded] = useState(false);
  const [boundaryError, setBoundaryError] = useState(false);
  const [userLocating, setUserLocating] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapCanvasRef.current || mapRef.current) return;

    const isMobile = window.innerWidth < 640;
    const initialZoom = isMobile ? 4.2 : 4.8;

    const map = L.map(mapCanvasRef.current, {
      center: INDIA_CENTER,
      zoom: initialZoom,
      minZoom: 3.8,
      maxZoom: 14,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 0.85,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Tile Layer
    const theme = MAP_THEMES[activeTheme] || MAP_THEMES.voyager;
    const tileLayer = L.tileLayer(theme.tileUrl, {
      subdomains: theme.subdomains,
      maxZoom: theme.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer groups
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    const radarGroup = L.layerGroup().addTo(map);
    radarLayerRef.current = radarGroup;

    // Fetch and overlay official Survey of India boundary
    fetch('/data/india-soi-boundary.json')
      .then((res) => {
        if (!res.ok) throw new Error('Boundary fetch failed');
        return res.json();
      })
      .then((geoJson) => {
        if (!mapRef.current) return;
        const boundary = L.geoJSON(geoJson, {
          style: {
            color: '#1f4e5b',
            weight: 2.4,
            opacity: 0.95,
            fillColor: '#1f4e5b',
            fillOpacity: 0.035,
            lineCap: 'round',
            lineJoin: 'round',
          },
          interactive: false,
        }).addTo(mapRef.current);
        boundaryLayerRef.current = boundary;
        setBoundaryLoaded(true);
      })
      .catch((err) => {
        console.warn('Could not load Survey of India boundary GeoJSON:', err);
        setBoundaryError(true);
      });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      boundaryLayerRef.current = null;
      markersLayerRef.current = null;
      radarLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // Update Tile Theme
  useEffect(() => {
    if (!mapRef.current) return;
    const theme = MAP_THEMES[activeTheme] || MAP_THEMES.voyager;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const newTileLayer = L.tileLayer(theme.tileUrl, {
      subdomains: theme.subdomains,
      maxZoom: theme.maxZoom,
    }).addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;

    // Keep boundary on top of tiles
    if (boundaryLayerRef.current) {
      boundaryLayerRef.current.bringToFront();
    }
  }, [activeTheme]);

  // Render Markers according to active layer & selectedId
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerRef.current;
    const radarGroup = radarLayerRef.current;
    if (!map || !markersGroup || !radarGroup) return;

    markersGroup.clearLayers();
    radarGroup.clearLayers();

    // 1. Alert Signals Layer
    if (activeLayer === 'alerts' || activeLayer === 'radar') {
      alerts.forEach((alert, index) => {
        const coords = alert.lat && alert.lng ? [alert.lat, alert.lng] : resolveCoordinates(alert.location, index);
        const colors = getSeverityColors(alert.severity, alert.color);
        const iconSvg = getAlertIconSvg(alert.type);
        const isSelected = alert.id === selectedId;

        const html = `
          <div class="alert-leaflet-marker ${isSelected ? 'is-selected' : ''}" style="--pulse-color: ${colors.bg};">
            <div class="alert-marker-pulse-ring"></div>
            <div class="alert-marker-core-badge" style="--badge-bg: ${colors.bg};">
              ${iconSvg}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-alert-icon-wrapper',
          html,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(coords as [number, number], { icon: customIcon });

        // Themed Popup
        const popupContent = document.createElement('div');
        popupContent.className = 'p-4 max-w-[270px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full" style="background-color: ${colors.bg}22; color: ${colors.bg}; font-weight: 700;">
              ${alert.severity}
            </span>
            <span class="text-[10px] text-muted-foreground font-mono">${alert.type}</span>
          </div>
          <h4 class="font-bold text-sm tracking-tight text-foreground leading-snug">${alert.title}</h4>
          <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">${alert.description}</p>
          <div class="mt-3.5 pt-2.5 border-t border-border flex items-center justify-between text-xs">
            <span class="text-[11px] text-muted-foreground font-medium truncate max-w-[140px]">${alert.location}</span>
            <button class="popup-inspect-btn font-semibold text-[hsl(var(--primary))] hover:underline flex items-center gap-1 cursor-pointer">
              Inspect →
            </button>
          </div>
        `;

        popupContent.querySelector('.popup-inspect-btn')?.addEventListener('click', () => {
          onSelectAlert(alert.id);
          marker.closePopup();
        });

        marker.bindPopup(popupContent, {
          className: 'custom-leaflet-popup',
          offset: [0, -10],
          closeButton: true,
        });

        marker.on('click', () => {
          onSelectAlert(alert.id);
        });

        markersGroup.addLayer(marker);
      });
    }

    // 2. Live Weather Stations Layer
    if (activeLayer === 'weather') {
      PAN_INDIA_WEATHER_STATIONS.forEach((station) => {
        const iconSvg = getWeatherConditionSvg(station.icon);

        const html = `
          <div class="station-leaflet-marker">
            <div class="station-marker-pill">
              <span class="station-marker-icon-wrap">${iconSvg}</span>
              <span>${station.temperature}°</span>
            </div>
          </div>
        `;

        const stationIcon = L.divIcon({
          className: 'custom-station-icon-wrapper',
          html,
          iconSize: [80, 28],
          iconAnchor: [40, 14],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([station.lat, station.lng], { icon: stationIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-4 min-w-[220px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">${station.state}</span>
            <span class="text-xs font-bold text-primary">${station.temperature}°C</span>
          </div>
          <h4 class="font-bold text-sm tracking-tight text-foreground">${station.name}</h4>
          <p class="text-xs text-muted-foreground mt-0.5">${station.condition}</p>
          <div class="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border text-[11px]">
            <div><span class="text-muted-foreground block text-[9px] uppercase">Feels Like</span><span class="font-semibold">${station.feelsLike}°C</span></div>
            <div><span class="text-muted-foreground block text-[9px] uppercase">Humidity</span><span class="font-semibold">${station.humidity}%</span></div>
            <div><span class="text-muted-foreground block text-[9px] uppercase">Wind</span><span class="font-semibold">${station.windSpeed} km/h</span></div>
            <div><span class="text-muted-foreground block text-[9px] uppercase">Rain Prob</span><span class="font-semibold">${station.rainChance}%</span></div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: 'custom-leaflet-popup',
          offset: [0, -8],
          closeButton: true,
        });

        markersGroup.addLayer(marker);
      });
    }

    // 3. Rain & Radar Precipitation Overlay
    if (activeLayer === 'radar') {
      const rainZones = [
        { lat: 27.5, lng: 94.8, radius: 140000, intensity: 'Heavy Rain Watch (Assam / NE)' },
        { lat: 19.8, lng: 85.9, radius: 120000, intensity: 'Cyclone Circulation (Bay of Bengal)' },
        { lat: 10.2, lng: 76.4, radius: 95000, intensity: 'Active Monsoon Pulse (Kerala Coast)' },
      ];

      rainZones.forEach((zone) => {
        const circle = L.circle([zone.lat, zone.lng], {
          radius: zone.radius,
          color: '#1f6472',
          fillColor: '#2b8294',
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '4, 6',
        });
        circle.bindTooltip(`🌧️ ${zone.intensity}`, {
          permanent: false,
          direction: 'top',
          className: 'text-xs font-semibold px-2 py-1 rounded bg-card text-foreground border border-border shadow-md',
        });
        radarGroup.addLayer(circle);
      });
    }
  }, [activeLayer, alerts, selectedId, onSelectAlert]);

  // Pan smoothly when selectedId changes from external controls
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const alert = alerts.find((a) => a.id === selectedId);
    if (!alert) return;

    const index = alerts.findIndex((a) => a.id === selectedId);
    const coords = alert.lat && alert.lng ? [alert.lat, alert.lng] : resolveCoordinates(alert.location, index);

    mapRef.current.flyTo(coords as [number, number], Math.max(mapRef.current.getZoom(), 5.5), {
      duration: 0.9,
      easeLinearity: 0.25,
    });
  }, [selectedId, alerts]);

  // Reset to India full extent
  const handleResetView = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(INDIA_BOUNDS, {
      padding: [25, 25],
      animate: true,
      duration: 0.8,
    });
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.zoomOut();
  }, []);

  // Geolocation
  const handleLocateMe = useCallback(() => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setUserLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const map = mapRef.current;
        if (!map) return;

        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        const userMarker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#1f4e5b',
          fillOpacity: 0.9,
          color: '#ffffff',
          weight: 2.5,
        }).addTo(map);

        userMarker.bindPopup('<div class="p-2 text-xs font-semibold">📍 Your current location</div>', {
          className: 'custom-leaflet-popup',
        });

        userMarkerRef.current = userMarker;
        map.flyTo([lat, lng], 8, { duration: 1.2 });
      },
      (err) => {
        setUserLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not detect location. Please check browser location permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }, []);

  // Fullscreen toggle with fallback
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const nextState = !prev;
      if (nextState) {
        if (rootWrapperRef.current?.requestFullscreen) {
          rootWrapperRef.current.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      }
      return nextState;
    });

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 350);
  }, []);

  // Listen for fullscreen change & Escape key
  useEffect(() => {
    const handleFsChange = () => {
      const isNativeFs = Boolean(document.fullscreenElement);
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, toggleFullscreen]);

  // Lock body scroll during fullscreen mode to prevent background page dragging
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <div
      ref={rootWrapperRef}
      className={`map-panel map-theme-${activeTheme} relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-[var(--shadow-soft)] transition-all ${
        isFullscreen
          ? 'is-fullscreen fixed inset-0 z-[9999] rounded-none border-0 h-[100dvh] w-screen bg-[#dce9e4]'
          : 'w-full'
      } ${className}`}
    >
      {/* Map Header / Layer & Theme Controls */}
      <div className={`absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none ${isFullscreen ? 'pt-safe' : ''}`}>
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Dedicated prominent Exit Fullscreen button when in Fullscreen */}
          {isFullscreen && (
            <button
              type="button"
              data-testid="button-exit-fullscreen-top"
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer border border-white/25"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Exit Fullscreen</span>
            </button>
          )}

          {/* Layer Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[hsl(var(--card)/0.92)] backdrop-blur-md border border-[hsl(var(--border)/0.8)] shadow-sm">
            <button
              type="button"
              data-testid="button-layer-alerts"
              onClick={() => setActiveLayer('alerts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'alerts'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xs'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Alerts</span>
              <span className="text-[10px] opacity-75 font-mono">({alerts.length})</span>
            </button>

          <button
            type="button"
            data-testid="button-layer-weather"
            onClick={() => setActiveLayer('weather')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'weather'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xs'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <SunMedium className="h-3.5 w-3.5" />
            <span>Stations</span>
          </button>

          <button
            type="button"
            data-testid="button-layer-radar"
            onClick={() => setActiveLayer('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'radar'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xs'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

        {/* Theme and Reset View Controls */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              data-testid="button-theme-toggle"
              onClick={() => setShowThemeMenu((prev) => !prev)}
              aria-label="Toggle map themes"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[hsl(var(--card)/0.9)] backdrop-blur-md border border-[hsl(var(--border)/0.8)] text-xs font-medium text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--card))] transition-colors cursor-pointer"
            >
              <Palette className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <span className="hidden sm:inline text-xs">{MAP_THEMES[activeTheme]?.name}</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-1.5 z-[450] min-w-[140px] rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg p-1 space-y-0.5 animate-in fade-in zoom-in-95">
                {(['voyager', 'light', 'dark'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveTheme(key);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                      activeTheme === key
                        ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] font-semibold'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    {MAP_THEMES[key].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Extent Button */}
          <button
            type="button"
            data-testid="button-reset-view"
            onClick={handleResetView}
            title="Reset to India view"
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-[hsl(var(--card)/0.9)] backdrop-blur-md border border-[hsl(var(--border)/0.8)] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--card))] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Leaflet Map DOM Element */}
      <div
        ref={mapCanvasRef}
        data-testid="interactive-leaflet-map-canvas"
        className="w-full h-full min-h-[420px] sm:min-h-[560px]"
        tabIndex={0}
      />

      {/* Floating Action Map Controls (Bottom-Right) */}
      <div className="absolute right-3 bottom-16 sm:bottom-12 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Zoom In / Out */}
        <div className="flex flex-col rounded-xl overflow-hidden bg-[hsl(var(--card)/0.92)] backdrop-blur-md border border-[hsl(var(--border)/0.8)] shadow-sm">
          <button
            type="button"
            data-testid="button-zoom-in"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="grid h-9 w-9 place-items-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] active:scale-95 transition-all border-b border-[hsl(var(--border)/0.8)] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-testid="button-zoom-out"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="grid h-9 w-9 place-items-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] active:scale-95 transition-all cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Locate Me */}
        <button
          type="button"
          data-testid="button-locate-me"
          onClick={handleLocateMe}
          title="Detect my location"
          disabled={userLocating}
          className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--card)/0.92)] backdrop-blur-md border border-[hsl(var(--border)/0.8)] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--card))] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Crosshair className={`h-4 w-4 ${userLocating ? 'animate-spin text-[hsl(var(--primary))]' : ''}`} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          data-testid="button-fullscreen-toggle"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          className={`grid h-9 w-9 place-items-center rounded-xl backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
            isFullscreen
              ? 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border-white/30 hover:opacity-90'
              : 'bg-[hsl(var(--card)/0.92)] border border-[hsl(var(--border)/0.8)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))]'
          } active:scale-95`}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Official Boundary & Live Status Footer Bar */}
      <div className="absolute right-0 bottom-0 left-0 z-[1000] flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--border)/0.7)] bg-[hsl(var(--card)/0.88)] backdrop-blur-md px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#5a9872] animate-pulse" />
          <span className="font-semibold text-[hsl(var(--foreground))]">
            🇮🇳 Survey of India Sovereign Boundary
          </span>
          {boundaryLoaded && (
            <span className="hidden md:inline-block text-[#5a9872] font-semibold">· Verified</span>
          )}
          {boundaryError && (
            <span className="text-[hsl(var(--destructive))]">· Fallback active</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[9px]">
          <span className="hidden sm:inline">Pinch to zoom · Tap signal to inspect</span>
          <span>&copy; OpenStreetMap · CARTO</span>
        </div>
      </div>
    </div>
  );
}
