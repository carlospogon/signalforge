import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        panel: "#091224",
        line: "#18304d",
        glow: "#5ef2ff",
        steel: "#94a3b8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(94, 242, 255, 0.15), 0 18px 60px rgba(3, 8, 20, 0.45)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top, rgba(94, 242, 255, 0.12), transparent 35%), linear-gradient(rgba(24, 48, 77, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 48, 77, 0.35) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "100% 100%, 32px 32px, 32px 32px"
      }
    }
  },
  plugins: []
};

export default config;

