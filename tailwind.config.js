/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D3648",
        secondary: "#E8B04B",
        accent: "#4A90E2",
        surface: "#FFFFFF",
        background: "#F8F9FA",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
        info: "#17A2B8",
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      gridTemplateColumns: {
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
}