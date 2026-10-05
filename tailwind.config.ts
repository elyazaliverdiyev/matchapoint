import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          'sans-serif',
        ],
        editorial: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          'sans-serif',
        ],
      },
      colors: {
        matcha: {
          50: '#F4F7F2',
          100: '#E6ECE2',
          200: '#CAD8C3',
          300: '#A7C09D',
          400: '#7E9C72',
          500: '#5A7D4D',
          600: '#45633A',
          700: '#344D2B',
          800: '#23361D',
          900: '#142310',
          950: '#0B1509',
        },
        cream: {
          50: '#FDFAF5',
          100: '#FAF6EE',
          200: '#F4EEDF',
          300: '#EDE4CB',
          400: '#E3D7B1',
        },
        berry: {
          500: '#A83258',
          600: '#8A2545',
          700: '#6E1B34',
        },
        boba: {
          800: '#2B1B14',
          900: '#1B100C',
        }
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1.5deg)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'float-reverse': 'float-reverse 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

export default config
