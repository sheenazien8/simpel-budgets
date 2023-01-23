/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./resources/js/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
