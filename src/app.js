if (document.readyState === 'interactive') {
  start()
} else {
  document.addEventListener('DOMContentLoaded', start)
}

function start () {
  getFilters(filters => {
    loadCurrentDomainFilters(filters, currentDomainFilters => {
      toArray(document.querySelectorAll(currentDomainFilters)).forEach(inspectElement)
    })
  })
}

function inspectElement (element) {
  element.setAttribute('hidden', '')
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
