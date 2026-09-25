import './style.css'

document.getElementById('ano').textContent = new Date().getFullYear()
const anoCanto = document.getElementById('ano-canto')
if (anoCanto) anoCanto.textContent = new Date().getFullYear()

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    })
  },
  { threshold: 0.2 }
)
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

const cascadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    })
  },
  { threshold: 0.35 }
)
document.querySelectorAll('.cascade-reveal').forEach((el) => cascadeObserver.observe(el))

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

const lightbox = document.getElementById('lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const lightboxClose = document.getElementById('lightbox-close')
const lightboxPrev = document.getElementById('lightbox-prev')
const lightboxNext = document.getElementById('lightbox-next')
const lightboxDots = document.getElementById('lightbox-dots')
lightboxImg.draggable = false

// Fotos do artista aberto no momento, e qual delas está em destaque
let galleryImages = []
let currentIndex = 0

document.querySelectorAll('.portfolio-img').forEach((wrapper) => {
  wrapper.addEventListener('click', () => {
    const img = wrapper.querySelector('img')
    const galleryAttr = wrapper.dataset.gallery
    // Se o artista tem mais fotos (data-gallery), usa a lista toda.
    // Senão, é só essa foto mesmo — sem navegação.
    galleryImages = galleryAttr
      ? galleryAttr.split(',').map((src) => src.trim())
      : [img.getAttribute('src')]

    const startIndex = galleryImages.indexOf(img.getAttribute('src'))
    showMain(startIndex === -1 ? 0 : startIndex)
    lightbox.classList.add('is-open')
  })
})

let isAnimating = false

function showMain(index, direction = 0) {
  if (isAnimating) return
  isAnimating = true
  currentIndex = index
  resetZoom()

  // direction > 0: indo pra próxima (sai pela esquerda, entra pela direita)
  // direction < 0: voltando (sai pela direita, entra pela esquerda)
  // direction === 0: sem direção (primeira abertura, ou clique numa bolinha) — só encolhe/cresce no lugar
  const exitX = direction > 0 ? -50 : direction < 0 ? 50 : 0
  const enterFromX = direction > 0 ? 50 : direction < 0 ? -50 : 0

  // 1) a foto atual sai, encolhendo e indo pro lado
  lightboxImg.style.transform = `translateX(${exitX}px) scale(0.85)`
  lightboxImg.style.opacity = '0'

  lightboxImg.addEventListener(
    'transitionend',
    function swap() {
      // 2) troca a imagem e já a posiciona do lado oposto, sem transição (senão apareceria deslizando ao contrário)
      lightboxImg.classList.add('no-transition')
      lightboxImg.src = galleryImages[index]
      lightboxImg.style.transform = `translateX(${enterFromX}px) scale(0.85)`
      void lightboxImg.offsetWidth // força o navegador a "registrar" essa posição antes de animar
      lightboxImg.classList.remove('no-transition')

      // 3) a nova foto entra, crescendo até o tamanho normal
      lightboxImg.style.transform = 'translateX(0) scale(1)'
      lightboxImg.style.opacity = '1'
      isAnimating = false
    },
    { once: true }
  )

  renderNav()
}

function renderNav() {
  const hasMultiple = galleryImages.length > 1
  lightboxPrev.hidden = !hasMultiple
  lightboxNext.hidden = !hasMultiple
  lightboxPrev.disabled = currentIndex === 0
  lightboxNext.disabled = currentIndex === galleryImages.length - 1

  lightboxDots.innerHTML = ''
  if (!hasMultiple) return

  galleryImages.forEach((_, i) => {
    const dot = document.createElement('div')
    dot.className = 'lightbox-dot' + (i === currentIndex ? ' is-active' : '')
    dot.addEventListener('click', (e) => {
      e.stopPropagation()
      showMain(i, i > currentIndex ? 1 : -1)
    })
    lightboxDots.appendChild(dot)
  })
}

function goPrev(e) {
  e.stopPropagation()
  if (currentIndex > 0) showMain(currentIndex - 1, -1)
}
function goNext(e) {
  e.stopPropagation()
  if (currentIndex < galleryImages.length - 1) showMain(currentIndex + 1, 1)
}
lightboxPrev.addEventListener('click', goPrev)
lightboxNext.addEventListener('click', goNext)

// Setas do teclado, com o lightbox aberto
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return
  if (e.key === 'ArrowLeft') goPrev(e)
  if (e.key === 'ArrowRight') goNext(e)
  if (e.key === 'Escape') closeLightbox()
})

// Arrastar o dedo (celular) também navega entre as fotos
let touchStartX = 0
lightboxImg.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX
})
lightboxImg.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 40) return
  if (dx < 0) goNext(e)
  else goPrev(e)
})

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
  lightboxDots.innerHTML = ''
  resetZoom()
}
lightboxClose.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox()
})

lightboxImg.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    const rect = lightboxImg.getBoundingClientRect()
    const originX = ((e.clientX - rect.left) / rect.width) * 100
    const originY = ((e.clientY - rect.top) / rect.height) * 100
    lightboxImg.style.transformOrigin = `${originX}% ${originY}%`

    const direction = e.deltaY < 0 ? 1 : -1
    scale = Math.min(Math.max(scale + direction * 0.25, 1), 4)

    if (scale === 1) {
      panX = 0
      panY = 0
    }
    applyTransform()
  },
  { passive: false }
)

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
  if (!pointerMoved) resetZoom()
})