import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0085CA",
          green: "#1D9E75",
          amber: "#BA7517",
          red: "#A32D2D",
        },
      },
    },
  },
  plugins: [],
};

export default config;
