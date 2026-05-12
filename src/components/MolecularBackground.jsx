import { useEffect, useRef } from 'react';

export default function MolecularBackground() {
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
        this.yOffset = yOffset; this.color = color; this.speed = speed;
        this.scale = scale; this.isBackground = isBackground;
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
        for (let i = 0; i < this.numNodes - 1; i++) {
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[i + 1].x, this.nodes[i + 1].y);
        }
        ctx.strokeStyle = this.color; ctx.lineWidth = this.isBackground ? 1 : 2; ctx.stroke();
        for (let i = 0; i < this.numNodes; i++) {
          const p = this.nodes[i]; const s = (p.z + 100) / 200;
          const r = Math.max(0.5, (this.isBackground ? 2 : 4) * s * this.scale);
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = this.color; ctx.fill();
          if (i % 4 === 0 && i > 0 && i < this.numNodes - 1) {
            const dir = i % 8 === 0 ? 1 : -1;
            const bx = p.x + Math.sin(p.z * 0.1) * 30 * s * dir;
            const by = p.y + Math.cos(p.z * 0.1) * 30 * s * dir;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(bx, by);
            ctx.strokeStyle = this.color; ctx.lineWidth = this.isBackground ? 0.5 : 1.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(bx, by, r * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill();
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
}
