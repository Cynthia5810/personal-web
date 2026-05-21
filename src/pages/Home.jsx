import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';
import MolecularBackground from '../components/MolecularBackground';
import Testimonials from '../components/Testimonials';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { featuredProjects } from '../data/projects';

const skills = [
  "产品经理 (PM)", "AI 产品策划", "Prompt 调优", "大模型应用开发",
  "学术研究", "化工实验分析", "深度调研报告", "数据分析 (Python)",
  "跨部门沟通", "需求挖掘", "手工制作",
];

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const ids = ['home', 'about', 'projects', 'testimonials', 'contact'];
    const fn = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar />
      <SideNav activeSection={activeSection} />

      {/* ── Hero ── */}
      <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-8 flex items-center min-h-screen relative overflow-hidden bg-[#eaf0fb]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/40 rounded-full mix-blend-multiply blur-[100px] opacity-70 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-400/30 rounded-full mix-blend-multiply blur-[120px] opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-400/30 rounded-full mix-blend-multiply blur-[100px] opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-emerald-300/30 rounded-full mix-blend-multiply blur-[90px] opacity-70 animate-blob animation-delay-2000" />
        </div>
        <MolecularBackground />

        <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col h-[80vh] min-h-[600px] rounded-[2.5rem] overflow-hidden border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] bg-white/30 backdrop-blur-2xl p-8 md:p-14 lg:p-20 transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start w-full">
            <span className="text-xs font-semibold tracking-wider text-slate-800 bg-white/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/50">
              PhD / AI Product / Researcher
            </span>
            <span className="text-xs font-medium tracking-widest text-slate-800 border border-slate-700/20 rounded-full px-5 py-1.5 backdrop-blur-md bg-white/20 shadow-sm">2026</span>
          </div>

          <div className="relative z-10 flex flex-col items-start mt-auto mb-auto">
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-[#1a1a1a] tracking-tighter leading-none drop-shadow-sm mb-4">
              CROSS-<br />BOUNDARY.
            </h1>
            <h2 className="text-xl md:text-3xl font-bold text-[#2d2d2d] mt-2 tracking-wide">从物质科学，到人工智能。</h2>
            <p className="mt-4 text-slate-700 max-w-2xl text-sm md:text-base leading-relaxed backdrop-blur-sm bg-white/10 p-2 rounded-lg">
              用科研思维拆解世界，用手工与热爱构建生活。<br />探索 AI 产品在情感陪伴与生活场景中的无限可能。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <span className="text-sm font-medium text-slate-800 border border-slate-700/20 rounded-full px-6 py-2.5 backdrop-blur-md bg-white/30 flex items-center gap-2 shadow-sm">
                研究员：石奉艳
              </span>
              <button
                onClick={() => scrollTo('projects')}
                className="text-sm font-medium text-white border border-white/20 rounded-full px-6 py-2.5 backdrop-blur-md bg-slate-900/80 hover:bg-slate-900 transition-colors shadow-lg flex items-center gap-2"
              >
                探索精选产出 <Briefcase size={14} />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6 mt-auto">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-slate-600 bg-white/20 px-3 py-1 rounded backdrop-blur-sm">
              Monash ChemEng & AI Tinkerer
            </span>
            <span className="text-5xl md:text-7xl font-cursive text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] transform md:-rotate-6 md:-translate-y-4 group-hover:-rotate-3 transition-transform duration-500">
              Explore the unseen
            </span>
          </div>
        </div>
      </section>

      {/* ── 关于我 ── */}
      <section id="about" className="pt-32 pb-20 bg-white px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-slate-900">关于我</h2>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-5 text-slate-600 leading-relaxed text-[15px]">
              <p>你好！我是 <strong className="text-slate-800">石奉艳</strong>，一名正在 <strong>澳洲 Monash 大学攻读化工博士</strong> 的研究员，同时也是一个充满好奇心的跨界探索者。</p>
              <p>多年严谨的博士学术训练，赋予了我深度挖掘数据、撰写行业调研报告的能力。但我并不满足于实验室的瓶瓶罐罐——我始终对科技如何直接温暖人心抱有极大的热情。</p>
              <p>目前，我正致力于 <strong>AI 产品</strong> 的学习与策划。我坚信，在 LLM 爆发的时代，最具价值的产品不仅要"聪明"，更要懂"情感"。</p>
              <p>在代码和实验之外，我还是一名"创客"。周末的我喜欢泡在工坊里，从零开始制作木制家具和皮具——<strong>用耐心和热爱，创造美好的事物。</strong></p>
            </div>
            <div>
              <p className="text-slate-900 font-medium mb-4">核心能力：</p>
              <ul className="flex flex-wrap gap-2.5">
                {skills.map((s, i) => (
                  <li key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors cursor-default">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 精选产出（3张，无筛选） ── */}
      <section id="projects" className="pt-32 pb-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-slate-900">精选产出</h2>
              <div className="h-px bg-slate-200 w-24" />
            </div>
            <button
              onClick={() => { navigate('/projects'); window.scrollTo(0, 0); }}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group"
            >
              探索全部产出 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-slate-100 border-b-4 hover:border-b-indigo-500 hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                    {project.category}
                  </div>
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

          {/* 移动端"查看全部"按钮 */}
          <div className="mt-10 text-center md:hidden">
            <button
              onClick={() => { navigate('/projects'); window.scrollTo(0, 0); }}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
            >
              探索全部产出 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 评价滚动带 ── */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* ── 联系合作 ── */}
      <section id="contact" className="pt-32 pb-32 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-indigo-600 font-semibold mb-4 tracking-wide text-sm">期待有趣的碰撞</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">探索合作机会</h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            无论你是寻找具有深度分析能力的行业研究员，还是需要一个既懂技术逻辑又懂用户情感的 AI 产品经理，或是纯粹想交流木工心得，我都非常期待收到你的邮件！
          </p>
          <a
            href="mailto:your.email@example.com"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1"
          >
            <Mail size={20} /> 发送邮件给我
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
