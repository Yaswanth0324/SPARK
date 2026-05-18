/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Orange-tinted dark palette for dark mode
        dark: {
          50:  '#fdf4ee',
          100: '#fae3cc',
          200: '#f5c39a',
          700: '#3d1f0d',
          800: '#2a1208',
          850: '#1e0d05',
          900: '#140802',
          950: '#0a0401',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'orange-dark': 'linear-gradient(145deg, #140802 0%, #1e0d05 40%, #2a1208 70%, #140802 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(-20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
      boxShadow: {
        'glow':      '0 0 20px rgba(249, 115, 22, 0.45)',
        'glow-lg':   '0 0 40px rgba(249, 115, 22, 0.30)',
        'card':      '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'card-dark': '0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(234,88,12,0.08)',
        'orange-glow': '0 0 0 1px rgba(234,88,12,0.3), 0 4px 16px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
