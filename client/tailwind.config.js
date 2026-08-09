/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f7f1',
          100: '#dcecd8',
          200: '#b8d9b0',
          300: '#92c488',
          400: '#68ab61',
          500: '#478746',
          600: '#2e6b33',
          700: '#235128',
          800: '#1a3f1f',
          900: '#102815'
        },
        organic: {
          cream: '#f8f4ea',
          beige: '#efe6d2',
          mustard: '#b9862f',
          ink: '#1f2a1f'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(18, 41, 24, 0.08)'
      },
      fontFamily: {
        body: ['Nunito Sans', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif']
      }
    },
  },
  plugins: [],
};
