/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "hsl(222, 47%, 5%)",
        bgSurface: "hsl(222, 36%, 11%)",
        accentEmerald: "hsl(162, 76%, 41%)",
        accentCyan: "hsl(188, 86%, 43%)",
        accentAmber: "hsl(38, 92%, 50%)",
        accentRose: "hsl(343, 90%, 60%)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
