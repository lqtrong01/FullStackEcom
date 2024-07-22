/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities }) {
      addUtilities({
        '.no-spinner': {
          '-webkit-appearance': 'none',
          '-moz-appearance': 'textfield',
        },
        '.no-spinner::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          'margin': 0,
        },
        '.no-spinner::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          'margin': 0,
        },
      });
    },
  ],
};