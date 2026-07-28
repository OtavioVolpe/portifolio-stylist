# Portfólio — Stylist

Site portfólio para apresentar o trabalho de styling em shows, clipes e eventos.

## Stack

- [Vite](https://vite.dev) — build tool e dev server
- [Tailwind CSS](https://tailwindcss.com) — estilização utilitária
- HTML + JavaScript puro

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/`, pronta para deploy.

## Estrutura

```
portfolio-stylist/
├── index.html          # estrutura das seções
├── src/
│   ├── main.js          # lógica JS (menu mobile, etc.)
│   └── style.css        # import do Tailwind + estilos globais
├── public/
│   └── favicon.svg
└── vite.config.js       # config do Vite + plugin do Tailwind
```

## Deploy

Publicado via GitHub Pages / Vercel (ver plano do projeto).
