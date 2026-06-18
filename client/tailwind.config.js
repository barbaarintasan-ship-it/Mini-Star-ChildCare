/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#1B2A5E',
          2: '#2E3F7D',
          soft: '#E2E7F5',
        },
        gold: {
          DEFAULT: '#EC5A2A',
          soft: '#FFD9C4',
          hover: '#D44E22',
        },
        coral: {
          DEFAULT: '#FF7960',
          soft: '#FFE3DC',
        },
        teal: {
          DEFAULT: '#54A28F',
          soft: '#DCEFE9',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(27,42,94,0.08)',
        'card-hover': '0 6px 24px rgba(27,42,94,0.14)',
      },
    },
  },
  plugins: [],
}
