import './style.css'

// Ano no rodapé (evita ter que atualizar isso todo ano manualmente)
document.getElementById('ano').textContent = new Date().getFullYear()
const anoCanto = document.getElementById('ano-canto')
if (anoCanto) anoCanto.textContent = new Date().getFullYear()

// ---------- Menu mobile ----------
const menuToggle = document.getElementById('menu-toggle')
const menuMobile = document.getElementById('menu-mobile')

menuToggle.addEventListener('click', () => {
  menuMobile.classList.toggle('is-open')
})

menuMobile.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuMobile.classList.remove('is-open')
  })
})

// ---------- Revelação suave ao rolar (fotos e textos com a classe .reveal) ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  },
  { threshold: 0.2 }
)
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

// ---------- Barra de progresso de leitura ----------
const progressBar = document.getElementById('progress-bar')

function updateProgressBar() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  progressBar.style.width = `${progress}%`
}

// ---------- Cascata de texto: Hero e Manifesto usam a mesma lógica ----------
const cascadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    })
  },
  { threshold: 0.35 }
)
document.querySelectorAll('.cascade-reveal').forEach((el) => cascadeObserver.observe(el))

// ---------- Um único listener de scroll, usando requestAnimationFrame ----------
let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgressBar()
      ticking = false
    })
    ticking = true
  }
}
window.addEventListener('scroll', onScroll, { passive: true })
updateProgressBar()

// ---------- Lightbox: toca numa foto do portfólio e ela abre em tela cheia ----------
const lightbox = document.getElementById('lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const lightboxClose = document.getElementById('lightbox-close')

document.querySelectorAll('.portfolio-img').forEach((wrapper) => {
  wrapper.addEventListener('click', () => {
    const img = wrapper.querySelector('img')
    lightboxImg.src = img.src
    lightboxImg.alt = img.alt
    lightbox.classList.add('is-open')
  })
})

function closeLightbox() {
  lightbox.classList.remove('is-open')
}
lightboxClose.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox()
})
