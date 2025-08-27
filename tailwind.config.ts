import type { Config } from "tailwindcss";

 export default {
  content: [ 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ".flowbite-react\\class-list.json"
   ],
   darkMode: 'media',
  theme: {
    fontFamily: {
      customFont: ["-apple-system","BlinkMacSystemFont","Segoe UI","Noto Sans","Helvetica","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji"]
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require('flowbite/plugin')],
} satisfies Config;