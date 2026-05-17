import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Graticule, Sphere } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
// Centered exactly between Shanghai (31°N, 121°E) and Melbourne (38°S, 145°E)
// midpoint ≈ −3.5°N, 133°E
const INITIAL_ROTATION = [-133, 3.5, 0];
// page background = slate-50
const BG = '#f8fafc';

const CITY_MARKERS = [
  {
    id: 'melbourne',
    city: '墨尔本',
    subtitle: 'Melbourne · Australia',
    coordinates: [144.9631, -37.8136],
    projectIds: [1, 2, 3, 4, 5],
    color: '#6366f1',
    radius: 7,
  },
  {
    id: 'shanghai',
    city: '上海',
    subtitle: 'Shanghai · China',
    coordinates: [121.4737, 31.2304],
    projectIds: [],
    note: '本科就读地',
    color: '#a855f7',
    radius: 5,
  },
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

export default function WorldMap() {
  const [rotation, setRotation]           = useState(INITIAL_ROTATION);
  const [rotationZone, setRotationZone]   = useState(0); // -1 left, 0 stop, +1 right
  const [isDragging, setIsDragging]       = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [isHovering, setIsHovering]       = useState(false);

  const rotationRef    = useRef(INITIAL_ROTATION);
  const lastPosRef     = useRef(null);
  const isDraggingRef  = useRef(false);
  const animRef        = useRef(null);
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
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    if (marker.projectIds.length > 1) {
      document.getElementById('project-grid')?.scrollIntoView({ behavior: 'smooth' });
    } else if (marker.projectIds.length === 1) {
      navigate(`/projects/${marker.projectIds[0]}`);
      window.scrollTo(0, 0);
    }
  }, [navigate]);

  const visibleMarkers = useMemo(
    () => CITY_MARKERS.filter(m => isVisible(m.coordinates, rotation)),
    [rotation],
  );

  return (
    <div className="mb-12">

      {/* ── Seamless globe backdrop ─────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: 620, cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >

        {/* Globe SVG — 200% wide so sphere edge extends off-screen on all sides */}
        <div style={{
          position: 'absolute',
          top:  '50%',
          left: '50%',
          width: '200%',                        /* 2× container → sphere edge always off-screen */
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
            {/* Invisible sphere — only used to create clip-path #rsm-sphere */}
            <Sphere fill="transparent" stroke="transparent" strokeWidth={0} />

            <g clipPath="url(#rsm-sphere)">
              {/* Grid lines — subtle, show globe curvature */}
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
                  onMouseEnter={() => setHoveredMarker(m)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => handleMarkerClick(m)}
                >
                  {/* Pulse ring */}
                  <circle r={m.radius + 7} fill={m.color} fillOpacity={0.15}>
                    <animate attributeName="r"
                      from={m.radius} to={m.radius + 15}
                      dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity"
                      from="0.4" to="0"
                      dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  {/* Core dot */}
                  <circle
                    r={m.radius} fill={m.color}
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

        {/* ── Vignette — only the outermost edge fades into page background ── */}
        {/* Transparent in the big center (70%) → short fade to solid at edges only */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(
            ellipse 90% 88% at 50% 50%,
            transparent              60%,
            rgba(248,250,252,0.45)   76%,
            ${BG}                    90%
          )`,
        }} />
        {/* Thin edge shadow — just blurs the very rim */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: `inset 0 0 28px 8px ${BG}`,
        }} />

        {/* ── Overlaid UI ───────────────────────────────────── */}

        {/* Header — top-left */}
        <div className="absolute top-5 left-0 pointer-events-none z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">项目足迹</p>
          <p className="text-slate-400 text-[11px]">研究、创作与探索发生的地方</p>
        </div>

        {/* Legend — top-right */}
        <div className="absolute top-5 right-0 flex items-center gap-4 pointer-events-none z-10">
          {[{ color: '#6366f1', label: '项目发生地' }, { color: '#a855f7', label: '教育背景' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[11px] text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Hovered city info — bottom-left glass panel */}
        <div className={`absolute bottom-5 left-0 z-10 transition-all duration-200 ${hoveredMarker ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {hoveredMarker && (
            <div className="bg-white/75 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-3 shadow-sm max-w-[240px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hoveredMarker.color }} />
                <span className="font-bold text-slate-900 text-sm">{hoveredMarker.city}</span>
              </div>
              <p className="text-slate-400 text-xs mb-1">{hoveredMarker.subtitle}</p>
              {hoveredMarker.note && (
                <p className="text-xs font-semibold mb-2" style={{ color: hoveredMarker.color }}>{hoveredMarker.note}</p>
              )}
              {hoveredMarker.projectIds.length > 0 && (
                <div className="space-y-1">
                  {hoveredMarker.projectIds.map(pid => {
                    const p = projects.find(x => x.id === pid);
                    return p ? (
                      <div
                        key={pid}
                        className="text-[11px] text-slate-600 bg-slate-50/80 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/projects/${pid}`); window.scrollTo(0, 0); }}
                      >
                        {p.title}
                      </div>
                    ) : null;
                  })}
                  <p className="text-[10px] text-indigo-400 mt-1.5 font-medium">点击查看详情 →</p>
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

        {/* Rotation hint — bottom-right */}
        <div className={`absolute bottom-5 right-0 z-10 text-[11px] text-slate-400 pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          ‹ 边缘旋转 · 拖拽手控 ›
        </div>
      </div>

    </div>
  );
}
