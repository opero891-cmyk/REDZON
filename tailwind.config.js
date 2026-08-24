/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111D",
        panel: "#111E2C",
        "panel-light": "#16283B",
        cyan: {
          DEFAULT: "#2DD4BF",
          glow: "#14b8a6",
          dark: "#0f766e"
        },
        amber: {
          DEFAULT: "#F4B860",
          bright: "#fbbf24"
        },
        emerald: {
          DEFAULT: "#10B981"
        },
        ruby: {
          DEFAULT: "#EF4444"
        },
        muted: "#91A5B8"
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
