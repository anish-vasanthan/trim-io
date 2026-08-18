import React, { useState, useEffect, useRef } from 'react';

// Animated number
function AnimCount({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const from = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 700, 1);
      setN(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{n.toLocaleString()}</span>;
}

// Mini bar chart for click visualization
function ClickBar({ clicks, max }) {
  const pct = max > 0 ? (clicks / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold text-sm w-6 text-right">{clicks}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function StatsTable({ urls, onDelete, onRefresh, onCopy }) {
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('createdAt');
  const [deleting, setDeleting] = useState(null);
  const refreshRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  const isExpired  = (e) => e && new Date(e) < new Date();
  const totalClicks = urls.reduce((s, u) => s + u.clicks, 0);
  const maxClicks   = Math.max(...urls.map(u => u.clicks), 1);

  const filtered = urls
    .filter(u =>
      u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortcode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'clicks')    return b.clicks - a.clicks;
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleRefresh = async () => {
    setSpinning(true);
    await onRefresh();
    setTimeout(() => setSpinning(false), 600);
  };

  const handleDelete = async (shortcode) => {
    setDeleting(shortcode);
    await new Promise(r => setTimeout(r, 300));
    onDelete(shortcode);
    setDeleting(null);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—';
  const trunc = (s, n = 38) => s.length > n ? s.slice(0, n) + '…' : s;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Links',  value: urls.length,                                     color: 'from-brand-500/20 to-brand-600/10',   border: 'border-brand-500/20' },
          { label: 'Total Clicks', value: totalClicks,                                      color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
          { label: 'Active Links', value: urls.filter(u => !isExpired(u.expiresAt)).length, color: 'from-green-500/20 to-green-600/10',   border: 'border-green-500/20' },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`stat-card bg-gradient-to-br ${s.color} border ${s.border}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-3xl font-black text-white">
              <AnimCount value={s.value} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
          </svg>
          <input
            type="text"
            className="input-field pl-9 text-sm"
            placeholder="Search by URL or shortcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Sort + Refresh */}
        <div className="flex gap-2">
          <select
            className="input-field text-sm py-2 w-auto text-gray-100 [&>option]:bg-gray-900 [&>option]:text-gray-100"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ colorScheme: 'dark' }}
          >
            <option value="createdAt">Newest first</option>
            <option value="clicks">Most clicked</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-3 py-2 border border-white/10 hover:border-brand-500/40 text-gray-400 hover:text-brand-400 rounded-xl transition-all hover:bg-brand-500/5"
            title="Refresh"
          >
            <svg ref={refreshRef} className={`w-4 h-4 transition-transform duration-500 ${spinning ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <p className="text-gray-300 font-semibold text-lg">
            {search ? 'No results found' : 'No links yet'}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {search ? `Nothing matching "${search}"` : 'Shorten your first URL to see it here'}
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500">{filtered.length} link{filtered.length !== 1 ? 's' : ''}</span>
            {search && <span className="text-xs text-brand-400">filtered from {urls.length}</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['SHORT CODE', 'ORIGINAL URL', 'CLICKS', 'CREATED', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-600 font-semibold px-4 py-3 tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((url, i) => {
                  const expired = isExpired(url.expiresAt);
                  const isDeleting = deleting === url.shortcode;
                  return (
                    <tr
                      key={url.shortcode}
                      className={`border-b border-white/[0.04] transition-all duration-300 hover:bg-white/[0.03]
                        ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100'}
                        ${expired ? 'opacity-50' : ''}`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* Shortcode */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-brand-400 font-bold text-sm bg-brand-500/10 px-2 py-0.5 rounded-md">
                            /{url.shortcode}
                          </span>
                        </div>
                      </td>

                      {/* Original URL */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(url.originalUrl).hostname; } catch { return ''; } })()}&sz=16`}
                            className="w-4 h-4 flex-shrink-0 rounded"
                            alt=""
                            onError={e => e.target.style.display = 'none'}
                          />
                          <span className="text-gray-400 text-sm truncate" title={url.originalUrl}>
                            {trunc(url.originalUrl)}
                          </span>
                        </div>
                      </td>

                      {/* Clicks with bar */}
                      <td className="px-4 py-3 w-32">
                        <ClickBar clicks={url.clicks} max={maxClicks} />
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                        {fmt(url.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {expired ? (
                          <span className="px-2 py-0.5 text-xs bg-red-500/15 text-red-400 border border-red-500/20 rounded-full">
                            expired
                          </span>
                        ) : url.expiresAt ? (
                          <span className="px-2 py-0.5 text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-full">
                            {fmt(url.expiresAt)}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-green-500/15 text-green-400 border border-green-500/20 rounded-full">
                            active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onCopy(url.shortUrl)}
                            className="p-1.5 text-gray-600 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all"
                            title="Copy"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                          </button>
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Open"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </a>
                          <button
                            onClick={() => handleDelete(url.shortcode)}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
