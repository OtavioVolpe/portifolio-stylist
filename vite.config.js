import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// A Vercel define sozinha a variável de ambiente VERCEL durante o build dela.
// Se ela existir, publicamos na raiz (como a Vercel espera).
// Se não existir (é o caso do GitHub Actions/GitHub Pages), usamos a subpasta do repositório.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/portifolio-stylist/',
  plugins: [
    tailwindcss(),
  ],
})
