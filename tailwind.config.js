/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'move-up-down': 'moveUpDown 2s ease-in-out infinite',
      },
      keyframes: {
        moveUpDown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      colors: {
        'highlight-blue': '#007bff',
        'highlight-yellow': '#ffeb3b',
        'highlight-red': '#ff5722',
      },
    },
  },
  variants: {
    scrollbar: ['dark'],
    extend: {
      order: ['responsive', 'hover', 'focus', 'group-hover'],
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
