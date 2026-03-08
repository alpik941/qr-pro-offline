import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        arctic: {
          bg: '#F4F7FA',
          text: '#1C2B3A',
          bright: '#0d1e2e',
          muted: '#6b8299',
          panel: '#ffffff',
          panel2: '#eaf0f6',
          border: '#dde5ed',
          accent: '#1C2B3A',
        },
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        sans: ['Instrument Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [
    forms,
  ],
} satisfies Config;