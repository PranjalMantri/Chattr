import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse-slow 2.5s ease-in-out infinite",
        "pulse-mid": "pulse-slow 1.8s ease-in-out infinite",
        "pulse-fast": "pulse-slow 1.2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [daisyui],
};
