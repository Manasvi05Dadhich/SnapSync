/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Playfair Display', 'serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        lavender: {
          DEFAULT: '#C5B4E3',
          light: '#E8E0F5',
          subtle: '#F3EFF9',
        },
        'soft-pink': {
          DEFAULT: '#F5B8C4',
        },
        'warm-orange': {
          DEFAULT: '#F4A261',
        },
      },
    },
  },
  plugins: [],
}
