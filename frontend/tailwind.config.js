/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#E8EEE7',
          100: '#D4DED2',
          200: '#B8C9B5',
          300: '#9AB496',
          400: '#7DA078',
          500: '#5B7F6A',
          600: '#4A6B58',
          700: '#3A5747',
          800: '#30483B',
          900: '#253A2E',
          950: '#1A2B21',
        },
        cream: {
          50: '#FDFCFA',
          100: '#F7F4EA',
          200: '#F0EBD8',
          300: '#EFE8D8',
          400: '#E5DCC6',
          500: '#D4C9A8',
          600: '#B8AA82',
          700: '#9A8C64',
          800: '#7A6E4E',
          900: '#5C5339',
        },
        accent: {
          50: '#F5EDE3',
          100: '#EDDCC8',
          200: '#DFCAAA',
          300: '#D1B78C',
          400: '#C4A570',
          500: '#B88A5A',
          600: '#A07342',
          700: '#845D34',
          800: '#6B4A2A',
          900: '#533820',
        },
        muted: {
          red: '#A85D45',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(48,72,59,0.05)',
        'card': '0 8px 30px rgba(48,72,59,0.08)',
        'elevated': '0 12px 40px rgba(48,72,59,0.12)',
      },
    },
  },
  plugins: [],
}
