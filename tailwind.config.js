module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js,css}",
    "./dist/**/*.html",
    "./dist/js/**/*.js",
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