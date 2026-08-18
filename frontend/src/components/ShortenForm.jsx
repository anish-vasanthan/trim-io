import React, { useState, useRef } from 'react';

const MAX_URL_LEN = 2048;

function UrlPreview({ url }) {
  if (!url) return null;
  let hostname = '';
  let valid = false;
  try {
    const u = new URL(url);
    hostname = u.hostname;
    valid = true;
  } catch {
    return (
      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
        <span className="text-red-400 text-xs">⚠ Not a valid URL yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20 animate-fade-in">
      <img
        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
        alt=""
        className="w-4 h-4 rounded"
        onError={e => e.target.style.display = 'none'}
      />
      <span className="text-brand-400 text-xs font-medium">{hostname}</span>
      <span className="text-gray-600 text-xs ml-auto">✓ valid URL</span>
    </div>
  );
}

export default function ShortenForm({ onSubmit, loading }) {
  const [originalUrl, setOriginalUrl]   = useState('');
  const [customAlias, setCustomAlias]   = useState('');
  const [expiresIn, setExpiresIn]       = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [focused, setFocused]           = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;
    onSubmit({
      originalUrl: originalUrl.trim(),
      customAlias: customAlias.trim() || undefined,
      expiresIn:   expiresIn || undefined,
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setOriginalUrl(text);
    } catch {}
  };

  const urlLen   = originalUrl.length;
  const lenColor = urlLen > MAX_URL_LEN * 0.9 ? 'text-red-400' : urlLen > MAX_URL_LEN * 0.7 ? 'text-yellow-400' : 'text-gray-600';

  return (
    <div className={`glass-card p-6 transition-all duration-300 animate-slide-up ${focused ? 'border-brand-500/30 shadow-lg shadow-brand-500/10' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* URL Input */}
        <div>
          <div className="relative group">
            {/* Icon */}
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <svg className={`w-5 h-5 transition-colors duration-200 ${focused ? 'text-brand-400' : 'text-gray-500'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            <input
              ref={inputRef}
              type="text"
              className="input-field pl-12 pr-24 text-base"
              placeholder="Paste your long URL here..."
              value={originalUrl}
              onChange={e => setOriginalUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={MAX_URL_LEN}
              autoFocus
            />

            {/* Paste + Clear buttons */}
            <div className="absolute inset-y-0 right-3 flex items-center gap-1">
              {originalUrl ? (
                <button
                  type="button"
                  onClick={() => setOriginalUrl('')}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                  title="Clear"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2 py-1 text-xs text-brand-400 hover:text-brand-300 border border-brand-500/20 hover:border-brand-500/40 rounded-lg transition-all hover:bg-brand-500/10"
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              )}
            </div>
          </div>

          {/* URL Preview & char counter */}
          <div className="flex items-start justify-between mt-1">
            <div className="flex-1">
              <UrlPreview url={originalUrl} />
            </div>
            {originalUrl && (
              <span className={`text-xs ml-2 mt-2 ${lenColor}`}>{urlLen}</span>
            )}
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-all group"
        >
          <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center
            ${showAdvanced ? 'bg-brand-500 border-brand-500' : 'border-gray-600 group-hover:border-brand-500'}`}>
            <svg className={`w-2.5 h-2.5 text-white transition-transform duration-300 ${showAdvanced ? 'rotate-45' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m-8-8h16"/>
            </svg>
          </div>
          Advanced options
          <span className="text-xs text-gray-600">(custom alias, expiry)</span>
        </button>

        {/* Advanced fields */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-down">

            {/* Custom alias */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Custom Alias
                <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-600 text-xs pointer-events-none whitespace-nowrap">
                  trim.io/
                </span>
                <input
                  type="text"
                  className="input-field pl-14 text-sm"
                  placeholder="my-link"
                  value={customAlias}
                  onChange={e => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  maxLength={20}
                />
                {customAlias && (
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-600">
                    {customAlias.length}/20
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700">3–20 chars, letters/numbers/-/_</p>
            </div>

            {/* Expiry */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                Expires In
                <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <select
                className="input-field text-sm text-gray-100 [&>option]:bg-gray-900 [&>option]:text-gray-100"
                value={expiresIn}
                onChange={e => setExpiresIn(e.target.value)}
                style={{ colorScheme: 'dark' }}
              >
                <option value="">Never expires</option>
                <option value="1">1 hour</option>
                <option value="24">24 hours</option>
                <option value="168">7 days</option>
                <option value="720">30 days</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !originalUrl.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Shorten URL</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
