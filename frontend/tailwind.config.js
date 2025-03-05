/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DA9F5B",
        secondary: "#33211D",
        dark: "#33211D",
        coffee: "#656565",
        light: "#FFF8F0",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "overlay-top": "url('/img/overlay-top.png')",
        "overlay-bottom": "url('/img/overlay-bottom.png')",
        "coffee-pattern": "url('/img/coffee-pattern.jpg')",
      },
    },
  },
  plugins: [],
};
