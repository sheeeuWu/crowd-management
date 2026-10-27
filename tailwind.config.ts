import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        sidebar: {
          bg: "#061f24",
          hover: "#0a3139",
          active: "#0e444f",
          border: "#103c45",
          text: "#94a3b8",
          textActive: "#ffffff",
        },
        status: {
          high: "#ef4444",
          medium: "#f59e0b",
          low: "#10b981",
        },
      },
    },
  },
  plugins: [],
};
export default config;