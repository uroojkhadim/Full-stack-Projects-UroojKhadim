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
        // Derived from 6 STARS HOSPITALITY Official Logo
        brand: {
          navy: {
            950: '#060B13',
            900: '#0A1322', // Primary deep navy from logo lettering
            800: '#0F1C32',
            700: '#162847',
            600: '#1F3760',
            500: '#2A4A80',
          },
          gold: {
            50: '#FDFBF7',
            100: '#F7F2E7',
            200: '#EFE4CD',
            300: '#DFC38A',
            400: '#D4AF37', // Accent gold
            500: '#C5A059', // Primary burnished gold from logo 6 & star
            600: '#B08B44',
            700: '#8E6E32',
            800: '#6D5323',
            900: '#4D3915',
          },
          cream: {
            50: '#FCFBF9',
            100: '#F8F5EE', // Warm off-white / alabaster from logo wall
            200: '#F2ECE0',
            300: '#E8DEC9',
            400: '#DCB0A',
          },
          charcoal: {
            950: '#080A0E',
            900: '#0E1117',
            800: '#151922',
            700: '#1E2330',
            600: '#2C3345',
          }
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gold-gradient': 'linear-gradient(135deg, #E6C87C 0%, #C5A059 50%, #9A7232 100%)',
        'subtle-gold-gradient': 'linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
        'navy-charcoal-gradient': 'linear-gradient(180deg, #0A1322 0%, #080A0E 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(15, 28, 50, 0.6) 0%, rgba(10, 19, 34, 0.9) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.3)',
        'luxury-card': '0 12px 36px -10px rgba(6, 11, 19, 0.7)',
      }
    },
  },
  plugins: [],
}
