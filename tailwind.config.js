/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        blaze: {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffceaa',
          300: '#ffac74',
          400: '#ff7d3a',
          500: '#ff5a14',
          600: '#f03d0a',
          700: '#c72c0a',
          800: '#9e2410',
          900: '#7f2010',
        },
        // Semantic theme colors via CSS variables
        surface: {
          base: 'rgb(var(--surface-base) / <alpha-value>)',
          alt: 'rgb(var(--surface-alt) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          strong: 'rgb(var(--ink-strong) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        edge: {
          DEFAULT: 'rgb(var(--edge) / <alpha-value>)',
          strong: 'rgb(var(--edge-strong) / <alpha-value>)',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'flame-flicker': {
          '0%,100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'float-a': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%': { transform: 'translate(14px,-18px) rotate(6deg)' },
          '66%': { transform: 'translate(-10px,-8px) rotate(-4deg)' },
        },
        'float-b': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%': { transform: 'translate(-16px,-14px) rotate(-5deg)' },
          '66%': { transform: 'translate(12px,-20px) rotate(4deg)' },
        },
        'float-c': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(10px,-22px) rotate(8deg)' },
        },
        'float-d': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(-14px,-16px) rotate(-7deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'wire-dash': {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
        'caret-blink': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-in-left': 'slide-in-left 0.6s ease-out both',
        'slide-in-right': 'slide-in-right 0.6s ease-out both',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'flame-flicker': 'flame-flicker 3s ease-in-out infinite',
        'float-a': 'float-a 8s ease-in-out infinite',
        'float-b': 'float-b 10s ease-in-out infinite',
        'float-c': 'float-c 7s ease-in-out infinite',
        'float-d': 'float-d 9s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 3s ease-out infinite',
        'wire-dash': 'wire-dash 1.5s linear infinite',
        'caret-blink': 'caret-blink 1s step-end infinite',
        'page-enter': 'page-enter 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
