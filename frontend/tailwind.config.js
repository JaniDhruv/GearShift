/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50:  '#FAFAF7',
          100: '#F5F3EF',
          200: '#EDE9E1',
          300: '#DDD8CE',
          400: '#C4BDB0',
          500: '#A89D8E',
        },
        ink: {
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
        },
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#059669',
          600: '#047857',
          700: '#065F46',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-md': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 24px 0 rgba(0,0,0,0.10), 0 4px 8px -2px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
