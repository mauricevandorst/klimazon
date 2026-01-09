module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js,css}",
    "./docs/**/*.html",
    "./docs/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};