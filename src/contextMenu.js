chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Ban this website',
    id: 'ban',
    contexts: ['page'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ban') {
    chrome.storage.sync.get({
      "bannedWords": []
    }, items => {
      const url = tab.url
        .split('//')
        .slice(1).join('')
        .split('/')
        .slice(0, 1).join('')
        .split('.')
        .slice(-2).join('.')

      if (items.bannedWords.indexOf(url) === -1) {
        chrome.storage.sync.set({
          "bannedWords": items.bannedWords.concat([url])
        })
      }
    })

    chrome.tabs.remove(tab.id)
  }
})
