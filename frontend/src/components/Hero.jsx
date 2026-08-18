import React, { useEffect, useState } from 'react';

const FEATURES = [
  { label: 'Instant Shorten',  color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' },
  { label: 'Click Analytics',  color: 'text-blue-400   border-blue-400/20   bg-blue-400/5'   },
  { label: 'Custom Alias',     color: 'text-purple-400 border-purple-400/20 bg-purple-400/5' },
  { label: 'Link Expiry',      color: 'text-orange-400 border-orange-400/20 bg-orange-400/5' },
  { label: 'QR Code',          color: 'text-pink-400   border-pink-400/20   bg-pink-400/5'   },
  { label: 'No Duplicates',    color: 'text-green-400  border-green-400/20  bg-green-400/5'  },
];

function Counter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
}

// New logo: a bold "T" cut mark with a sharp diagonal slash through it
function TrimLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
      {/* Horizontal bar — top of T */}
      <rect x="4" y="6" width="28" height="5" rx="2.5" fill="white" />
      {/* Vertical stem */}
      <rect x="15" y="11" width="6" height="15" rx="2" fill="white" />
      {/* Diagonal slash — the "trim" cut, teal accent */}
      <line
        x1="22" y1="20"
        x2="32" y2="30"
        stroke="#5eead4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Cut circle dot */}
      <circle cx="22" cy="20" r="2.5" fill="#5eead4" />
    </svg>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`text-center mb-10 transition-all duration-700
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

      {/* Brand */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700
            rounded-2xl flex items-center justify-center
            shadow-2xl shadow-brand-500/40 animate-glow">
            <TrimLogo />
          </div>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-300 rounded-full
            animate-bounce-slow border-2 border-gray-950" />
        </div>

        <h1 className="text-5xl font-black tracking-tight leading-none">
          <span className="text-white">Trim</span><span className="shimmer-text">.io</span>
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed mb-1">
        Trim the noise. Share what matters.
      </p>
      <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
        Instant short links with{' '}
        <span className="text-brand-400 font-medium">analytics</span>,{' '}
        <span className="text-purple-400 font-medium">QR codes</span> and{' '}
        <span className="text-orange-400 font-medium">custom aliases</span>.
      </p>

      {/* Live counters */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {[
          { value: 10000, label: 'Links Created',  suffix: '+' },
          { value: 50000, label: 'Clicks Tracked', suffix: '+' },
          { value: 99,    label: 'Uptime',          suffix: '.9%' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-brand-400 font-bold text-xl tabular-nums">
              <Counter target={s.value} />{s.suffix}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {FEATURES.map((f, i) => (
          <span
            key={f.label}
            className={`tag ${f.color} hover:scale-105 cursor-default`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
