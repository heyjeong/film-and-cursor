// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { 
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'narrow': ['Archivo Narrow', 'sans-serif'],
      },
    } 
  },
  plugins: [],
}
