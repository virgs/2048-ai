const readFromCss = () =>
    Number(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--animation-duration')
            .replace(/[a-zA-Z]+/g, '')
    )

const timeInterval = setInterval(() => {
    if (animationDuration === 0) {
        animationDuration = 200 //readFromCss()
    } else {
        clearInterval(timeInterval)
    }
}, 100)

export let animationDuration = readFromCss()
