const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        colors: {
          green: {
            900: "#292524"
          },
          deep_orange: {
            50: "#fbe9e7",
            100: "#ffccbc",
            200: "#ffab91",
            300: "#ff8a65",
            400: "#ff7043",
            500: "#ff5722",
            600: "#f4511e",
            700: "#e64a19",
            800: "#d84315",
            900: "#bf360c",
          },
          gray: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#bdbdbd",
            500: "#9e9e9e",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
          },
          blue_gray: {
            50: "#eceff1",
            100: "#cfd8dc",
            200: "#b0bec5",
            300: "#90a4ae",
            400: "#78909c",
            500: "#607d8b",
            600: "#546e7a",
            700: "#455a64",
            800: "#37474f",
            900: "#263238",
          },
          red: {
            50: "##ffebee",
            100: "#ffcdd2",
            200: "#ef9a9a",
            300: "#e57373",
            400: "#ef5350",
            500: "#f44336",
            600: "#e53935",
            700: "#d32f2f",
            800: "#c62828",
            900: "#b71c1c",
          }
    },  extend: {},
  },
  plugins: [],
});
