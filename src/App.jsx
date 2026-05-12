import React, { useState, useEffect, useRef } from 'react';
import { GitFork, Link, Mail, ExternalLink, Code, User, Briefcase, MessageCircle, X, Send, Bot, Sparkles, Filter, ArrowLeft, GraduationCap, Menu } from 'lucide-react';

const MolecularBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', setSize);
    setSize();
    class Chain {
      constructor(yOffset, color, speed, scale, isBackground) {
        this.nodes = [];
        this.numNodes = Math.floor((window.innerWidth || 1000) / 40) + 5;
        this.yOffset = yOffset; this.color = color; this.speed = speed; this.scale = scale; this.isBackground = isBackground;
        for (let i = 0; i < this.numNodes; i++) this.nodes.push({ x: 0, y: 0, z: 0 });
      }
      update(t) {
        const spacing = canvas.width / (this.numNodes - 4);
        for (let i = 0; i < this.numNodes; i++) {
          this.nodes[i].x = i * spacing - spacing * 2 + Math.sin(i * 0.15 + t * this.speed) * 40 * this.scale;
          this.nodes[i].y = canvas.height / 2 + this.yOffset + Math.sin(i * 0.1 + t * this.speed * 0.8) * 150 * this.scale;
          this.nodes[i].z = Math.cos(i * 0.2 + t * this.speed * 1.1) * 80 * this.scale;
        }
      }
      draw(ctx) {
        ctx.beginPath();
        for (let i = 0; i < this.numNodes - 1; i++) { ctx.moveTo(this.nodes[i].x, this.nodes[i].y); ctx.lineTo(this.nodes[i+1].x, this.nodes[i+1].y); }
        ctx.strokeStyle = this.color; ctx.lineWidth = this.isBackground ? 1 : 2; ctx.stroke();
        for (let i = 0; i < this.numNodes; i++) {
          const p = this.nodes[i]; const scale = (p.z + 100) / 200;
          const radius = Math.max(0.5, (this.isBackground ? 2 : 4) * scale * this.scale);
          ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill();
          if (i % 4 === 0 && i > 0 && i < this.numNodes - 1) {
            const dir = i % 8 === 0 ? 1 : -1;
            const bx = p.x + Math.sin(p.z * 0.1) * 30 * scale * dir;
            const by = p.y + Math.cos(p.z * 0.1) * 30 * scale * dir;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(bx, by);
            ctx.strokeStyle = this.color; ctx.lineWidth = this.isBackground ? 0.5 : 1.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(bx, by, radius * 0.8, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill();
          }
        }
      }
    }
    const chains = [
      new Chain(-120, 'rgba(255,255,255,0.25)', 0.012, 0.8, true),
      new Chain(140, 'rgba(129,140,248,0.3)', 0.015, 1.2, true),
      new Chain(10, 'rgba(255,255,255,0.65)', 0.02, 1, false),
    ];
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;
      chains.forEach(c => { c.update(time); c.draw(ctx); });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', setSize); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-overlay opacity-90" />;
};

const NAV_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于我' },
  { id: 'timeline', label: '成长历程' },
  { id: 'projects', label: '跨界产出' },
  { id: 'contact', label: '联系方式' },
];

const TIMELINE = [
  {
    year: '2026',
    title: 'AI 产品探索',
    org: '独立探索者',
    desc: '开始系统学习 AI 产品设计与策划，构思 AI 情感陪伴助手、智能情绪唤醒闹钟等应用，探索大模型在情感与生活场景中的落地可能。',
    color: 'bg-indigo-600',
    tags: ['AI 产品', 'LLM', 'Prompt Engineering'],
    current: true,
  },
  {
    year: '2023',
    title: 'PhD in Chemical Engineering',
    org: 'Monash University · 澳大利亚墨尔本',
    desc: '深入研究新型化工材料的合成与表征，在极端条件下探索材料反应机理。同期完成全球锂资源供应链深度调研，积累跨界行业研究能力。',
    color: 'bg-blue-500',
    tags: ['材料科学', '化工工程', '行业调研'],
    current: false,
  },
  {
    year: '2019',
    title: '本科 · 化学工程',
    org: '国内重点高校',
    desc: '系统学习化工工程基础理论，培养严谨的实验设计与数据分析能力，奠定跨学科思维基础。',
    color: 'bg-purple-500',
    tags: ['化工基础', '实验设计'],
    current: false,
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', content: '你好！我是石奉艳的 ✨AI 助理。你可以问我关于 Monash 化工博士的科研经历，或者我正在做的 AI 情感陪伴产品！' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(n => n.id);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (!selectedProject) {
        for (const id of [...sectionIds].reverse()) {
          const el = document.getElementById(id);
          if (el && window.scrollY >= el.offsetTop - 160) { setActiveSection(id); break; }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedProject]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (selectedProject) {
      setSelectedProject(null);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const projects = [
    { id: 1, title: "AI 情感陪伴助手", category: "AI 产品", description: "一款主打情绪价值的 AI 陪伴 App。基于 LLM 大语言模型，结合心理学模型，能够识别用户情绪波动并提供拟人化的温暖交流与疏导。", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tags: ["产品设计", "Prompt Engineering", "LLM", "用户调研"] },
    { id: 2, title: "智能情绪唤醒闹钟", category: "AI 产品", description: "结合用户的作息周期与前一晚的情绪状态，利用 AI 动态生成每日不同的早晨唤醒语音和音乐，让起床不再是一件痛苦的事。", image: "https://images.unsplash.com/photo-1507679361661-d70cb65313a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tags: ["AI 语音合成", "产品概念", "App 设计"] },
    { id: 3, title: "全球锂资源供应链深度调研", category: "行业调研", description: "跨越学术界与产业界，深入分析了全球新能源背景下锂矿资源的分布、开采技术壁垒及未来商业化应用前景的深度报告。", image: "https://images.unsplash.com/photo-1603584852959-1e3a47da2f14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tags: ["行业研报", "数据分析", "新能源产业链"] },
    { id: 4, title: "新型化工材料合成与表征", category: "学术科研", description: "Monash 大学博士期间的核心课题。探索了在极端条件下的材料反应机理，相关成果对优化工业生产流程具有重要意义。", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tags: ["材料科学", "实验设计", "化工工程", "数据建模"] },
    { id: 5, title: "周末手作实验：木工与皮具", category: "创客生活", description: "将工程师的严谨带入生活日常。记录了从原木到家具、从整皮到钱包的打磨过程，享受创造实物的纯粹乐趣。", image: "https://images.unsplash.com/photo-1520699049698-acd2fce18736?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tags: ["手工制作", "生活美学", "匠人精神"] },
  ];

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  const skills = ["产品经理 (PM)", "AI 产品策划", "Prompt 调优", "大模型应用开发", "学术研究", "化工实验分析", "深度调研报告", "数据分析 (Python)", "跨部门沟通", "需求挖掘", "手工制作"];

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setChatInput('');
    setIsTyping(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      setChatMessages(prev => [...prev, { role: 'model', content: "感谢你的提问！AI 聊天功能需要配置有效的 Gemini API Key 才能使用。你可以通过底部的邮箱直接联系真实的我！" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        @keyframes blob {
          0% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0px,0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .font-cursive { font-family: 'Caveat', cursive; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-in { animation: fadeSlideIn 0.35s ease both; }
      `}</style>

      {/* ── 导航栏 ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/85 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter text-indigo-600 cursor-pointer" onClick={() => scrollTo('home')}>
            石奉艳<span className="text-slate-900">.bio</span>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:flex space-x-7">
            {NAV_ITEMS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${activeSection === id ? 'text-indigo-600' : 'text-slate-600'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg anim-fade-in">
            {NAV_ITEMS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`w-full text-left px-6 py-4 text-sm font-medium border-b border-slate-50 last:border-0 transition-colors
                  ${activeSection === id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="flex-1 w-full flex flex-col">
        {selectedProject ? (
          /* ── 项目详情页 ── */
          <div className="pt-32 pb-24 px-6 min-h-screen bg-white">
            <div className="max-w-4xl mx-auto">
              <button onClick={() => { setSelectedProject(null); setTimeout(() => scrollTo('projects'), 50); }}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-lg w-fit border border-slate-100">
                <ArrowLeft size={18} /> 返回列表
              </button>
              <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden mb-10 shadow-sm relative">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-indigo-700 shadow-sm">{selectedProject.category}</div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{selectedProject.title}</h1>
              <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-slate-100">
                {selectedProject.tags.map((tag, i) => <span key={i} className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">{tag}</span>)}
              </div>
              <div className="text-slate-600 space-y-8">
                <p className="text-xl text-slate-700 font-medium leading-relaxed">{selectedProject.description}</p>
                <div><h3 className="text-2xl font-bold text-slate-900 mb-4">项目背景与思考</h3><p className="leading-relaxed">这里可以详细展开你做这个项目的起因。作为一名化工博士，你是如何发现这个痛点的？科研训练赋予你的洞察力是如何体现在前期的需求挖掘上的？</p></div>
                <div><h3 className="text-2xl font-bold text-slate-900 mb-4">核心挑战与解决路径</h3><p className="leading-relaxed">描述你在开发、调研或制作过程中遇到的难点。展示你严谨的工程师逻辑和拆解复杂问题的框架思维。</p></div>
                <div><h3 className="text-2xl font-bold text-slate-900 mb-4">成果与未来展望</h3><p className="leading-relaxed">放入数据图表、App 截图或手工制作的过程照片。总结该项目的阶段性成果，以及对未来迭代的思考。</p></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── 首页 ── */}
            <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-8 flex items-center min-h-screen relative overflow-hidden bg-[#eaf0fb]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/40 rounded-full mix-blend-multiply blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-400/30 rounded-full mix-blend-multiply blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-400/30 rounded-full mix-blend-multiply blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-emerald-300/30 rounded-full mix-blend-multiply blur-[90px] opacity-70 animate-blob animation-delay-2000"></div>
              </div>
              <MolecularBackground />
              <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col h-[80vh] min-h-[600px] rounded-[2.5rem] overflow-hidden border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] bg-white/30 backdrop-blur-2xl p-8 md:p-14 lg:p-20 transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start w-full">
                  <span className="text-xs font-semibold tracking-wider text-slate-800 bg-white/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/50">PhD / AI Product / Researcher</span>
                  <span className="text-xs font-medium tracking-widest text-slate-800 border border-slate-700/20 rounded-full px-5 py-1.5 backdrop-blur-md bg-white/20 shadow-sm">2026</span>
                </div>
                <div className="relative z-10 flex flex-col items-start mt-auto mb-auto">
                  <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-[#1a1a1a] tracking-tighter leading-none drop-shadow-sm mb-4">CROSS-<br />BOUNDARY.</h1>
                  <h2 className="text-xl md:text-3xl font-bold text-[#2d2d2d] mt-2 tracking-wide">从物质科学，到人工智能。</h2>
                  <p className="mt-4 text-slate-700 max-w-2xl text-sm md:text-base leading-relaxed backdrop-blur-sm bg-white/10 p-2 rounded-lg">
                    用科研思维拆解世界，用手工与热爱构建生活。<br />探索 AI 产品在情感陪伴与生活场景中的无限可能。
                  </p>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <span className="text-sm font-medium text-slate-800 border border-slate-700/20 rounded-full px-6 py-2.5 backdrop-blur-md bg-white/30 flex items-center gap-2 shadow-sm">研究员：石奉艳</span>
                    <button onClick={() => scrollTo('projects')} className="text-sm font-medium text-white border border-white/20 rounded-full px-6 py-2.5 backdrop-blur-md bg-slate-900/80 hover:bg-slate-900 transition-colors shadow-lg flex items-center gap-2">
                      探索多元产出 <Briefcase size={14} />
                    </button>
                  </div>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6 mt-auto">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-slate-600 bg-white/20 px-3 py-1 rounded backdrop-blur-sm">Monash ChemEng & AI Tinkerer</span>
                  <span className="text-5xl md:text-7xl font-cursive text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] transform md:-rotate-6 md:-translate-y-4 group-hover:-rotate-3 transition-transform duration-500">Explore the unseen</span>
                </div>
              </div>
            </section>

            {/* ── 关于我 ── */}
            <section id="about" className="pt-32 pb-20 bg-white px-6 border-b border-slate-100">
              <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><User className="text-indigo-600" /> 关于我</h2>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-5 text-slate-600 leading-relaxed text-[15px]">
                    <p>你好！我是 <strong className="text-slate-800">石奉艳</strong>，一名正在 <strong>澳洲 Monash 大学攻读化工博士</strong> 的研究员，同时也是一个充满好奇心的跨界探索者。</p>
                    <p>多年严谨的博士学术训练，赋予了我深度挖掘数据、撰写行业调研报告（例如锂资源产业链分析）的能力。但我并不满足于实验室的瓶瓶罐罐——我始终对科技如何直接温暖人心抱有极大的热情。</p>
                    <p>目前，我正致力于 <strong>AI 产品</strong> 的学习与策划。我坚信，在 LLM 爆发的时代，最具价值的产品不仅要"聪明"，更要懂"情感"。我正在构思如 <strong>AI 情感陪伴助手、智能情绪闹钟</strong> 等应用，希望用工程师的理智，做有温度的产品。</p>
                    <p>在代码和实验之外，我还是一名"创客"。周末的我喜欢泡在工坊里，从零开始制作木制家具和皮具——<strong>用耐心和热爱，创造美好的事物。</strong></p>
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium mb-4">我的核心能力树：</p>
                    <ul className="flex flex-wrap gap-2.5">
                      {skills.map((skill, i) => (
                        <li key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors cursor-default">{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 成长历程时间线 ── */}
            <section id="timeline" className="pt-32 pb-24 px-6 bg-slate-50 border-b border-slate-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-14">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="text-indigo-600" /> 成长历程</h2>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="relative">
                  {/* 竖轴线 */}
                  <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 via-blue-200 to-purple-200 -translate-x-1/2"></div>

                  <div className="space-y-12">
                    {TIMELINE.map((item, i) => {
                      const isRight = i % 2 === 0;
                      return (
                        <div key={i} className={`relative flex flex-col md:flex-row items-start gap-6 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          {/* 年份气泡 — 桌面居中 */}
                          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                            <div className={`${item.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap ${item.current ? 'ring-4 ring-indigo-200' : ''}`}>
                              {item.year}
                              {item.current && <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse align-middle"></span>}
                            </div>
                          </div>

                          {/* 卡片 */}
                          <div className={`ml-14 md:ml-0 md:w-[46%] ${isRight ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{item.title}</h3>
                                  <p className="text-sm text-slate-500 mt-0.5">{item.org}</p>
                                </div>
                                {item.current && (
                                  <span className="shrink-0 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">进行中</span>
                                )}
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {item.tags.map((tag, j) => (
                                  <span key={j} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 对侧占位（桌面） */}
                          <div className="hidden md:block md:w-[46%]"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 项目展示 ── */}
            <section id="projects" className="pt-32 pb-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Code className="text-indigo-600" /> 多维产出展示</h2>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="flex items-center gap-2 mb-10 overflow-x-auto hide-scrollbar pb-2">
                  <Filter size={18} className="text-slate-400 mr-2 shrink-0" />
                  {categories.map(category => (
                    <button key={category} onClick={() => setActiveFilter(category)}
                      className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeFilter === category ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {category === 'All' ? '全部领域' : category}
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-slate-100 border-b-4 hover:border-b-indigo-500 hover:-translate-y-1">
                      <div className="h-48 overflow-hidden relative">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">{project.category}</div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{project.title}</h3>
                        <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, i) => <span key={i} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{tag}</span>)}
                        </div>
                        <div className="flex items-center mt-auto pt-4 border-t border-slate-100">
                          <button onClick={() => { setSelectedProject(project); window.scrollTo(0, 0); }}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-sm font-semibold">
                            了解详情 <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredProjects.length === 0 && <div className="text-center py-20 text-slate-500">该分类下暂时没有内容，正在努力构建中...</div>}
              </div>
            </section>

            {/* ── 联系方式 ── */}
            <section id="contact" className="pt-40 pb-32 px-6 bg-slate-50 text-center">
              <div className="max-w-2xl mx-auto w-full">
                <p className="text-indigo-600 font-semibold mb-4 tracking-wide">期待有趣的碰撞</p>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">探索合作机会</h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  无论你是寻找具有深度分析能力的行业研究员，还是需要一个既懂技术逻辑又懂用户情感的 AI 产品经理，或是纯粹想交流木工心得，我都非常期待收到你的邮件！
                </p>
                <a href="mailto:your.email@example.com"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1">
                  <Mail size={20} /> 发送邮件给我
                </a>
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── 页脚 ── */}
      <footer className="py-8 text-center text-slate-500 bg-white border-t border-slate-200">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-indigo-600 transition-colors"><GitFork size={20} /></a>
          <a href="#" className="hover:text-indigo-600 transition-colors"><Link size={20} /></a>
          <a href="#" className="hover:text-indigo-600 transition-colors"><Mail size={20} /></a>
        </div>
        <p className="text-sm">&copy; 2026 石奉艳 · Monash PhD & AI Product Explorer</p>
      </footer>

      {/* ── 浮动 AI 聊天窗口 ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[340px] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col mb-4 overflow-hidden anim-fade-in">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg"><Sparkles size={18} className="text-indigo-50" /></div>
                <div>
                  <h3 className="font-semibold text-sm">石奉艳的 AI 分身</h3>
                  <p className="text-xs text-indigo-100 opacity-80">聊聊化工、研报或 AI 产品</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-indigo-100 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0"><Bot size={14} /></div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-500 shadow-sm rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                placeholder="问问我为什么从化工转做 AI..."
                className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all border border-transparent focus:border-indigo-300 focus:bg-white" />
              <button type="submit" disabled={!chatInput.trim() || isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md disabled:shadow-none">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(v => !v)}
          className={`${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'} bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-slate-400/40 flex items-center gap-2 transition-all duration-300 border-4 border-white hover:-translate-y-1`}>
          <MessageCircle size={22} className="text-indigo-300" />
          <span className="font-medium pr-1 whitespace-nowrap">✨ 和我的 AI 聊聊</span>
        </button>
      </div>
    </div>
  );
}
