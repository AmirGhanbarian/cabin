export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f6f6f4',
          100: '#e8e8e4',
          200: '#d1d1cc',
          300: '#a8a8a2',
          400: '#7a7a74',
          500: '#5c5c56',
          600: '#44443f',
          700: '#33332f',
          800: '#222220',
          900: '#1a1a18',
          950: '#0f0f0e',
        },
        cream: {
          50: '#fdfcf8',
          100: '#f9f5ec',
          200: '#f2ead8',
          300: '#e8dcc0',
        },
        brass: {
          50: '#fbf6ed',
          100: '#f5e9d0',
          200: '#ead3a1',
          300: '#dcb86d',
          400: '#d0a049',
          500: '#bd8837',
          600: '#a06e2c',
          700: '#7e5524',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ece4',
          200: '#c7d8ca',
          300: '#a3bda7',
          400: '#7d9e82',
          500: '#5d8063',
          600: '#496650',
        },
      },
      spacing: {
        'section-pad': '6rem',
      },
      maxWidth: {
        container: '1200px',
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1' }],
        heading: ['2.5rem', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
};
