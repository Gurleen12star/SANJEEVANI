/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanjeevani: {
          green: '#15803d',
          lightGreen: '#4ade80',
          darkGreen: '#14532d',
          blue: '#1e3a8a',
          lightBlue: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
