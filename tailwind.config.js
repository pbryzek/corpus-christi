/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        rising: {
          navy: '#1e3a6e',
          deep: '#162d57',
          ink: '#0f172a',
          cream: '#f8fafc',
          sand: '#eff6ff',
          parchment: '#e2e8f0',
          gold: '#93c5fd',
          bronze: '#1e3a6e',
          ochre: '#3b82f6',
          muted: '#475569',
          line: '#e2e8f0',
          stone: '#cbd5e1',
          mist: '#bfdbfe',
          haze: '#e2e8f0',
          ivory: '#dbeafe',
        },
      },
    },
  },
  plugins: [],
};
