import './style.css'

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
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    })
  },
  { threshold: 0.2 }
)
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

// ---------- Cascata de texto: Hero, Sobre, Portfólio e Contato usam a mesma lógica ----------
const cascadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    })
  },
  { threshold: 0.35 }
)
document.querySelectorAll('.cascade-reveal').forEach((el) => cascadeObserver.observe(el))

// ---------- Barra de progresso de leitura ----------
const progressBar = document.getElementById('progress-bar')

function updateProgressBar() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  progressBar.style.width = `${progress}%`
}

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
lightboxImg.draggable = false

document.querySelectorAll('.portfolio-img').forEach((wrapper) => {
  wrapper.addEventListener('click', () => {
    const img = wrapper.querySelector('img')
    lightboxImg.src = img.src
    lightboxImg.alt = img.alt
    lightbox.classList.add('is-open')
    resetZoom()
  })
})

// Estado do zoom/pan: escala atual e o quanto a foto está deslocada
let scale = 1
let panX = 0
let panY = 0
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let panStartX = 0
let panStartY = 0
let pointerMoved = false

function applyTransform() {
  lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`
  lightboxImg.classList.toggle('is-zoomed', scale > 1)
}

function resetZoom() {
  scale = 1
  panX = 0
  panY = 0
  lightboxImg.style.transformOrigin = 'center center'
  applyTransform()
}

function closeLightbox() {
  lightbox.classList.remove('is-open')
  resetZoom()
}
lightboxClose.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox()
})

// Rodinha do mouse: zoom exatamente onde o cursor está, não no centro
lightboxImg.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    const rect = lightboxImg.getBoundingClientRect()
    // Posição do mouse dentro da foto, em porcentagem (0% a 100%)
    const originX = ((e.clientX - rect.left) / rect.width) * 100
    const originY = ((e.clientY - rect.top) / rect.height) * 100
    lightboxImg.style.transformOrigin = `${originX}% ${originY}%`

    const direction = e.deltaY < 0 ? 1 : -1
    scale = Math.min(Math.max(scale + direction * 0.25, 1), 4)

    // Sem zoom, não faz sentido manter a foto deslocada
    if (scale === 1) {
      panX = 0
      panY = 0
    }
    applyTransform()
  },
  { passive: false }
)

// Clicar e arrastar: só funciona depois que já tem zoom aplicado
lightboxImg.addEventListener('pointerdown', (e) => {
  if (scale <= 1) return
  isDragging = true
  pointerMoved = false
  dragStartX = e.clientX
  dragStartY = e.clientY
  panStartX = panX
  panStartY = panY
  lightboxImg.classList.add('is-dragging')
  lightboxImg.setPointerCapture(e.pointerId)
})

lightboxImg.addEventListener('pointermove', (e) => {
  if (!isDragging) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pointerMoved = true
  panX = panStartX + dx
  panY = panStartY + dy
  applyTransform()
})

lightboxImg.addEventListener('pointerup', (e) => {
  lightboxImg.classList.remove('is-dragging')
  isDragging = false
  // Se o mouse não se moveu, foi um clique de verdade — reseta o zoom
  if (!pointerMoved) resetZoom()
})