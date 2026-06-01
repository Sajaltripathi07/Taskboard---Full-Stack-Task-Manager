/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink:     '#0F0E11',
        paper:   '#F7F5F0',
        mist:    '#E8E5DE',
        ash:     '#C4BFB5',
        smoke:   '#7A7570',
        accent:  '#E8552B',
        todo:    '#3B7DD8',
        prog:    '#D4820A',
        done:    '#2A9D60',
      },
      boxShadow: {
        card:  '0 2px 8px rgba(15,14,17,0.08), 0 0 0 1px rgba(15,14,17,0.05)',
        modal: '0 24px 80px rgba(15,14,17,0.22)',
        lift:  '0 8px 32px rgba(15,14,17,0.14)',
      },
    },
  },
  plugins: [],
}
