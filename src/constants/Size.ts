export const fontSizeFromNumber = (input: number): string => {
    switch (Math.ceil(Math.log10(input))) {
        case 0:
        case 1:
        case 2:
            return 'min(15vmin, 4.5rem)'
        case 3:
            return 'min(10vmin, 4rem)'
        case 4:
            return 'min(7.5vmin, 3rem)'
        case 5:
            return 'min(7.25vmin, 2.25rem)'
        default:
            return 'min(7vmin, 2rem)'
    }
}
