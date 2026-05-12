import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Timeline from './pages/Timeline';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <HashRouter>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob          { animation: blob 10s infinite alternate; }
        .animation-delay-2000  { animation-delay: 2s; }
        .animation-delay-4000  { animation-delay: 4s; }
        .font-cursive          { font-family: 'Caveat', cursive; }
      `}</style>

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/projects"      element={<Projects />} />
          <Route path="/projects/:id"  element={<Projects />} />
          <Route path="/timeline"      element={<Timeline />} />
        </Routes>
        <ChatWidget />
      </div>
    </HashRouter>
  );
}
