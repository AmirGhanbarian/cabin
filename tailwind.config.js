/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#2d2b28',
          800: '#1c1b19',
          900: '#121110',
          950: '#0a0908',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f1ea',
          300: '#ede7db',
          400: '#e0d8c7',
          500: '#cdc1a8',
        },
        brass: {
          50: '#fbf8f3',
          100: '#f5ecdc',
          200: '#ead7b4',
          300: '#ddbe87',
          400: '#d0a65e',
          500: '#b08d57',
          600: '#9a7a4a',
          700: '#7e623b',
          800: '#654e30',
          900: '#4d3b24',
        },
        sage: {
          50: '#f4f6f4',
          100: '#e6ebe4',
          200: '#ccd8ca',
          300: '#a8c0a5',
          400: '#82a47e',
          500: '#658b62',
          600: '#4e704c',
          700: '#3d583b',
          800: '#314630',
          900: '#283828',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        persian: ['Vazirmatn', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
