import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Graticule, Sphere } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Centered between Shanghai and Melbourne
const INITIAL_ROTATION = [-128, -5, 0];

const CITY_MARKERS = [
  {
    id: 'melbourne',
    city: '墨尔本',
    subtitle: 'Melbourne · Australia',
    coordinates: [144.9631, -37.8136],
    projectIds: [1, 2, 3, 4, 5],
    color: '#6366f1',
    radius: 7,
    type: 'main',
    tagColor: 'bg-indigo-50 text-indigo-600',
    tagLabel: '5 个项目',
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
    type: 'education',
    tagColor: 'bg-purple-50 text-purple-600',
    tagLabel: '教育背景',
  },
];

// Check if a point is in the visible hemisphere given current rotation
function isVisible(coordinates, rotation) {
  const toRad = Math.PI / 180;
  const lambda = coordinates[0] * toRad;
  const phi    = coordinates[1] * toRad;
  const rLambda = -rotation[0] * toRad;
  const rPhi    = -rotation[1] * toRad;
  const dot =
    Math.sin(phi) * Math.sin(rPhi) +
    Math.cos(phi) * Math.cos(rPhi) * Math.cos(lambda - rLambda);
  return dot > 0;
}

export default function WorldMap() {
  const [rotation, setRotation]       = useState(INITIAL_ROTATION);
  const [isHovering, setIsHovering]   = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const rotationRef = useRef(INITIAL_ROTATION);
  const lastPosRef  = useRef(null);
  const animRef     = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate    = useNavigate();

  // ── auto-rotate on hover ──────────────────────────────────────────
  useEffect(() => {
    if (isHovering && !isDragging) {
      const animate = () => {
        rotationRef.current = [
          rotationRef.current[0] - 0.12,
          rotationRef.current[1],
          rotationRef.current[2],
        ];
        setRotation([...rotationRef.current]);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    }
    return () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; } };
  }, [isHovering, isDragging]);

  // ── drag handlers ─────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !lastPosRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    rotationRef.current = [
      rotationRef.current[0] + dx * 0.45,
      Math.max(-70, Math.min(70, rotationRef.current[1] - dy * 0.3)),
      rotationRef.current[2],
    ];
    setRotation([...rotationRef.current]);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    lastPosRef.current = null;
  }, []);

  const onMouseEnter = useCallback(() => setIsHovering(true), []);
  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    isDraggingRef.current = false;
    setIsDragging(false);
    lastPosRef.current = null;
  }, []);

  // ── click: navigate to project ───────────────────────────────────
  const handleMarkerClick = useCallback((marker) => {
    if (marker.projectIds.length > 1) {
      document.getElementById('project-grid')?.scrollIntoView({ behavior: 'smooth' });
    } else if (marker.projectIds.length === 1) {
      navigate(`/projects/${marker.projectIds[0]}`);
      window.scrollTo(0, 0);
    }
  }, [navigate]);

  // ── visible markers ──────────────────────────────────────────────
  const visibleMarkers = useMemo(
    () => CITY_MARKERS.filter(m => isVisible(m.coordinates, rotation)),
    [rotation],
  );

  return (
    <div className="mb-12">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">项目足迹</h2>
            <p className="text-slate-400 text-xs mt-0.5">研究、创作与探索发生的地方</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-500">项目主要发生地</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-500">教育背景</span>
            </div>
          </div>
        </div>

        {/* Body: globe + info side by side */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">

          {/* ── Globe ─────────────────────────────────────────── */}
          <div
            className="relative flex-shrink-0 mx-auto select-none"
            style={{ width: 340, height: 340, cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            <ComposableMap
              projection="geoOrthographic"
              projectionConfig={{ rotate: rotation, scale: 162 }}
              width={340}
              height={340}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Ocean (white sphere) + creates clip-path #rsm-sphere */}
              <Sphere fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />

              {/* Grid lines */}
              <Graticule stroke="#e8eef4" strokeWidth={0.4} />

              {/* Land — clipped to front hemisphere automatically by geoOrthographic */}
              <g clipPath="url(#rsm-sphere)">
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#dde6f0"
                        stroke="#c8d6e5"
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

              {/* City markers — only rendered when on visible side */}
              {visibleMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinates={marker.coordinates}
                  onMouseEnter={() => setHoveredMarker(marker)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => handleMarkerClick(marker)}
                >
                  {/* Pulse ring */}
                  <circle r={marker.radius + 7} fill={marker.color} fillOpacity={0.18}>
                    <animate attributeName="r"
                      from={marker.radius} to={marker.radius + 14}
                      dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity"
                      from="0.4" to="0"
                      dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  {/* Core dot */}
                  <circle
                    r={marker.radius}
                    fill={marker.color}
                    stroke="white"
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* City label */}
                  <text
                    textAnchor="middle"
                    y={-(marker.radius + 9)}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fill: '#475569',
                      paintOrder: 'stroke',
                      stroke: 'white',
                      strokeWidth: 3.5,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      pointerEvents: 'none',
                    }}
                  >
                    {marker.city}
                  </text>
                </Marker>
              ))}
            </ComposableMap>

            {/* Subtle 3-D lighting overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(
                  circle at 36% 32%,
                  rgba(255,255,255,0.28) 0%,
                  transparent 52%,
                  rgba(71,85,105,0.13) 100%
                )`,
                borderRadius: '50%',
              }}
            />

            {/* Hover hint */}
            <div
              className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-slate-400 bg-white/85 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-100 pointer-events-none whitespace-nowrap transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
            >
              ⟳ 悬停旋转 · 拖拽手控
            </div>
          </div>

          {/* ── Right info panel ──────────────────────────────── */}
          <div className="flex-1 w-full min-w-0">
            {hoveredMarker ? (
              /* Hovered city detail */
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: hoveredMarker.color }} />
                  <span className="text-xl font-bold text-slate-900">{hoveredMarker.city}</span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{hoveredMarker.subtitle}</p>
                {hoveredMarker.note && (
                  <p className="text-sm font-semibold mb-4" style={{ color: hoveredMarker.color }}>
                    {hoveredMarker.note}
                  </p>
                )}
                {hoveredMarker.projectIds.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">关联项目</p>
                    <div className="space-y-2">
                      {hoveredMarker.projectIds.map((pid) => {
                        const p = projects.find((x) => x.id === pid);
                        return p ? (
                          <div
                            key={pid}
                            onClick={() => { navigate(`/projects/${pid}`); window.scrollTo(0, 0); }}
                            className="flex items-center gap-2.5 text-sm text-slate-700 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                          >
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                            {p.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Default: city list */
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">城市足迹</p>
                <div className="space-y-3">
                  {CITY_MARKERS.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
                      onClick={() => handleMarkerClick(m)}
                      onMouseEnter={() => setHoveredMarker(m)}
                      onMouseLeave={() => setHoveredMarker(null)}
                    >
                      {/* Color circle icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: m.color + '18' }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color }} />
                      </div>

                      {/* City info */}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-sm">{m.city}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{m.subtitle}</div>
                        {m.note && (
                          <div className="text-xs mt-1 font-semibold" style={{ color: m.color }}>{m.note}</div>
                        )}
                      </div>

                      {/* Tag */}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${m.tagColor}`}>
                        {m.tagLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
