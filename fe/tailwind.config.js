/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#101223",
        secondary: "#5B5D6B",
        ternary: "#ED5E8A",
        quaternary: "#D2D4DA",
        quinary: "#366C9B",
      },
      fontFamily: {
        hanson: "hanson",
      },
      boxShadow: {
        c1: "0px 0px 10px 0px rgba(0, 0, 0, 0.10)",
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require('daisyui')],
}

