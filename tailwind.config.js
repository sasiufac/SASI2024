/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "powder-blue": "#b2b9d4",
        "celtic-blue": "#0c6bc7",
        "delft-blue": "#1b346b",
        eminence: "#5d2b80",
        "oxford-blue": "#0a2344",
        "oxford-blue-2": "#112a4b",
        tekhelet: "#3e266d",
        khaki: "#bcaf9e",
        "violet-blue": "#4b49b1",
        "delft-blue-2": "#152f57",
      },
      fontFamily: {
        pixelify: ['"Pixelify Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
