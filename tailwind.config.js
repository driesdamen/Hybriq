/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stable: '#22c55e',
        elevated: '#f59e0b',
        high: '#ef4444',
        surface: '#0f0f13',
        card: '#1a1a22',
        border: '#2a2a35',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
