const bannedWordsContainer = document.getElementById('words')
const newWordInput = document.getElementById('new-word')
const newWordForm = document.getElementById('new-word-form')

newWordForm.addEventListener('submit', e => {
  e.preventDefault();
  addWord(newWordInput.value)
  newWordInput.value = null
  return false;
})

chrome.storage.onChanged.addListener(render)
render()




function render () {
  chrome.storage.sync.get({
    bannedWords: []
  }, items => {
    bannedWordsContainer.innerHTML = items.bannedWords.map((word, index) => `
      <li>
        <button type="button" id="delete-${index}">Delete</button>
        <span class="word">${word}</span>
      </li>
    `).join('')

    for (let i = 0; i < items.bannedWords.length; i++) {
      document.getElementById('delete-' + i).addEventListener(
        'click',
        () => deleteWord(i, render)
      )
    }
  })
}

function addWord(word, cb) {
  chrome.storage.sync.get({
    bannedWords: []
  }, items => {
    chrome.storage.sync.set({
      bannedWords: items.bannedWords.concat([word])
    }, cb)
  })
}

function deleteWord (index, cb) {
  chrome.storage.sync.get({
    bannedWords: []
  }, items => {
    chrome.storage.sync.set({
      bannedWords: items.bannedWords.slice(0, index).concat(items.bannedWords.slice(index + 1))
    }, cb)
  })
}
