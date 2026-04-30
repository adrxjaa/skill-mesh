/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12131A",
        "surface-low": "#1A1B22",
        "surface-card": "#1C1C1F",
        "rich-orange": "#F27121",
        "graphite-900": "#0E0F14",
        "graphite-800": "#151720",
        "graphite-700": "#1E202B",
        "graphite-600": "#2A2D3A",
        "muted-500": "#9AA0AF",
        "muted-400": "#B2B7C4",
        "muted-300": "#CCD1DD",
        "signal-green": "#33C36B",
        "signal-amber": "#F2B721",
        "signal-red": "#EF5350",
      },
      fontFamily: {
        heading: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        "h1-lg": ["40px", { lineHeight: "1.1", fontWeight: "600" }],
        "h2-lg": ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        "h3-lg": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.6" }],
        "body-md": ["14px", { lineHeight: "1.6" }],
        "label-caps": ["11px", { lineHeight: "1.3", letterSpacing: "0.3em", fontWeight: "600" }],
      },
      borderRadius: {
        card: "16px",
        action: "12px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 18px 40px rgba(0, 0, 0, 0.3)",
        glow: "0 0 0 1px rgba(242, 113, 33, 0.3)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      backgroundImage: {
        "page-gradient": "radial-gradient(circle at top, rgba(242, 113, 33, 0.12), transparent 55%), radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.08), transparent 45%)",
      },
    },
  },
  plugins: [],
}
