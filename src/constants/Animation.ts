const readFromCss = () =>
    Number(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--animation-duration')
            .replace(/[a-zA-Z]+/g, '')
    )

const timeInterval = setInterval(() => {
    if (animationDuration === 0) {
        animationDuration = readFromCss()
    } else if (animationDuration < 10) {
        // for some reason it reads a thousandth of the original value on a mobile device
        animationDuration *= 1000
    } else {
        clearInterval(timeInterval)
    }
}, 50)

export let animationDuration = readFromCss()
