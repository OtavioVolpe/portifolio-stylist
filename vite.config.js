import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portifolio-stylist/',
  plugins: [
    tailwindcss(),
  ],
})