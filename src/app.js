const placeholder = 'This result was hidden due to your SeoBlock preferences.'

if (document.readyState === 'interactive') {
  start()
} else {
  document.addEventListener('DOMContentLoaded', start)
}

function start () {
  getFilters(filters => {
    loadCurrentDomainFilters(filters, currentDomainFilters => {
      chrome.storage.sync.get(null, items => {
        toArray(document.querySelectorAll(currentDomainFilters)).forEach(element => {
          inspectElement(element, items.bannedWords)
        })
      })
    })
  })
}

function inspectElement (element, bannedWords) {
  const content = extractContent(element).toLowerCase()

  bannedWords.forEach(word => {
    if (content.indexOf(word.toLowerCase()) !== -1) {
      element.innerHTML = placeholder
    }
  })
}

function extractContent (element) {
  return element.textContent +
    element.getAttribute('href') || ''
}

function toArray(DOMList) {
  return Array.prototype.slice.call(DOMList)
}

function loadCurrentDomainFilters (filters, cb) {
  const domains = Object.keys(filters)
  domains.forEach(domain => {
    if (window.location.hostname.indexOf(domain) !== -1) {
      cb(filters[domain])
      return
    }
  })
}

function getFilters (cb) {
  fetch("https://cdn.rawgit.com/uyouthe/seoblock/master/src/filters.json")
    .then(response => response.json())
    .then(cb)
}
