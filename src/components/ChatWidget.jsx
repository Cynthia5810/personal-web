import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Sparkles, User, Bot, Send } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', content: '你好！我是石奉艳的 ✨AI 助理。你可以问我关于 Monash 化工博士的科研经历，或者正在做的 AI 情感陪伴产品！' }
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || typing) return;
    const text = input.trim();
    setMessages(p => [...p, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 800));
    setMessages(p => [...p, { role: 'model', content: '感谢你的提问！AI 聊天功能需要配置 Gemini API Key 后才能使用。你可以通过页面底部的邮箱直接联系我！' }]);
    setTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[340px] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg"><Sparkles size={18} /></div>
              <div>
                <p className="font-semibold text-sm">石奉艳的 AI 分身</p>
                <p className="text-xs text-indigo-100 opacity-80">聊聊化工、研报或 AI 产品</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0"><Bot size={14} /></div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="问问我为什么从化工转做 AI..."
              className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 border border-transparent focus:border-indigo-300 focus:bg-white transition-all"
            />
            <button type="submit" disabled={!input.trim() || typing}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md disabled:shadow-none">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className={`${open ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'} bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-slate-400/40 flex items-center gap-2 transition-all duration-300 border-4 border-white hover:-translate-y-1`}
      >
        <MessageCircle size={22} className="text-indigo-300" />
        <span className="font-medium pr-1 whitespace-nowrap">✨ 和我的 AI 聊聊</span>
      </button>
    </div>
  );
}
