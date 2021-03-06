const container = document.querySelector('#container')
const scroller = container.querySelector('.scroller')
const pagination = container.querySelector('.pagination')
let slides

let state = {
  activeIndex: 0,
  isFirst: false,
  isLast: false,
  total: 0,
}

function init () {
  slides = scroller.querySelectorAll('.slide')

  state = {
    ...state,
    total: slides.length,
  }

  updateNumberOfDotsInPaging()
  handleScrollToUpdateState()

  goToSlide(state.activeIndex)
}

function prevSlide() {
  let newIndex = state.activeIndex - 1
  if (newIndex < 0) newIndex = state.total-1

  goToSlide(newIndex)
}

function nextSlide () {
  let newIndex = state.activeIndex + 1
  if (newIndex >= state.total) newIndex = 0

  goToSlide(newIndex)
}

function goToSlide (index) {
  slides[state.activeIndex].classList.remove('current')
  pagination.children[state.activeIndex].classList.remove('current')


  state.activeIndex = index
  state.isFirst = state.activeIndex === 0
  state.isLast = state.activeIndex >= state.total-1

  scroller.scrollTo({
    left: Math.floor(container.clientWidth * state.activeIndex),
    behavior: 'smooth'
  })


  slides[state.activeIndex].classList.add('current')
  pagination.children[state.activeIndex].classList.add('current')

  if (state.isFirst) container.classList.add('is-first')
  else container.classList.remove('is-first')

  if (state.isLast) container.classList.add('is-last')
  else container.classList.remove('is-last')
}

//#region Autoplay
const autoplay = setInterval(nextSlide, 3000)

function handleFirstUserInteraction () {
  container.removeEventListener('touchstart', handleFirstUserInteraction)
  container.removeEventListener('mousedown', handleFirstUserInteraction)

  // Stop autoplay
  clearInterval(autoplay)
}

container.addEventListener('touchstart', handleFirstUserInteraction)
container.addEventListener('mousedown', handleFirstUserInteraction)
//#endregion Autoplay

//#region Pagination
function updateNumberOfDotsInPaging () {
  pagination.innerHTML = ''

  slides.forEach((slide, index) => {
    const dot = document.createElement('span')
    dot.addEventListener('click', () => {
      goToSlide(index)
    })
    pagination.append(dot)
  })
}

const handleScrollToUpdateState = debounce(() => {
  Array.from(pagination.children).forEach(dot => dot.classList.remove('current'))

  const newIndexFromScrollPosition = Math.round(scroller.scrollLeft / scroller.clientWidth)
  goToSlide(newIndexFromScrollPosition)
}, 100)

scroller.addEventListener('scroll', handleScrollToUpdateState, {
  passive: true
})
//#endregion Pagination

//#region Arrow navigation
container.querySelector('.prev-button').addEventListener('click', prevSlide)
container.querySelector('.next-button').addEventListener('click', nextSlide)
//#endregion Arrow navigation

//#region Keyboard navigation
window.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevSlide()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextSlide()
  }
})
//#endregion Keyboard navigation

// INIT HERE!
init()

// Restart when a new slide is added or removed from the DOM
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && (mutation.removedNodes || mutation.addedNodes)) {
      // console.log('REINIT!')
      init()
    }
  })
})
  .observe(scroller, {
    childList: true
  })




function debounce(callback, wait = 100) {
  let timer = null

  return () => {
    clearTimeout(timer)
    timer = setTimeout(callback, wait)
  }
}
