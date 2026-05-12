import { testimonials } from '../data/testimonials';

function TestimonialCard({ item }) {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mx-3 select-none">
      <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${item.color} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
          {item.avatar}
        </div>
        <div>
          <p className="text-slate-900 text-sm font-semibold leading-tight">{item.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

// 双轨无限滚动
export default function Testimonials() {
  // 复制两份保证无缝循环
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials, ...testimonials].reverse();

  return (
    <section className="py-24 bg-slate-50 overflow-hidden border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <p className="text-indigo-600 font-semibold tracking-wide text-sm mb-3">他们眼中的石奉艳</p>
        <h2 className="text-3xl font-bold text-slate-900">同事 · 导师 · 合作伙伴的评价</h2>
      </div>

      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .track-left  { animation: scroll-left  35s linear infinite; }
        .track-right { animation: scroll-right 35s linear infinite; }
        .track-left:hover,
        .track-right:hover { animation-play-state: paused; }
      `}</style>

      {/* 左右渐变遮罩 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

        {/* 第一轨：向左 */}
        <div className="flex mb-4 w-max track-left">
          {row1.map((item, i) => <TestimonialCard key={`r1-${i}`} item={item} />)}
        </div>

        {/* 第二轨：向右 */}
        <div className="flex w-max track-right">
          {row2.map((item, i) => <TestimonialCard key={`r2-${i}`} item={item} />)}
        </div>
      </div>
    </section>
  );
}
