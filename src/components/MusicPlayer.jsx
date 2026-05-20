import { useState, useRef, useEffect } from 'react';

// 把你的音乐文件放在 public/bgm.mp3 即可
const MUSIC_SRC = import.meta.env.BASE_URL + 'bgm.mp3';
const SONG_NAME = '背景音乐';   // 改成你的曲名

export default function MusicPlayer() {
  const [playing, setPlaying]     = useState(false);
  const [visible, setVisible]     = useState(false); // 首次交互后才渲染 audio
  const [showTip, setShowTip]     = useState(false);
  const audioRef = useRef(null);

  // 第一次点击时才加载音频（避免浏览器自动播放限制）
  const toggle = () => {
    if (!visible) {
      setVisible(true);
      // audio 元素会在下一帧渲染，然后 useEffect 负责 play
      setPlaying(true);
      return;
    }
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  // visible 变为 true 后挂载 audio 并播放
  useEffect(() => {
    if (visible && playing && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [visible]);

  return (
    <>
      {/* 音频元素 — 只在用户首次点击后挂载 */}
      {visible && (
        <audio
          ref={audioRef}
          src={MUSIC_SRC}
          loop
          preload="auto"
        />
      )}

      {/* 浮动按钮 */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {/* 曲名提示气泡 */}
        <div
          className={`
            text-[11px] font-medium text-slate-600
            bg-white/90 backdrop-blur-md border border-white/60
            px-3 py-1.5 rounded-full shadow-md
            transition-all duration-200 whitespace-nowrap
            ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
          `}
        >
          {playing ? `♪ ${SONG_NAME}` : `播放背景音乐`}
        </div>

        {/* 圆形按钮 */}
        <button
          onClick={toggle}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          className={`
            w-11 h-11 rounded-full
            bg-white/80 backdrop-blur-md
            border shadow-lg
            flex items-center justify-center
            transition-all duration-300
            ${playing
              ? 'border-indigo-300 text-indigo-500 shadow-indigo-100'
              : 'border-white/60 text-slate-400 hover:text-indigo-500 hover:border-indigo-200'
            }
          `}
          title={playing ? '暂停音乐' : '播放背景音乐'}
        >
          {playing ? (
            /* 播放中 — 三条跳动的柱 */
            <span className="flex items-end gap-[3px] h-4">
              {[0, 150, 75].map((delay, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-indigo-400"
                  style={{
                    height: '100%',
                    animation: `musicBar 0.9s ease-in-out ${delay}ms infinite alternate`,
                  }}
                />
              ))}
            </span>
          ) : (
            /* 暂停 — 音符图标 */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </button>
      </div>

      {/* 跳动柱动画 */}
      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
