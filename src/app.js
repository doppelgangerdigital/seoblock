const wrapperSelector = `.ListingLayout-outerContainer > *:nth-child(2) > *:nth-child(3) > *:first-child`
const parentSelector = `.Post`
const tagSelector = `[data-click-id="subreddit"]`

const debounce = (fn, wait = 100) => {
    // this is double debounce
    // it fires like this
    // calls:          1111111111111111
    // actually fired: 1000000000000001

    // so only first and last call

    let shouldCallMore
    let timer
    let maxWaitTimer
    let isWaiting
    let fnArgs = []

    const stopWaiting = () => {
        if (shouldCallMore) fn(...fnArgs)
        isWaiting = shouldCallMore = false
    }

    const call = () => {
        shouldCallMore = false
        fn(...fnArgs)
    }

    return (...args) => {
        fnArgs = args

        shouldCallMore = true

        clearTimeout(timer)
        timer = setTimeout(stopWaiting, wait)

        if (isWaiting) return
        isWaiting = true

        clearTimeout(maxWaitTimer)
        maxWaitTimer = setTimeout(call, 20)
    }
}

let observer

const start = () => {
    if (observer) return

    const handleChanges = () => debounce(chrome.storage.sync.get(null, store => {
        const bannedTags = store.bannedWords || []
        if (bannedTags.length === 0) return
        console.log(bannedTags)
        document.querySelectorAll(parentSelector).forEach(parent => {
            const tag = parent.querySelector(tagSelector)?.getAttribute('href')
                .replace('r/', '')
                .replaceAll('/', '')

            console.log(parent, parent.querySelector(tagSelector), tag)
            if (!bannedTags.includes(tag) && !bannedTags.includes('r/' + tag)) return
            parent.remove()
        })
    }))

    handleChanges()
    observer = new MutationObserver(handleChanges)
    observer.observe(document.querySelector(wrapperSelector), {
        childList: true,
    })
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    start()
} else {
    document.addEventListener('DOMContentLoaded', start)
}
