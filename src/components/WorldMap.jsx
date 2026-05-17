import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Graticule, Sphere } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const CATEGORIES = [
  { id: 'project',   label: '项目发生地', color: '#6366f1' },
  { id: 'education', label: '教育背景',   color: '#a855f7' },
  { id: 'travel',    label: '游览足迹',   color: '#f59e0b' },
  { id: 'research',  label: '调研地点',   color: '#10b981' },
];

// Centered exactly between Shanghai (31°N, 121°E) and Melbourne (38°S, 145°E)
// midpoint ≈ −3.5°N, 133°E
const INITIAL_ROTATION = [-133, -4, 0];
// page background = slate-50
const BG = '#f8fafc';

const CITY_MARKERS = [
  { id: 'melbourne', city: '墨尔本', subtitle: 'Melbourne · Australia',
    coordinates: [144.9631, -37.8136], categories: ['project', 'education'],
    projectIds: [1,2,3,4,5], note: '博士就读地 · 项目主阵地', radius: 7 },
  { id: 'shanghai', city: '上海', subtitle: 'Shanghai · China',
    coordinates: [121.4737, 31.2304], categories: ['education'],
    projectIds: [], note: '本科就读地', radius: 5 },
  { id: 'sydney', city: '悉尼', subtitle: 'Sydney · Australia',
    coordinates: [151.2093, -33.8688], categories: ['travel'], projectIds: [], radius: 4 },
  { id: 'hongkong', city: '香港', subtitle: 'Hong Kong · China',
    coordinates: [114.1694, 22.3193], categories: ['travel'], projectIds: [], radius: 4 },
  { id: 'tokyo', city: '东京', subtitle: 'Tokyo · Japan',
    coordinates: [139.6917, 35.6895], categories: ['travel'], projectIds: [], radius: 4 },
  { id: 'singapore', city: '新加坡', subtitle: 'Singapore',
    coordinates: [103.8198, 1.3521], categories: ['travel'], projectIds: [], radius: 4 },
  { id: 'beijing', city: '北京', subtitle: 'Beijing · China',
    coordinates: [116.4074, 39.9042], categories: ['research'], projectIds: [], note: '行业调研', radius: 4 },
];

function isVisible(coords, rotation) {
  const r = Math.PI / 180;
  const [lon, lat] = coords;
  const dot =
    Math.sin(lat * r) * Math.sin(-rotation[1] * r) +
    Math.cos(lat * r) * Math.cos(-rotation[1] * r) *
    Math.cos(lon * r - (-rotation[0] * r));
  return dot > 0;
}

export default function WorldMap({ onMarkerSelect }) {
  const [rotation, setRotation]           = useState(INITIAL_ROTATION);
  const [rotationZone, setRotationZone]   = useState(0); // -1 left, 0 stop, +1 right
  const [isDragging, setIsDragging]       = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [isHovering, setIsHovering]       = useState(false);
  const [activeCategories, setActiveCategories] = useState(() => new Set(CATEGORIES.map(c => c.id)));

  const rotationRef    = useRef(INITIAL_ROTATION);
  const lastPosRef     = useRef(null);
  const isDraggingRef  = useRef(false);
  const animRef        = useRef(null);
  const hideTimerRef   = useRef(null);   // delay before panel hides
  const navigate       = useNavigate();

  /* ── Zone-based auto-rotate ───────────────────────────────────── */
  // zone = +1 → rotate right (leftmost 25%), zone = -1 → rotate left (rightmost 25%), 0 = stop
  useEffect(() => {
    if (rotationZone !== 0 && !isDragging) {
      const tick = () => {
        rotationRef.current = [
          rotationRef.current[0] + rotationZone * 0.15,
          rotationRef.current[1],
          rotationRef.current[2],
        ];
        setRotation([...rotationRef.current]);
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    }
    return () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; } };
  }, [rotationZone, isDragging]);

  /* ── Drag handlers ────────────────────────────────────────────── */
  const onMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    // Drag handling
    if (isDraggingRef.current && lastPosRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      rotationRef.current = [
        rotationRef.current[0] + dx * 0.45,
        Math.max(-70, Math.min(70, rotationRef.current[1] - dy * 0.3)),
        rotationRef.current[2],
      ];
      setRotation([...rotationRef.current]);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    // Zone detection: left 25% → +1, right 25% → -1, middle 50% → 0
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0.25) setRotationZone(1);
      else if (ratio > 0.75) setRotationZone(-1);
      else setRotationZone(0);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    lastPosRef.current = null;
  }, []);

  const containerRef = useRef(null);

  const onMouseEnter = useCallback(() => setIsHovering(true), []);
  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotationZone(0);
    isDraggingRef.current = false;
    setIsDragging(false);
    lastPosRef.current = null;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setHoveredMarker(null);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    onMarkerSelect?.(marker);
    if (marker.projectIds?.length > 1) {
      document.getElementById('project-grid')?.scrollIntoView({ behavior: 'smooth' });
    } else if (marker.projectIds?.length === 1) {
      navigate(`/projects/${marker.projectIds[0]}`);
      window.scrollTo(0, 0);
    }
  }, [navigate, onMarkerSelect]);

  const toggleCategory = useCallback((catId) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        if (next.size === 1) return prev; // keep at least one active
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  }, []);

  const visibleMarkers = useMemo(
    () => CITY_MARKERS.filter(m =>
      m.categories.some(c => activeCategories.has(c)) && isVisible(m.coordinates, rotation)
    ),
    [rotation, activeCategories],
  );

  const getCatColor = (catId) => CATEGORIES.find(c => c.id === catId)?.color ?? '#6366f1';
  // primary color = first active category for this marker
  const markerColor = (m) => {
    const first = m.categories.find(c => activeCategories.has(c));
    return getCatColor(first ?? m.categories[0]);
  };

  return (
    <div className="mb-12 max-w-[860px] mx-auto">

      {/* ── Seamless globe backdrop ─────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: 640, cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >

        {/* Globe SVG — 200% wide so sphere boundary extends off-screen (scale 240
            gives radius ≈ 586 px CSS > 550 px half-container → no visible sphere rim) */}
        <div style={{
          position: 'absolute',
          top:  '50%',
          left: '50%',
          width: '200%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}>
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ rotate: rotation, scale: 240 }}
            width={900}
            height={600}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Sphere — transparent; creates clip-path #rsm-sphere */}
            <Sphere fill="transparent" stroke="transparent" strokeWidth={0} />

            <g clipPath="url(#rsm-sphere)">
              {/* Graticule — subtle grid for curvature feel */}
              <Graticule stroke="#cfddf0" strokeWidth={0.55} />

              {/* Land masses */}
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#d9e8f5"
                      stroke="#bfd0e8"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover:   { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
            </g>

            {/* City markers — need pointer-events */}
            <g style={{ pointerEvents: 'auto' }}>
              {visibleMarkers.map((m) => (
                <Marker
                  key={m.id}
                  coordinates={m.coordinates}
                  onMouseEnter={() => {
                    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                    setHoveredMarker(m);
                  }}
                  onMouseLeave={() => {
                    hideTimerRef.current = setTimeout(() => setHoveredMarker(null), 320);
                  }}
                  onClick={() => handleMarkerClick(m)}
                >
                  {/* Pulse ring */}
                  <circle r={m.radius + 7} fill={markerColor(m)} fillOpacity={0.15}>
                    <animate attributeName="r"
                      from={m.radius} to={m.radius + 15}
                      dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity"
                      from="0.4" to="0"
                      dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  {/* Core dot */}
                  <circle
                    r={m.radius} fill={markerColor(m)}
                    stroke="white" strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Label */}
                  <text
                    textAnchor="middle"
                    y={-(m.radius + 9)}
                    style={{
                      fontSize: 11, fontWeight: 700,
                      fill: '#475569',
                      paintOrder: 'stroke',
                      stroke: 'white', strokeWidth: 4,
                      strokeLinecap: 'round', strokeLinejoin: 'round',
                      pointerEvents: 'none',
                    }}
                  >
                    {m.city}
                  </text>
                </Marker>
              ))}
            </g>
          </ComposableMap>
        </div>

        {/* ── Circular edge fade — matches the sphere's round shape ──────────────── */}
        {/* Container is ~1100×640. To get equal CSS-pixel fade radius (~264px):      */}
        {/*   horiz 56% → 56%×550 = 308 px   vert 96% → 96%×320 = 307 px  ≈ equal   */}
        {/* Transparent zone ends at 86% of those radii → ~265 px circle.            */}
        {/* Sphere boundary is off-screen (scale 240 gives 586px > 550px half-width) */}
        {/* Circular radial vignette — fades sphere edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(
            ellipse 56% 96% at 50% 50%,
            transparent              55%,
            rgba(248,250,252,0.07)   65%,
            rgba(248,250,252,0.20)   75%,
            rgba(248,250,252,0.48)   86%,
            rgba(248,250,252,0.78)   94%,
            ${BG}                   100%
          )`,
        }} />
        {/* Extra top/bottom fade — strengthens vertical edge blending */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(to bottom,
            rgba(248,250,252,0.85)  0%,
            rgba(248,250,252,0.40)  6%,
            transparent            12%,
            transparent            88%,
            rgba(248,250,252,0.40)  94%,
            rgba(248,250,252,0.85) 100%
          )`,
        }} />

        {/* ── Catch-light — faint top-left highlight for sphere depth ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(
            ellipse 50% 44% at 35% 28%,
            rgba(255,255,255,0.08) 0%,
            transparent            65%
          )`,
        }} />

        {/* ── Overlaid UI ───────────────────────────────────── */}

        {/* Hovered city info — bottom-left glass panel (sticky: stays open while mouse is inside) */}
        <div
          className={`absolute bottom-5 left-0 z-20 transition-all duration-200 ${hoveredMarker ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onMouseEnter={() => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }}
          onMouseLeave={() => { hideTimerRef.current = setTimeout(() => setHoveredMarker(null), 150); }}
        >
          {hoveredMarker && (
            <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-3 shadow-lg max-w-[260px]">
              {/* City name */}
              <p className="font-bold text-slate-900 text-sm mb-1">{hoveredMarker.city}</p>
              <p className="text-slate-400 text-xs mb-2">{hoveredMarker.subtitle}</p>

              {/* Category badges — shows all categories this city belongs to */}
              <div className="flex flex-wrap gap-1 mb-2">
                {hoveredMarker.categories.map(catId => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return cat ? (
                    <span key={catId}
                      className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold"
                      style={{ backgroundColor: cat.color }}>
                      {cat.label}
                    </span>
                  ) : null;
                })}
              </div>

              {hoveredMarker.note && (
                <p className="text-xs text-slate-500 mb-2">{hoveredMarker.note}</p>
              )}

              {hoveredMarker.projectIds.length > 0 && (
                <div className="space-y-1 border-t border-slate-100 pt-2 mt-1">
                  {hoveredMarker.projectIds.map(pid => {
                    const p = projects.find(x => x.id === pid);
                    return p ? (
                      <div
                        key={pid}
                        className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/projects/${pid}`); window.scrollTo(0, 0); }}
                      >
                        {p.title}
                      </div>
                    ) : null;
                  })}
                  <p className="text-[10px] text-indigo-400 mt-1 font-medium">点击查看详情 →</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone rotation arrows — left/right edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-start pl-3 pointer-events-none transition-opacity duration-200 ${isHovering && rotationZone === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-slate-400 text-xl select-none">‹</span>
        </div>
        <div className={`absolute right-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-end pr-3 pointer-events-none transition-opacity duration-200 ${isHovering && rotationZone === -1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-slate-400 text-xl select-none">›</span>
        </div>

        {/* Category filter pills */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 flex-wrap justify-center">
          {CATEGORIES.map(cat => {
            const active = activeCategories.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={(e) => { e.stopPropagation(); toggleCategory(cat.id); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 select-none cursor-pointer ${
                  active ? 'text-white shadow-md' : 'bg-white/60 text-slate-400 backdrop-blur-sm border border-white/40'
                }`}
                style={active ? { backgroundColor: cat.color } : {}}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.75)' : cat.color }}
                />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Rotation hint — bottom-right */}
        <div className={`absolute bottom-5 right-0 z-10 text-[11px] text-slate-400 pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          ‹ 边缘旋转 · 拖拽手控 ›
        </div>
      </div>

    </div>
  );
}
