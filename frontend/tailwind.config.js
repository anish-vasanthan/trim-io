/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-down':    'slideDown 0.3s ease-out',
        'scale-in':      'scaleIn 0.3s ease-out',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'float-fast':    'float 4s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'bounce-slow':   'bounce 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'confetti':      'confetti 1s ease-out forwards',
        'count-up':      'countUp 0.6s ease-out forwards',
        'typewriter':    'typewriter 2s steps(20) forwards',
        'border-glow':   'borderGlow 2s ease-in-out infinite',
        'slide-right':   'slideRight 0.4s ease-out',
        'particle':      'particle 3s ease-out forwards',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:    { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown:  { '0%': { transform: 'translateY(-24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideRight: { '0%': { transform: 'translateX(-24px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        scaleIn:    { '0%': { transform: 'scale(0.85)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20,184,166,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(20,184,166,0.7)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti: {
          '0%':   { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(360deg)', opacity: '0' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(20,184,166,0.3)' },
          '50%':      { borderColor: 'rgba(20,184,166,0.8)' },
        },
        particle: {
          '0%':   { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) translateX(var(--tx)) scale(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
