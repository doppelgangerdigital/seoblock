chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Ban this website',
    id: 'ban',
    contexts: ['page'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.sync.get({
    bannedWords: []
  }, items => {
    chrome.storage.sync.set({
      bannedWords: toggleArrItem(items.bannedWords, getDomainByUrl(tab.url))
    })
  })
})

chrome.tabs.onActivated.addListener(updateCurrentDomainStatus)
chrome.storage.onChanged.addListener(updateCurrentDomainStatus)




function updateCurrentDomainStatus () {
  chrome.tabs.query({
    active: true
  }, tabs => {
    const domain = getDomainByUrl(tabs[0].url)

    chrome.storage.sync.get({
      bannedWords: []
    }, items => {
      chrome.contextMenus.update('ban', {
        title: items.bannedWords.indexOf(domain) === -1 ?
          'Ban this website' :
          'Unban this website'
      })
    })

  })
}

function toggleArrItem(arr, item) {
  return arr.indexOf(item) !== -1 ?
    getArrWithout(arr, item) :
    getArrWith(arr, item)
}

function getArrWithout (arr, value) {
  const index = arr.indexOf(value)
  return index !== -1 ?
    arr.slice(0, index).concat(arr.slice(index + 1)) :
    arr
}

function getArrWith (arr, value) {
  return arr.concat([value])
}

function getDomainByUrl (url) {
  return url
    .split('//')
    .slice(1).join('')
    .split('/')
    .slice(0, 1).join('')
}
