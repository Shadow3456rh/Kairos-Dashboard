/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode toggling via a 'dark' class on the html element
  theme: {
    extend: {
      colors: {
        warm: {
          cream: '#FDF6EC',
          white: '#FFF8F0',
          terracotta: '#E07B39',
          terracottaHover: '#d06e30',
          sand: '#C9A96E',
          brown: '#2D1F0E',
          muted: '#7A5C3E',
          red: '#C0392B',
          green: '#5D8A4E',
          beige: '#E8D5B7',
        },
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          text: '#EAEAEA',
          muted: '#A0A0A0',
          border: '#333333'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        warm: '0 4px 14px rgba(150, 100, 50, 0.12)',
        warmHover: '0 12px 32px rgba(150, 100, 50, 0.18)',
        dark: '0 4px 14px rgba(0, 0, 0, 0.4)',
        darkHover: '0 12px 32px rgba(0, 0, 0, 0.6)'
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-warm': 'pulseWarm 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'snake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        pulseWarm: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.8', transform: 'scale(1.05)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}
