const readFromCss = () =>
    Number(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--animation-duration')
            .replace(/[a-zA-Z]+/g, '')
    )

const timeInterval = setInterval(() => {
    if (animationDuration === 0) {
        animationDuration = readFromCss()
    } else {
        clearInterval(timeInterval)
    }
}, 50)

export let animationDuration = readFromCss()