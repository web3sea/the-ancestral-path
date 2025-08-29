import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },
        sage: "var(--accent-sage)",
        "sage-light": "var(--accent-sage-light)",
        gold: "var(--accent-gold)",
        "gold-light": "var(--accent-gold-light)",
      },
      fontFamily: {
        "alex-brush": "var(--font-alex-brush)",
        "noto-serif-jp": "var(--font-noto-serif-jp)",
        kanit: "var(--font-kanit)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-sage": "var(--gradient-sage)",
        "gradient-sunset": "var(--gradient-sunset)",
      },
    },
  },
  plugins: [],
};

export default config;
