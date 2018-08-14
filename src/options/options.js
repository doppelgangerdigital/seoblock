const bannedWordsContainer = document.getElementById('words')
const newWordInput = document.getElementById('new-word')
const newWordForm = document.getElementById('new-word-form')

newWordForm.addEventListener('submit', e => {
  e.preventDefault();
  addWord(newWordInput.value, render)
  newWordInput.value = null
  return false;
})

render()

function render () {
  console.log('Fire!')
  chrome.storage.sync.get(null, items => {
    console.log(items)
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
  chrome.storage.sync.get(null, items => {
    chrome.storage.sync.set({
      bannedWords: items.bannedWords.concat([word])
    }, cb)
  })
}

function deleteWord (index, cb) {
  chrome.storage.sync.get(null, items => {
    chrome.storage.sync.set({
      bannedWords: items.bannedWords.slice(0, index).concat(items.bannedWords.slice(index + 1))
    }, cb)
  })
}
