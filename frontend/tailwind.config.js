import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo 500
          dark: '#4338ca',    // Indigo 700
        },
        brand: {
          50: '#f5f3ff',
          500: '#6366f1',
          700: '#4338ca',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#111827',
        },
        input: '#d1d5db',
      },
      borderRadius: {
        'xl2': '1rem'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [
    forms({ strategy: 'class' }),
  ],
}