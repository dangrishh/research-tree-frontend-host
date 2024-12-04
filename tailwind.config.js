module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg1920': { raw: '(min-width: 1920px) and (max-width: 1920px) and (min-height: 945px) and (max-height: 945px)' },
        'lg1912': { raw: '(min-width: 1912px) and (max-width: 1912px) and (min-height: 954px) and (max-height: 954px)' },
      },
      
     
    },
  },
  plugins: [],
};