const readFromCss = () => {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--animation-duration')
        .replace(/[a-zA-Z]+/g, '')
    return Number(value) || 125 // Fallback to default if unable to read
}

let animationDuration = 0

const initializeAnimationDuration = () => {
    // Try to read immediately
    animationDuration = readFromCss()

    // If still 0, set up interval to retry
    if (animationDuration === 0) {
        const timeInterval = setInterval(() => {
            animationDuration = readFromCss()
            if (animationDuration > 0) {
                // Check for mobile device reading issue
                if (animationDuration < 10) {
                    animationDuration *= 1000
                }
                clearInterval(timeInterval)
            }
        }, 50)

        // Clear interval after max attempts to prevent infinite loops
        setTimeout(() => {
            clearInterval(timeInterval)
            if (animationDuration === 0) {
                animationDuration = 125 // Final fallback
            }
        }, 2000)
    }
}

// Initialize on module load
initializeAnimationDuration()

export { animationDuration }
