export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#10212b',
        calm: '#e8f7f4',
        teal: '#0f8f83',
        mint: '#46d2a8',
        coral: '#f9735b',
        amber: '#f4b44b'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 35, 45, 0.11)'
      }
    }
  },
  plugins: []
};
