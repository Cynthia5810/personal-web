import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Droplets, GraduationCap, Leaf, Network, Sun, Boxes } from 'lucide-react';

const hotspots = [
  { id: 'resources', label: '关键资源', detail: '锂辉石提锂 · 盐湖分离', x: 19, y: 31, r: 17, color: '#f2b44d', Icon: Boxes },
  { id: 'water', label: '水系统', detail: '净水 · 绿色分离', x: 35, y: 46, r: 15, color: '#43bfd8', Icon: Droplets },
  { id: 'carbon', label: '碳与光', detail: '光催化 · CO₂ 还原', x: 63, y: 29, r: 18, color: '#e7bd45', Icon: Sun },
  { id: 'health', label: '环境健康', detail: '抗菌 · 环境修复', x: 70, y: 48, r: 14, color: '#71c797', Icon: Leaf },
  { id: 'knowledge', label: '知识培养', detail: '化学教学 · 人才培养', x: 30, y: 70, r: 18, color: '#b795df', Icon: GraduationCap },
  { id: 'intelligence', label: '交流连接', detail: '展览 · 协作 · 交流', x: 72, y: 70, r: 18, color: '#7fa7dd', Icon: Network },
];

export default function Home() {
  const [activeId, setActiveId] = useState('carbon');
  const navigate = useNavigate();
  const active = hotspots.find((item) => item.id === activeId);
  const worldImage = `${import.meta.env.BASE_URL}sustainable-world.png`;

  return (
    <main className="cover-page">
      <section className="cover-stage">
        <header className="cover-title">
          <p>A PERSONAL SYSTEMS ATLAS · 2026</p>
          <h1>从资源到生活</h1>
          <span>在能源、环境与人的成长之间，寻找可持续未来的连接方式。</span>
        </header>

        <div className={`cover-world ${active ? 'has-focus' : ''}`}>
          <img className="cover-world-base" src={worldImage} alt="从资源到生活的可持续系统图谱" />
          {active && (
            <img
              className="cover-world-focus"
              src={worldImage}
              alt=""
              style={{
                '--focus-x': `${active.x}%`,
                '--focus-y': `${active.y}%`,
                '--focus-r': `${active.r}%`,
              }}
            />
          )}

          {hotspots.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cover-hotspot ${activeId === item.id ? 'is-active' : ''}`}
              style={{ '--x': `${item.x}%`, '--y': `${item.y}%`, '--spot': item.color }}
              onClick={() => setActiveId(item.id)}
              aria-label={`${item.label}：${item.detail}`}
            >
              <i />
              <span><item.Icon size={13} /> {item.label}<small>{item.detail}</small></span>
            </button>
          ))}
        </div>

        <button className="open-letter" onClick={() => navigate('/portfolio')}>
          开启个人主页 <ArrowRight size={17} />
        </button>
      </section>
    </main>
  );
}
