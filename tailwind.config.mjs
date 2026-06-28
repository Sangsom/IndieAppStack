/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        pine: "var(--color-pine)",
        "accent-soft": "var(--color-accent-soft)",
        gold: "var(--color-gold)",
        rule: "var(--color-rule)",
        danger: "var(--color-danger)",
        focus: "var(--color-focus)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        badge: "var(--radius-badge)",
      },
      boxShadow: {
        field: "var(--shadow-field)",
      },
      fontFamily: {
        serif: "var(--font-serif-display)",
        sans: "var(--font-sans-body)",
        mono: "var(--font-mono-label)",
      },
      fontSize: {
        "display-xl": ["4rem", { lineHeight: "1.02" }],
        "display-lg": ["3rem", { lineHeight: "1.08" }],
        "display-md": ["2.25rem", { lineHeight: "1.14" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-md": ["1rem", { lineHeight: "1.625rem" }],
        "label-sm": ["0.75rem", { lineHeight: "1rem" }],
      },
    },
  },
};

export default config;
