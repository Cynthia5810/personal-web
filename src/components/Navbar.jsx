import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: '关于我',   path: '/'         },
  { label: '全部产出', path: '/projects'  },
  { label: '成长历程', path: '/timeline'  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleNav = (item) => {
    setMobileOpen(false);
    navigate(item.path);
    window.scrollTo(0, 0);
  };

  const isActive = (item) => location.pathname === item.path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/85 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div
          className="text-xl font-bold tracking-tighter text-indigo-600 cursor-pointer"
          onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
        >
          石奉艳<span className="text-slate-900">.bio</span>
        </div>

        {/* 桌面导航 */}
        <div className="hidden md:flex items-center space-x-7">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive(item) ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 移动端汉堡 */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`w-full text-left px-6 py-4 text-sm font-medium border-b border-slate-50 last:border-0 transition-colors
                ${isActive(item) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
