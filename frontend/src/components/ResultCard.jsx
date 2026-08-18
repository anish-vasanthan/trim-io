import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Confetti burst on success
function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    color: ['#14b8a6','#5eead4','#a78bfa','#fb923c','#f472b6','#facc15'][i % 6],
    tx: `${(Math.random() - 0.5) * 120}px`,
    delay: `${Math.random() * 0.4}s`,
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute bottom-1/2 left-1/2"
          style={{
            '--tx': p.tx,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `particle 1s ease-out ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

// Animated number counter
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const target = value;
    const from = prev.current;
    prev.current = target;
    if (from === target) return;

    let start = null;
    const duration = 600;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span>{display}</span>;
}

// Copy button with feedback state
function CopyButton({ text, onCopy, className = '', children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`transition-all duration-200 ${className} ${copied ? 'scale-95' : ''}`}
    >
      {copied ? (
        <span className="flex items-center gap-1.5 text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
          Copied!
        </span>
      ) : children}
    </button>
  );
}

export default function ResultCard({ result, onCopy, onDelete }) {
  const [showQR, setShowQR]         = useState(false);
  const [showBurst, setShowBurst]   = useState(!result.alreadyExists);
  const [visible, setVisible]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    const b = setTimeout(() => setShowBurst(false), 1500);
    return () => { clearTimeout(t); clearTimeout(b); };
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : null;
  const trunc = (s, n = 60) => s.length > n ? s.slice(0, n) + '…' : s;
  const isExpired = result.expiresAt && new Date(result.expiresAt) < new Date();

  return (
    <div className={`relative glass-card p-6 transition-all duration-500 border
      ${result.alreadyExists ? 'border-blue-500/20' : 'border-brand-500/25'}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

      {/* Confetti burst */}
      {showBurst && <ConfettiBurst />}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-5">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border
          ${result.alreadyExists
            ? 'bg-blue-500/10 border-blue-500/25 text-blue-400'
            : 'bg-brand-500/10 border-brand-500/25 text-brand-400'}`}>
          <span className={`w-2 h-2 rounded-full ${result.alreadyExists ? 'bg-blue-400' : 'bg-brand-400 animate-pulse'}`}/>
          {result.alreadyExists ? 'Existing link returned' : 'New link created'}
        </div>
        {isExpired && (
          <span className="px-2 py-1 text-xs bg-red-500/15 text-red-400 border border-red-500/25 rounded-full">
            Expired
          </span>
        )}
      </div>

      {/* Short URL display */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-600/5 border border-brand-500/20 rounded-xl p-4 mb-4 group">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Short URL</p>
        <div className="flex items-center justify-between gap-3">
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-300 font-mono font-bold text-xl hover:text-brand-200 transition-colors truncate group-hover:underline underline-offset-2"
          >
            {result.shortUrl}
          </a>
          <CopyButton
            text={result.shortUrl}
            onCopy={onCopy}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-brand-500/15 hover:bg-brand-500/30 text-brand-300 hover:text-brand-200 px-3 py-2 rounded-lg border border-brand-500/20 hover:border-brand-500/40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Copy
          </CopyButton>
        </div>
      </div>

      {/* Original URL */}
      <div className="mb-5 px-1">
        <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider">Original</p>
        <p className="text-gray-500 text-sm font-mono break-all leading-relaxed" title={result.originalUrl}>
          {trunc(result.originalUrl)}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { value: <AnimatedNumber value={result.clicks} />, label: 'Clicks',  color: 'text-brand-400' },
          { value: fmt(result.createdAt)?.split(',')[0] ?? 'Now', label: 'Created', color: 'text-blue-400' },
          { value: result.expiresAt ? fmt(result.expiresAt)?.split(',')[0] : 'Never', label: 'Expires', color: result.expiresAt ? 'text-orange-400' : 'text-gray-500' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={() => setShowQR(v => !v)}
          className={`flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all duration-200
            ${showQR
              ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
              : 'border-white/10 hover:border-brand-500/30 text-gray-400 hover:text-brand-400 hover:bg-brand-500/5'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
          </svg>
          {showQR ? 'Hide QR' : 'QR Code'}
        </button>

        <CopyButton
          text={result.shortUrl}
          onCopy={onCopy}
          className="flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/10 hover:border-brand-500/30 text-gray-400 hover:text-brand-400 hover:bg-brand-500/5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Copy Link
        </CopyButton>

        <button
          onClick={() => onDelete(result.shortcode)}
          className="px-4 py-2.5 flex items-center gap-2 text-sm rounded-xl border border-red-500/15 hover:border-red-500/35 text-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>

      {/* QR Code panel */}
      {showQR && (
        <div className="mt-4 animate-scale-in">
          <div className="flex flex-col items-center gap-4 p-5 bg-white rounded-2xl shadow-xl">
            <QRCodeSVG
              value={result.shortUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#0f766e"
              level="H"
              includeMargin={true}
            />
            <div className="text-center">
              <p className="text-gray-700 text-sm font-semibold">{result.shortUrl}</p>
              <p className="text-gray-400 text-xs mt-0.5">Scan to open</p>
            </div>
            <button
              onClick={() => {
                const svg = document.querySelector('#qr-svg');
                if (!svg) return;
                const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `trimio-${result.shortcode}.svg`;
                a.click();
              }}
              className="text-xs text-brand-600 hover:text-brand-500 border border-brand-200 hover:border-brand-400 px-3 py-1.5 rounded-lg transition-all"
            >
              ⬇ Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
