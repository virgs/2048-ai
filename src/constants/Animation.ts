const readFromCss = () =>
    Number(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--animation-duration')
            .replace(/[a-zA-Z]+/g, '')
    )

const timeInterval = setInterval(() => {
    if (animationDuration === 0) {
        animationDuration = readFromCss()
    } else if (animationDuration < 1) {
        animationDuration *= 100
    } else {
        clearInterval(timeInterval)
    }
}, 50)

export let animationDuration = readFromCss()
