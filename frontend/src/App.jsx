import React, { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import ShortenForm from './components/ShortenForm';
import ResultCard from './components/ResultCard';
import StatsTable from './components/StatsTable';
import Toast from './components/Toast';
import axios from './api';

// Floating background particles
function Particles() {
  const particles = [
    { size: 6,  top: '10%',  left: '5%',   duration: '7s',  delay: '0s',   opacity: 0.4, color: '#14b8a6' },
    { size: 4,  top: '20%',  left: '85%',  duration: '9s',  delay: '1s',   opacity: 0.3, color: '#5eead4' },
    { size: 8,  top: '60%',  left: '92%',  duration: '6s',  delay: '2s',   opacity: 0.25, color: '#a78bfa' },
    { size: 5,  top: '75%',  left: '10%',  duration: '8s',  delay: '0.5s', opacity: 0.35, color: '#14b8a6' },
    { size: 3,  top: '40%',  left: '3%',   duration: '10s', delay: '3s',   opacity: 0.2,  color: '#f472b6' },
    { size: 7,  top: '85%',  left: '75%',  duration: '7s',  delay: '1.5s', opacity: 0.3,  color: '#5eead4' },
    { size: 4,  top: '30%',  left: '50%',  duration: '11s', delay: '4s',   opacity: 0.15, color: '#a78bfa' },
    { size: 5,  top: '90%',  left: '40%',  duration: '8s',  delay: '2.5s', opacity: 0.25, color: '#14b8a6' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.04) 0%, transparent 70%)' }} />

      {/* Floating dots */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  p.size,
            height: p.size,
            top:    p.top,
            left:   p.left,
            backgroundColor: p.color,
            opacity: p.opacity,
            animation: `float ${p.duration} ease-in-out ${p.delay} infinite`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export default function App() {
  const [result, setResult]       = useState(null);
  const [urls, setUrls]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [toastKey, setToastKey]   = useState(0);
  const [activeTab, setActiveTab] = useState('shorten');
  const [tabAnim, setTabAnim]     = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setToastKey(k => k + 1);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchUrls = useCallback(async () => {
    try {
      const res = await axios.get('/api/urls');
      setUrls(res.data.urls || []);
    } catch {}
  }, []);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setTabAnim(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTabAnim(false);
    }, 150);
  };

  const handleShorten = async (formData) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/shorten', formData);
      setResult(res.data);
      showToast(
        res.data.alreadyExists ? 'URL already exists — returning existing link' : 'Short link created!',
        res.data.alreadyExists ? 'info' : 'success'
      );
      fetchUrls();
    } catch (err) {
      showToast(err.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortcode) => {
    try {
      await axios.delete(`/api/urls/${shortcode}`);
      showToast('Link deleted', 'success');
      fetchUrls();
      if (result?.shortcode === shortcode) setResult(null);
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      <Particles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <Hero />

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1 flex gap-1 relative">
            {[
              { id: 'shorten',   label: 'Shorten URL' },
              { id: 'dashboard', label: 'Dashboard',
                badge: urls.length > 0 ? urls.length : null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                {tab.label}
                {tab.badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-brand-500/20 text-brand-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-150 ${tabAnim ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {activeTab === 'shorten' && (
            <div className="space-y-5">
              <ShortenForm onSubmit={handleShorten} loading={loading} />
              {result && (
                <ResultCard
                  result={result}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <StatsTable
              urls={urls}
              onDelete={handleDelete}
              onRefresh={fetchUrls}
              onCopy={handleCopy}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-12">
          Trim.io — Built with React + Node + Express
        </p>
      </div>

      {toast && <Toast key={toastKey} message={toast.message} type={toast.type} />}
    </div>
  );
}
