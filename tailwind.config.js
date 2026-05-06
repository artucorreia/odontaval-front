/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        'primary-dark': '#4834d4',
        'primary-light': '#a29bfe',
        secondary: '#2D3436',
        accent: '#00B894',
        danger: '#E17055',
        surface: '#F5F6FA',
        muted: '#636E72',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
