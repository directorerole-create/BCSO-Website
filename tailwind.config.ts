import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Chakra Petch'", "monospace"],
        body: ["'Barlow'", "sans-serif"],
        mono: ["'Barlow Condensed'", "sans-serif"],
      },
      colors: {
        badge: {
          DEFAULT: "#C9A227",
          light: "#F0C84A",
          dark: "#9A7A1A",
        },
        dept: {
          navy: "#0A0E1A",
          dark: "#111827",
          panel: "#1A2035",
          border: "#2A3550",
          muted: "#3D4F6B",
        },
        alert: {
          red: "#E63946",
          blue: "#1D6FCC",
        },
      },
      animation: {
        "police-flash": "policeFlash 1s ease-in-out infinite",
        "scan": "scanLine 3s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        policeFlash: {
          "0%, 49%": { backgroundColor: "rgba(230, 57, 70, 0.15)", boxShadow: "0 0 30px rgba(230, 57, 70, 0.4)" },
          "50%, 100%": { backgroundColor: "rgba(29, 111, 204, 0.15)", boxShadow: "0 0 30px rgba(29, 111, 204, 0.4)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(201, 162, 39, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(201, 162, 39, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
