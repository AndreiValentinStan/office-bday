import type { Config } from "tailwindcss";
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

 export default {
  content: [ 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
<<<<<<< HEAD
    ".flowbite-react\\class-list.json"
  ],
=======
   ],
   darkMode: 'media',
>>>>>>> af93fd070ad0f27daf24da9886db9db7ee391b66
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
<<<<<<< HEAD
  plugins: [flowbiteReact],
=======
  plugins: [],
>>>>>>> af93fd070ad0f27daf24da9886db9db7ee391b66
} satisfies Config;