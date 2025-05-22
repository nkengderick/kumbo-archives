/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "kumbo-green": {
          50: "#f0f9f6",
          100: "#dcf2e9",
          200: "#bce5d6",
          300: "#8dd1bb",
          400: "#5bb59c",
          500: "#3a9b82",
          600: "#2d7d6a",
          700: "#266557",
          800: "#1D5E4F", // Primary color from proposal
          900: "#1a4a3d",
        },
        "kumbo-tan": {
          50: "#faf9f7",
          100: "#f2f0ec",
          200: "#e6e1d8",
          300: "#D4B996", // Secondary color from proposal
          400: "#c5a878",
          500: "#b8975d",
          600: "#a8864f",
          700: "#8b6d42",
          800: "#725a37",
          900: "#5d492e",
        },
        "kumbo-gold": {
          50: "#fefdf8",
          100: "#fdfaeb",
          200: "#faf2d1",
          300: "#f5e6ab",
          400: "#efd67d",
          500: "#B68D40", // Accent color from proposal
          600: "#d4a838",
          700: "#b8892a",
          800: "#956d25",
          900: "#795823",
        },
      },
      fontFamily: {
        heading: ["Libre Baskerville", "serif"],
        body: ["Open Sans", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-5px)" },
          "60%": { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};
