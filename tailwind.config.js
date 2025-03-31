/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#333333",
          dark: "#121212",
          light: "#555555"
        },
        secondary: {
          DEFAULT: "#777777",
          dark: "#555555",
          light: "#999999"
        },
        background: {
          DEFAULT: "#F8F9FA",
          dark: "#121318"
        },
        foreground: {
          DEFAULT: "#333333",
          dark: "#E1E1E6"
        },
        accent: {
          DEFAULT: "#000000",
          dark: "#FFFFFF"
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1E1E1E"
        },
        "card-hover": {
          DEFAULT: "#F3F4F6",
          dark: "#2A2A2A"
        },
        "card-muted": {
          DEFAULT: "#F9FAFB",
          dark: "#252525"
        }
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      opacity: {
        '10': '0.1',
        '15': '0.15',
        '85': '0.85',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        'dots-pattern': 'radial-gradient(#ffffff 1px, transparent 1px)',
        'diagonal-pattern': 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
      },
      backgroundSize: {
        'grid-size': '20px 20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 