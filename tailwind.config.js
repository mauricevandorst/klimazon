// tailwind.config.js
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js,css}",
    "./docs/**/*.html",
    "./docs/js/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // één zachte highlight die over je tekst schuift
        'shimmer-text':
          'linear-gradient(110deg, rgba(255,255,255,1) 0%, rgba(255, 255, 255, 0.75) 45%, rgba(255,255,255,1) 70%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-250% 0' },
          '100%': { backgroundPosition: '250% 0' },
          '0%': { backgroundPosition: '-250% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
