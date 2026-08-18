import React, { useEffect, useState } from 'react';

const CONFIG = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
      </svg>
    ),
    bar:  'bg-green-400',
    wrap: 'border-green-500/30 bg-green-500/10 text-green-300',
    icon_color: 'text-green-400',
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
      </svg>
    ),
    bar:  'bg-red-400',
    wrap: 'border-red-500/30 bg-red-500/10 text-red-300',
    icon_color: 'text-red-400',
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    bar:  'bg-blue-400',
    wrap: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    icon_color: 'text-blue-400',
  },
};

export default function Toast({ message, type = 'success' }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = CONFIG[type] || CONFIG.success;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => setLeaving(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl border
        backdrop-blur-xl shadow-2xl overflow-hidden max-w-sm
        transition-all duration-500
        ${cfg.wrap}
        ${visible && !leaving ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${cfg.icon_color}`}>{cfg.icon}</div>

      {/* Message */}
      <p className="text-sm font-medium">{message}</p>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className={`h-full ${cfg.bar} opacity-60`}
          style={{
            animation: 'progressFill 3.5s linear forwards',
            '--target-width': '100%',
          }}
        />
      </div>
    </div>
  );
}
