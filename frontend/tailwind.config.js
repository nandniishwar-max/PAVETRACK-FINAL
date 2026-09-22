/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E3A8A",
          darkNavy: "#0F172A",
          red: "#DC2626",
          lightBlue: "#EFF6FF",
          border: "#E2E8F0"
        },
        status: {
          red: "#DC2626",
          yellow: "#D97706",
          blue: "#2563EB",
          green: "#059669"
        }
      }
    },
  },
  plugins: [],
}
