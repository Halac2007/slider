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
const blockEls = [...document.querySelectorAll('.block')]
const bkg = document.querySelector('.page-bkg')
const scrim = bkg.querySelector('.scrim')
const gradient = bkg.querySelector('.gradient')
const share = document.querySelector('.share')
const scrollEl = document.querySelector('.scroll')
const scrollProgress = scrollEl.querySelector('.scroll-progress')
const blockContainer = document.querySelector('.block-container')
let wWidth, wHeight
let currentvid = 0
let previousvid
let containerHeight
let lastPercentScrolled

const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c

const lerp = (a, b, n) => (1 - n) * a + n * b

const calcWinsize = () => {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight),
  }
}

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const getHeight = (el) => {
  return el.getBoundingClientRect().heght
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
    if (x != +arr[i].imageId) continue
    if (first == -1) first = i
    last = i
  }
  if (first != -1) {
    return [first, last]
  }
}

//////////////////////////////////sections///////////////////////////////////
