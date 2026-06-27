/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#F8F8F8',
        'grid': '#EFEFEF',
        'text': '#1A1A1A',
        'border': '#1A1A1A',
        'accent': '#1A1A1A',
      },
      fontFamily: {
        'sans': ['Hanken Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
        '5xl': '64px',
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      boxShadow: {
        'hard': '4px 4px 0px rgba(0, 0, 0, 1)',
        'hard-md': '6px 6px 0px rgba(0, 0, 0, 1)',
        'hard-lg': '8px 8px 0px rgba(0, 0, 0, 1)',
      },
      borderRadius: {
        'none': '0',
      },
    },
  },
  plugins: [],
}
