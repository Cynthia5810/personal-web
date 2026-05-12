import { GitFork, Link, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-slate-500 bg-white border-t border-slate-200">
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://github.com/Cynthia5810" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors"><GitFork size={20} /></a>
        <a href="#" className="hover:text-indigo-600 transition-colors"><Link size={20} /></a>
        <a href="mailto:your.email@example.com" className="hover:text-indigo-600 transition-colors"><Mail size={20} /></a>
      </div>
      <p className="text-sm">&copy; 2026 石奉艳 · Monash PhD & AI Product Explorer</p>
    </footer>
  );
}
