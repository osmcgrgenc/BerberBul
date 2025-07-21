/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'sm:px-6',
  ],
  theme: {
    extend: {
      boxShadow: {
        neumorphic:
          '4px 4px 6px rgba(0,0,0,0.06), -4px -4px 6px rgba(255,255,255,0.7)',
        'neumorphic-dark':
          '4px 4px 6px rgba(0,0,0,0.6), -4px -4px 6px rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}