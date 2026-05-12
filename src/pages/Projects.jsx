import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filter, ExternalLink, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { projects } from '../data/projects';

function ProjectDetail({ project }) {
  const navigate = useNavigate();
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-lg w-fit border border-slate-100"
        >
          <ArrowLeft size={18} /> 返回全部项目
        </button>

        <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden mb-10 shadow-sm relative">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-indigo-700 shadow-sm">
            {project.category}
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-slate-100">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">{tag}</span>
          ))}
        </div>

        <div className="text-slate-600 space-y-10">
          <p className="text-xl text-slate-700 font-medium leading-relaxed">{project.description}</p>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">项目背景与思考</h3>
            <p className="leading-relaxed">{project.detail?.background || '内容更新中...'}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">核心挑战与解决路径</h3>
            <p className="leading-relaxed">{project.detail?.challenge || '内容更新中...'}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">成果与未来展望</h3>
            <p className="leading-relaxed">{project.detail?.outcome || '内容更新中...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectList() {
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-slate-900">全部产出</h1>
          <div className="h-px bg-slate-200 flex-1" />
        </div>
        <p className="text-slate-500 mb-10">涵盖 AI 产品、行业调研、学术科研与创客生活。</p>

        {/* 筛选器 */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <Filter size={18} className="text-slate-400 mr-2 shrink-0" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
                ${activeFilter === cat ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
              {cat === 'All' ? '全部领域' : cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-slate-100 border-b-4 hover:border-b-indigo-500 hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                  {project.category}
                </div>
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">精选</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{project.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => { navigate(`/projects/${project.id}`); window.scrollTo(0, 0); }}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-sm font-semibold"
                  >
                    了解详情 <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">该分类下暂时没有内容，正在努力构建中...</div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { id } = useParams();
  const project = id ? projects.find(p => p.id === Number(id)) : null;

  return (
    <>
      <Navbar />
      {project ? <ProjectDetail project={project} /> : <ProjectList />}
      <Footer />
    </>
  );
}
