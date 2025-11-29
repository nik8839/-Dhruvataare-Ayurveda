/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        medical: {
          blue: "#0ea5e9",
          teal: "#14b8a6",
          green: "#10b981",
          purple: "#8b5cf6",
        },
      },
      backgroundImage: {
        "medical-gradient":
          "linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #8b5cf6 100%)",
        "medical-gradient-blue":
          "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
        "medical-gradient-teal":
          "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        "medical-gradient-green":
          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "medical-gradient-purple":
          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      boxShadow: {
        medical:
          "0 10px 30px rgba(14, 165, 233, 0.15), 0 4px 10px rgba(14, 165, 233, 0.1)",
        "medical-lg":
          "0 20px 50px rgba(14, 165, 233, 0.2), 0 8px 20px rgba(14, 165, 233, 0.15)",
      },
    },
  },
  plugins: [],
};
