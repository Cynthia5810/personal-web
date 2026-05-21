import { useState } from 'react';

const SECTIONS = [
  { id: 'home',         label: '展示页'  },
  { id: 'about',        label: '关于我'  },
  { id: 'projects',     label: '精选产出' },
  { id: 'testimonials', label: '评价'    },
  { id: 'contact',      label: '联系合作' },
];

export default function SideNav({ activeSection }) {
  const [hoveredId, setHoveredId] = useState(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hidden = activeSection === 'home';

  return (
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center select-none transition-all duration-500 ${hidden ? 'opacity-0 pointer-events-none translate-x-3' : 'opacity-100 translate-x-0'}`}>
      {SECTIONS.map((sec, i) => {
        const isActive  = activeSection === sec.id;
        const isHovered = hoveredId === sec.id;

        return (
          <div key={sec.id} className="flex flex-col items-center">

            {/* 连接线（第一个节点上方不画） */}
            {i > 0 && (
              <div className={`w-px h-7 transition-colors duration-300 ${
                isActive ? 'bg-indigo-300' : 'bg-slate-200'
              }`} />
            )}

            {/* 节点行：标签 + 圆点 */}
            <div
              className="relative flex items-center cursor-pointer py-0.5"
              onMouseEnter={() => setHoveredId(sec.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => scrollTo(sec.id)}
            >
              {/* 标签气泡 — hover 时从右侧滑出 */}
              <div className={`
                absolute right-full mr-3
                text-[11px] font-semibold whitespace-nowrap
                px-2.5 py-1 rounded-full
                shadow-sm border
                transition-all duration-200
                ${isHovered
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-1 pointer-events-none'}
                ${isActive
                  ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
                  : 'text-slate-500 bg-white/90 border-slate-100'}
              `}>
                {sec.label}
              </div>

              {/* 圆点 */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-transparent'
                    : isHovered
                    ? 'w-2.5 h-2.5 bg-indigo-400'
                    : 'w-2 h-2 bg-slate-200'
                }`}
                style={isActive ? {
                  width: 10, height: 10,
                  border: '2.5px solid #6366f1',
                  boxShadow: '0 0 6px rgba(99,102,241,0.35)',
                } : {}}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
}
