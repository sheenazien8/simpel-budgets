/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./resources/js/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translate3d(-10px, 0, 0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
