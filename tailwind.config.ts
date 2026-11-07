import type { Config } from "tailwindcss"

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
          DEFAULT: "#0F392B",
          dark: "#09241B",
          light: "#164E3D",
          soft: "#EBF3EE",
          lime: "#8FA336",
          gold: "#D97706",
        },
        surface: {
          DEFAULT: "#FAF9F5",
          card: "#FFFFFF",
          soft: "#F3EFEA",
        },
        line: {
          DEFAULT: "#E2E7E2",
          dark: "#D1DAD1",
        },
        ink: "#182520",
        muted: "#586A61",
        danger: {
          DEFAULT: "#B91C1C",
          soft: "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
