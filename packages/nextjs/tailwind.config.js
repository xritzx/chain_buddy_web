/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#F8712C",
          "primary-content": "#FFE9E8",
          secondary: "#FFAF72",
          "secondary-content": "#6B4C10",
          accent: "#FF9506",
          "accent-content": "#FFF4E6",
          neutral: "#E8E6E6",
          "neutral-content": "#0B0402",
          "base-100": "#FFFEFD",
          "base-200": "#FFFCF5",
          "base-300": "#FFF9ED",
          "base-content": "#0B0402",
          info: "#F88A67",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      {
        dark: {
          primary: "#2E273F",
          "primary-content": "#FFEAF8",
          secondary: "#40374F",
          "secondary-content": "#FFEAF8",
          accent: "#FFDFF4",
          "accent-content": "#18122B",
          neutral: "#908B9A",
          "neutral-content": "#18122B",
          "base-100": "#18122B",
          "base-200": "#2B223C",
          "base-300": "#40374F",
          "base-content": "#F9FBFF",
          info: "#ffb698",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: { "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
      fontFamily: {
        pixel: ['MinecraftRegular', 'MinecraftBold'],
      },
      backgroundImage: {
        'hero-pattern': "url('/bg.png')"
      }
    },
  },
};
