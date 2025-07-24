/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  

  /** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4F46E5",     // indigo
          secondary: "#22D3EE",   // light-blue
          accent: "#FBBF24",      // yellow
          muted: "#9CA3AF",       // gray
          background: "#F9FAFB",
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          heading: ['Montserrat', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  