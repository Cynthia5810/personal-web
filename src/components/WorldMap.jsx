import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

// TopoJSON world data (no labels, just shapes)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// City clusters: group projects by city, add extra "footprint" cities
const CITY_MARKERS = [
  {
    id: 'melbourne',
    city: '墨尔本',
    subtitle: 'Melbourne · Australia',
    coordinates: [144.9631, -37.8136],
    projectIds: [1, 2, 3, 4, 5],
    color: '#6366f1',   // indigo — main hub
    pulseColor: 'rgba(99,102,241,0.35)',
    radius: 9,
    type: 'main',
  },
  {
    id: 'shanghai',
    city: '上海',
    subtitle: 'Shanghai · China',
    coordinates: [121.4737, 31.2304],
    projectIds: [],
    note: '本科就读地',
    color: '#a855f7',   // purple — education background
    pulseColor: 'rgba(168,85,247,0.35)',
    radius: 7,
    type: 'education',
  },
  // Secondary research-coverage dots for lithium supply chain
  {
    id: 'santiago',
    city: '圣地亚哥',
    subtitle: 'Santiago · Chile',
    coordinates: [-70.6693, -33.4489],
    projectIds: [3],
    note: '锂矿调研覆盖',
    color: '#f59e0b',   // amber — research coverage
    pulseColor: 'rgba(245,158,11,0.3)',
    radius: 5,
    type: 'research',
  },
  {
    id: 'buenosaires',
    city: '布宜诺斯艾利斯',
    subtitle: 'Buenos Aires · Argentina',
    coordinates: [-58.3816, -34.6037],
    projectIds: [3],
    note: '锂矿调研覆盖',
    color: '#f59e0b',
    pulseColor: 'rgba(245,158,11,0.3)',
    radius: 5,
    type: 'research',
  },
];

const LEGEND = [
  { color: '#6366f1', label: '项目主要发生地' },
  { color: '#a855f7', label: '教育背景' },
  { color: '#f59e0b', label: '调研覆盖地区' },
];

export default function WorldMap() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleMarkerClick = (marker) => {
    if (marker.projectIds.length > 0) {
      // If only one project, go directly to its detail page
      if (marker.projectIds.length === 1) {
        navigate(`/projects/${marker.projectIds[0]}`);
        window.scrollTo(0, 0);
      } else {
        // Scroll down to the project grid (anchor)
        const el = document.getElementById('project-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 mb-12">
      {/* Header */}
      <div className="px-6 pt-5 pb-1 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">项目足迹</h2>
          <p className="text-slate-400 text-xs mt-0.5">研究、创作与探索发生的地方</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[11px] text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative select-none">
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 153, center: [20, 5] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#1e293b"   /* same as fill → borders invisible */
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', fill: '#1e293b' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {CITY_MARKERS.map((marker) => (
            <Marker
              key={marker.id}
              coordinates={marker.coordinates}
              onMouseEnter={() => setHovered(marker)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleMarkerClick(marker)}
              style={{ cursor: marker.projectIds.length > 0 ? 'pointer' : 'default' }}
            >
              {/* Animated pulse ring */}
              <circle r={marker.radius + 8} fill={marker.pulseColor}>
                <animate attributeName="r"
                  from={marker.radius}
                  to={marker.radius + 14}
                  dur="2.4s"
                  repeatCount="indefinite" />
                <animate attributeName="fill-opacity"
                  from="0.5"
                  to="0"
                  dur="2.4s"
                  repeatCount="indefinite" />
              </circle>

              {/* Solid dot */}
              <circle
                r={marker.radius}
                fill={marker.color}
                stroke="white"
                strokeWidth={1.5}
              />

              {/* City label — only for main & education markers */}
              {(marker.type === 'main' || marker.type === 'education') && (
                <text
                  textAnchor="middle"
                  y={-(marker.radius + 6)}
                  style={{
                    fontSize: 9,
                    fill: '#cbd5e1',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    paintOrder: 'stroke',
                    stroke: '#0f172a',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  }}
                >
                  {marker.city}
                </text>
              )}
            </Marker>
          ))}
        </ComposableMap>

        {/* Hover info panel — bottom-left overlay */}
        <div
          className={`absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 max-w-[220px] transition-all duration-200 pointer-events-none ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          {hovered && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: hovered.color }}
                />
                <span className="font-bold text-white text-sm">{hovered.city}</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">{hovered.subtitle}</p>

              {hovered.note && (
                <p className="text-amber-400 text-[11px] mb-2">{hovered.note}</p>
              )}

              {hovered.projectIds.length > 0 && (
                <div className="space-y-1">
                  {hovered.projectIds.map((pid) => {
                    const p = projects.find((x) => x.id === pid);
                    return p ? (
                      <div
                        key={pid}
                        className="text-[11px] text-slate-300 bg-slate-700/60 px-2 py-1 rounded-md leading-tight"
                      >
                        {p.title}
                      </div>
                    ) : null;
                  })}
                  <p className="text-indigo-400 text-[10px] mt-1.5 font-medium">点击查看项目 →</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
