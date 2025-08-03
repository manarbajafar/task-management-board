/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Tajawal', 'Arial', 'sans-serif'],
        'english': ['Inter', 'Arial', 'sans-serif'],
        'sans': ['Inter', 'Tajawal', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}