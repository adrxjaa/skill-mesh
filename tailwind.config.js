/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d0d14',
        'card-bg': '#1a1a24',
        'input-bg': '#242430',
        'primary': '#f97316',
        'primary-hover': '#ea6c0a',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'border-color': '#2e2e3d',
        'skill-tag': '#2e2e3d',
      }
    }
  },
  plugins: [],
}
