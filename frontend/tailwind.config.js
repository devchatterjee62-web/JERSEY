/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050505',
        'brand-white': '#EDEDED',
        'brand-neon': '#A3FF12',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'anton': ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [],
}