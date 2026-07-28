import './style.css'

// Ano no rodapé (evita ter que atualizar isso todo ano manualmente)
document.getElementById('ano').textContent = new Date().getFullYear()

// Menu mobile: abre/fecha ao clicar no botão "Menu"
const menuToggle = document.getElementById('menu-toggle')
const menuMobile = document.getElementById('menu-mobile')

menuToggle.addEventListener('click', () => {
  menuMobile.classList.toggle('hidden')
})

// Fecha o menu mobile ao clicar em qualquer link dele
menuMobile.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuMobile.classList.add('hidden')
  })
})
