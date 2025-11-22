import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './posts/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
}