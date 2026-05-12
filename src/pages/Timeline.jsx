import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { timeline } from '../data/timeline';
import { GraduationCap } from 'lucide-react';

export default function Timeline() {
  return (
    <>
      <Navbar />
      <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <GraduationCap className="text-indigo-600" /> 成长历程
            </h1>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <p className="text-slate-500 mb-16">从化学工程到 AI 产品，一段跨越学科的探索之旅。</p>

          <div className="relative">
            {/* 竖轴线 */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 via-blue-200 to-purple-200 -translate-x-1/2" />

            <div className="space-y-16">
              {timeline.map((item, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex flex-col md:flex-row items-start gap-6 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* 年份气泡 */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                      <div className={`${item.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap ${item.current ? 'ring-4 ring-indigo-200' : ''}`}>
                        {item.year}
                        {item.current && <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse align-middle" />}
                      </div>
                    </div>

                    {/* 卡片 */}
                    <div className={`ml-14 md:ml-0 md:w-[46%] ${isRight ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-xl leading-snug">{item.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{item.org}</p>
                          </div>
                          {item.current && (
                            <span className="shrink-0 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">进行中</span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-5">{item.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, j) => (
                            <span key={j} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 对侧占位 */}
                    <div className="hidden md:block md:w-[46%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
