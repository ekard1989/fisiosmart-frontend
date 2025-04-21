module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#56CCF2',
          DEFAULT: '#2d9cdb',
          dark: '#2b6cb0',
        },
        secondary: {
          DEFAULT: '#27AE60',
        },
        warning: '#F2C94C',
        danger: '#EB5757',
      },
    },
  },
  plugins: [],
}