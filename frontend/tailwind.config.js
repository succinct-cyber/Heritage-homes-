/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Exact values from the Figma dev-mode CSS export — do not round further.
        cream: "#FAFAF4",       // page background
        "cream-soft": "#F4F4EE", // hero subtext on dark overlay
        charcoal: "#1A1A1A",    // footer / dark section background
        green: {
          DEFAULT: "#3F5D3A",   // brand green — buttons, trust strip, CTA banner
          text: "#284525",      // dark green — logo, stat numbers, active nav link
          light: "#ADD0A4",     // footer column headings (COMPANY/LEGAL etc.)
          50: "#EEF2EC",        // success banner background
          100: "#D9E2D6",       // light hover text on dark green backgrounds
          700: "#233b20",       // success banner text / button hover
        },
        muted: "#6B6B6B",        // body/subtext on light backgrounds
        "muted-dark": "#B8B8B8", // body/subtext on dark backgrounds
        "nav-border": "#C3C8BD", // navbar bottom border
        "nav-link": "#434840",   // default (inactive) nav link color
      },
      fontFamily: {
        serif: ["'Libre Caslon Text'", "Georgia", "serif"],
        sans: ["'Hanken Grotesk'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      letterSpacing: {
        widest2: "0.16em",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
}