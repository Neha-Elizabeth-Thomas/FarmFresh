import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
})
/*
  To enable dark mode in Tailwind CSS, you need a `tailwind.config.js` file.
  Vite plugins like `@tailwindcss/vite` do not create this file automatically.
  You can generate it by running:
    npx tailwindcss init
  Then, in `tailwind.config.js`, add:
    module.exports = {
      darkMode: 'class', // or 'media'
      // ...other config
    }
  This tells Tailwind to use dark mode based on a CSS class or media query.
*/