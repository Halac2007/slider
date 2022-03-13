!(function (e) {
  'undefined' == typeof module ? (this.charming = e) : (module.exports = e)
})(function (e, n) {
  'use strict'
  n = n || {}
  var t = n.tagName || 'span',
    o = null != n.classPrefix ? n.classPrefix : 'char',
    r = 1,
    a = function (e) {
      for (var n = e.parentNode, a = e.nodeValue, c = a.length, l = -1; ++l < c; ) {
        var d = document.createElement(t)
        o && ((d.className = o + r), r++), d.appendChild(document.createTextNode(a[l])), n.insertBefore(d, e)
      }
      n.removeChild(e)
    }
  return (
    (function c(e) {
      for (var n = [].slice.call(e.childNodes), t = n.length, o = -1; ++o < t; ) c(n[o])
      e.nodeType === Node.TEXT_NODE && a(e)
    })(e),
    e
  )
})
const blocks = []
const videos = []
const sections = []
const alignright = [0, 3, 5]
const blockEls = [...document.querySelectorAll('.l-block')]
const bkg = document.querySelector('.l-bkg')
const scrim = bkg.querySelector('.l-scrim')
const gradient = bkg.querySelector('.l-gradient')
const share = document.querySelector('.l-share')
const scrollEl = document.querySelector('.l-scroll')
const scrollProgress = scrollEl.querySelector('.l-scroll-progress')
const blockContainer = document.querySelector('.l-block-container')

let wWidth, wHeight
let currentvid = 0
let previousvid
let containerHeight
let lastPercentScrolled

//UTILS//////////////////////////////////////

// Map number x from range [a, b] to [c, d]
const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c

// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b

const calcWinsize = () => {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight),
  }
}

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const getHeight = (el) => {
  return el.getBoundingClientRect().height
}
const getWidth = (el) => {
  return el.getBoundingClientRect().width
}
const getPositionTop = (el) => {
  const rect = el.getBoundingClientRect(),
    scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return rect.top + scrollTop
}
const constrain = (n, low, high) => {
  return Math.max(Math.min(n, high), low)
}
const getMediaSize = (elementWidth, sizes, offset) => {
  const mediaSizes = sizes || [320, 640, 900, 1254]
  offset = offset || 0
  let selectedWidth = mediaSizes[mediaSizes.length - 1]
  let i = mediaSizes.length
  const sizeOffset = elementWidth * (offset / 100)

  while (i--) {
    if (elementWidth - sizeOffset <= mediaSizes[i]) {
      selectedWidth = mediaSizes[i]
    }
  }
  return selectedWidth
}

const findFirstAndLast = (arr, x) => {
  let n = arr.length
  let first = -1,
    last = -1
  for (let i = 0; i < n; i++) {
    if (x != +arr[i].videoId) continue
    if (first == -1) first = i
    last = i
  }
  if (first != -1) {
    return [first, last]
  }
}
//////////////////////////////////sections///////////////////////////////////
const initSections = () => {
  const dots = [...scrollEl.querySelectorAll('.l-scroll-dot')]
  ;[...blockContainer.querySelectorAll('.l-section')].forEach((el, index) => {
    const obj = {}
    obj.el = el
    obj.dot = dots[index]
    sections.push(obj)

    obj.dot.addEventListener('click', () => {
      if (obj.top) window.scrollTo(0, obj.top)
    })
  })
}

//////////////////////////////////BLOCKS///////////////////////////////////

const initBlocks = () => {
  blockEls.forEach((el, index) => {
    const obj = {}
    obj.index = index
    obj.el = el
    obj.videoId = el.dataset.vid
    obj.isIntro = el.classList.contains('l-intro')
    obj.isQuote = el.classList.contains('l-pullquote')
    obj.isLetters = el.classList.contains('l-letters')
    obj.isSubhead = el.classList.contains('l-subhead')
    obj.isMedia = el.classList.contains('l-media')
    obj.isMobileSpace = el.classList.contains('l-mobile-videospace')
    obj.videl = el.querySelector('.l-video-inline')

    if (obj.videl) {
      obj.videoSlug = obj.videl.dataset.slug
      obj.isInlineAutoplay = obj.videl.classList.contains('l-video-inline-autoplay')
      obj.audio = obj.videl.querySelector('.l-video-audio')
    }
    if (obj.isSubhead) {
      obj.drop = obj.el.querySelector('.l-drop')
    }
    blocks.push(obj)
  })
  console.log(blocks)
}
//background videos
const initVideos = () => {
  ;[...document.querySelectorAll('.l-video-bkg')].forEach((el, index) => {
    const obj = {}
    obj.index = index
    obj.videl = el
    obj.videoSlug = el.dataset.slug
    obj.isplaying = false
    const firstLast = findFirstAndLast(blocks, index)
    if (firstLast) {
      obj.firstBlock = firstLast[0]
      obj.lastBlock = firstLast[1]
    }
    videos.push(obj)
  })
  console.log(videos)
}

const buildVideo = (block, bool) => {
  const sizes = isMobilePortrait && !block.isInlineAutoplay ? [320, 640, 900] : [320, 640, 900, 1254, 1600, 2000]
  const vidWidth = getMediaSize(getWidth(block.videl), sizes)
  const slug = isMobilePortrait && !block.isInlineAutoplay ? `${block.videoSlug}-mobile` : block.videoSlug
  const url = `images/${slug}-${vidWidth}.jpg`
  const poster = `images/${slug}-${vidWidth}.jpg`
  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.loop = true
  video.setAttribute('muted', '')
  video.setAttribute('webkit-playsinline', 'webkit-playsinline')
  video.setAttribute('playsinline', 'playsinline')
  video.setAttribute('poster', poster)
  video.autoplay = bool ? true : false
  video.src = url
  video.addEventListener('playing', () => {
    block.isplaying = true
  })
  video.addEventListener('pause', () => {
    block.isplaying = false
  })

  block.videl.appendChild(video)
  block.video = video
  block.loaded = true

  if (bool & !block.isplaying) {
    block.video.pause()
    setTimeout(() => {
      block.video.play()
    }, 0)
  }
  if (block.audio) {
    block.audio.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false
        block.audio.classList.add('unmuted')
      } else {
        video.muted = true
        block.audio.classList.remove('unmuted')
      }
    })
  }
}
const buildInlineVideo = (block) => {
  const video = document.createElement('video')
  video.preload = 'auto'
  video.setAttribute('webkit-playsinline', 'webkit-playsinline')
  video.setAttribute('playsinline', 'playsinline')
  video.autoplay = false

  const source1 = document.createElement('source')
  source1.setAttribute('src', `images/${block.videoSlug}.png`)
  source1.setAttribute('type', 'images/png')
  video.appendChild(source1)

  const source2 = document.createElement('source')
  source2.setAttribute('src', `images/${block.videoSlug}.gif`)
  source2.setAttribute('type', 'images/gif')
  video.appendChild(source2)

  video.addEventListener('playing', () => {
    block.isplaying = true
    if (!block.videl.classList.contains('l-playing')) block.videl.classList.add('l-playing')
  })
  video.addEventListener('pause', () => {
    block.isplaying = false
  })
  video.addEventListener('ended', () => {
    block.isplaying = false
    if (block.videl.classList.contains('l-playing')) block.videl.classList.remove('l-playing')
  })

  block.videl.appendChild(video)
  block.video = video
  block.loaded = true

  block.videl.addEventListener('click', () => {
    if (block.isplaying) {
      block.video.pause()
    } else {
      block.video.play()
    }
  })
}

const initLetters = () => {
  ;[...document.querySelectorAll('.l-letters-effect')].forEach((el, index) => {
    charming(el)
  })
}

//////////////////////////////////RESIZE/SCROLL///////////////////////////////////
const onResize = () => {
  wWidth = Math.max(document.documentElement.clientWidth, window.innerWidth)
  wHeight = window.innerHeight
  isMobilePortrait = wWidth <= 768 && wWidth / wHeight < 1

  blocks.forEach((block, index) => {
    block.top = getPositionTop(block.el)
    block.height = getHeight(block.el)
    block.bottom = block.top + block.height
    if (block.videl) {
      block.vidtop = getPositionTop(block.videl)
      block.vidbottom = block.vidtop + getHeight(block.videl)
    }
  })
  videos.forEach((video, index) => {
    if (video.firstBlock) video.top = blocks[video.firstBlock].top
    if (video.lastBlock) video.bottom = blocks[video.lastBlock].bottom
  })
  containerHeight = getHeight(blockContainer)
  sections.forEach((section, index) => {
    section.top = getPositionTop(section.el)
    section.dot.style.top = `${(section.top / containerHeight) * 100}%`
  })

  onScroll()
}

const onScroll = () => {
  const scroll =
    window.scrollY ||
    window.pageYOffset ||
    document.body.scrollTop + ((document.documentElement && document.documentElement.scrollTop) || 0)

  //////BKG VIDEO LOADING////////////////////////////
  videos.forEach((video, index) => {
    const loadOffsetY = wHeight * 3.5
    if (video.bottom + loadOffsetY >= scroll && video.top <= scroll + loadOffsetY) {
      //load
      if (!video.loaded) {
        if (!video.video) buildVideo(video)
      }
    } else {
      //unload?
    }
  })
  //////BLOCKS////////////////////////////
  blocks.forEach((block, index) => {
    const offsetY = block.isIntro && block.isLetters ? 0 : block.isSubhead ? wHeight * 0.25 : wHeight * 0.75
    const offsetYBot = wWidth < 1024 ? wHeight * 0.75 : wHeight * 0.65
    const loadOffsetY = wHeight * 3.5
    let offset, percentScrolled

    //inline video loading
    if (block.bottom + loadOffsetY >= scroll && block.top <= scroll + loadOffsetY) {
      //load
      if (block.videl && !block.video) {
        if (block.isInlineAutoplay) {
          buildVideo(block)
        } else {
          buildInlineVideo(block)
        }
      }
    } else {
      //unload?
    }

    if (block.bottom - offsetYBot >= scroll && block.top <= scroll + offsetY) {
      if (!block.el.classList.contains('g-active')) {
        block.el.classList.add('g-active')

        /////////has vidid
        if (block.videoId) {
          if (bkg.classList.contains('l-dim')) bkg.classList.remove('l-dim')

          if (currentvid !== block.videoId) {
            previousvid = currentvid
            if (previousvid !== undefined) {
              if (videos[previousvid].video) videos[previousvid].video.pause()
              videos[previousvid].videl.style.opacity = 0
            }
            currentvid = block.videoId
            if (videos[currentvid].video) {
              videos[currentvid].video.pause()
              setTimeout(() => {
                videos[currentvid].video.play()
              }, 0)
            } else {
              buildVideo(videos[currentvid], true)
            }
            videos[currentvid].videl.style.opacity = 1
          }

          if (alignright.includes(+block.videoId)) {
            if (!gradient.classList.contains('opposite')) gradient.classList.add('opposite')
          } else {
            if (gradient.classList.contains('opposite')) gradient.classList.remove('opposite')
          }
        } else {
          if (!bkg.classList.contains('l-dim')) bkg.classList.add('l-dim')
        }

        /////////////SCRIM/////////////////////////////////////
        const callback = (ev) => {
          scrim.style.transition = ''
          scrim.removeEventListener('transitionend', callback)
        }
        if (block.isSubhead || block.isIntro || block.isMedia) {
          scrim.style.transition = 'opacity .5s'
          scrim.addEventListener('transitionend', callback)
          bkg.style.setProperty('--p', 0)
        } else if (!block.isMobileSpace) {
          scrim.style.transition = 'opacity .5s'
          scrim.addEventListener('transitionend', callback)
          bkg.style.setProperty('--p', 1)
        }

        //////////////////////////////////////////////////////
        if (block.isIntro) {
          if (share.classList.contains('l-hidden')) share.classList.remove('l-hidden')
          if (scrollEl.classList.contains('l-expanded')) scrollEl.classList.remove('l-expanded')
          if (gradient.classList.contains('l-active')) gradient.classList.remove('l-active')
        } else {
          if (!share.classList.contains('l-hidden')) share.classList.add('l-hidden')
          if (!scrollEl.classList.contains('l-expanded')) scrollEl.classList.add('l-expanded')
          if (!gradient.classList.contains('l-active')) gradient.classList.add('l-active')
        }
      }
      /////////////////////////////////////////////////////////////////////
      if (block.video) {
        if (block.vidbottom - wHeight / 2 >= scroll && block.vidtop <= scroll + wHeight / 2) {
          if (!block.isplaying && block.isInlineAutoplay) {
            block.video.currentTime = 0
            block.video.play()
          }
        } else {
          if (block.isplaying) block.video.pause()
        }
      }
      /////////////////////////////////////////////////////////////////////

      if (block.isLetters || block.isSubhead || block.isQuote) {
        offset = scroll - block.top
        offset = constrain(offset, 0, block.height)
        percentScrolled = offset / (block.height - wHeight * 1.25)
        percentScrolled = constrain(percentScrolled, 0, 1)

        if (!block.isLetters && !block.isSubhead) {
          block.el.style.setProperty('--p', percentScrolled)
        } else {
          if (lastPercentScrolled !== percentScrolled) {
            lastPercentScrolled == percentScrolled
            block.el.style.setProperty('--p', percentScrolled)
          }
        }
      }
      /////////////////////////////////////////////////////////////////////

      if (block.isMobileSpace) {
        offset = scroll - block.top
        offset = constrain(offset, 0, wHeight / 4)
        percentScrolled = offset / (wHeight / 4)
        percentScrolled = constrain(percentScrolled, 0, 1)
        bkg.style.setProperty('--p', percentScrolled)
      }
    } else {
      if (block.el.classList.contains('g-active')) {
        block.el.classList.remove('g-active')
        if (block.videl && block.video) {
          block.video.pause()
        }
      }
    }

    //scrollProgress/////////////////////////////////////////////////////////////////////
    scrollProgress.style.height = `${(scroll / containerHeight) * 100}%`
  })
}

const addScrollListener = () => {
  let ticking = false

  window.addEventListener('scroll', scrollListener)

  function scrollListener(evt) {
    if (!ticking) {
      window.requestAnimationFrame((evt) => {
        ticking = false

        onScroll()
      })
    }
    ticking = true
  }
}

const addResizeListener = () => {
  let resizeTimer

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)

    resizeTimer = setTimeout(() => {
      onResize()
    }, 1000)
  })
}

//////////////////////////////////INIT//////////////////////////////////
const init = () => {
  initLetters()
  initBlocks()
  initVideos()
  initSections()

  onResize()
  addResizeListener()
  addScrollListener()

  document.addEventListener('lazyloaded', function (e) {
    onResize()
  })
}

init()
