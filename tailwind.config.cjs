/** RUQ redesign base — design tokens live here, not in markup. */
module.exports = {
  content: ['./src/**/*.{html,mjs,js,json}', './scripts/**/*.mjs'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ────────────────────────────────────────────────
        // Supplied: #e8208f magenta, #00b9c6 cyan, #ffffff white.
        //
        // Measured against white:
        //   magenta 4.17:1  — large text / UI only, FAILS body text (4.5)
        //   cyan    2.40:1  — FAILS everything; a fill colour, never text on white
        //
        // So each brand hue has a darkened `-text` variant that clears 4.5:1.
        // Use DEFAULT for fills and large display type, `-text` for anything
        // set at body size. `-ink` backgrounds flip this: both brand hues are
        // safe as text on dark.
        magenta: {
          DEFAULT: '#e8208f',
          text: '#dc1e88',   // 4.57:1 on white — safe at any size
          deep: '#b81870',   // hover / pressed
          tint: '#fdeaf5',   // wash backgrounds
        },
        cyan: {
          DEFAULT: '#00b9c6',
          text: '#00838d',   // 4.52:1 on white
          deep: '#00949e',
          tint: '#e5f8fa',
        },
        ink: {
          DEFAULT: '#1c1c1c',
          soft: '#5a5a5a',
          line: '#e6e6e6',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '72rem' },
    },
  },
  plugins: [],
};
