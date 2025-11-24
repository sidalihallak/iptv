const withMaterialColor = require('./utils/material');
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: 'white',
        black: 'black',
      },
    },
  },
  plugins: [],
};

module.exports = withMaterialColor(
    config,
    '#029792' // Replace with your source color
);