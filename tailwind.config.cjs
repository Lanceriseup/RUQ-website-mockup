/** RUQ redesign base — design tokens live here, not in markup. */
module.exports = {
  content: ['./src/**/*.{html,mjs,js,json}', './scripts/**/*.mjs'],
  theme: {
    extend: {
      colors: {
        // Sampled from the live riseupqueens.com stylesheets.
        cream:    { DEFAULT: '#EEEADD', dark: '#E4DAD1' },
        blush:    { DEFAULT: '#E4D1D1', deep: '#D9B8B8' },
        sage:     '#D1E4DD',
        periwinkle: '#D1D1E4',
        ink:      { DEFAULT: '#333333', soft: '#5A5A5A', deep: '#1C1C1C' },
        rose:     { DEFAULT: '#B76E79', dark: '#8E5560' }, // accent for CTAs
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '72rem' },
    },
  },
  plugins: [],
};
