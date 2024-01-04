export const fontSizeFromNumber = (input: number): string => {
    switch (Math.ceil(Math.log10(input))) {
        case 0:
        case 1:
        case 2:
            return 'min(11dvmin, 4rem)'
        case 3:
            return 'min(9dvmin, 3rem)'
        case 4:
            return 'min(6.5dvmin, 2.5rem)'
        case 5:
            return 'min(5.25dvmin, 2rem)'
        default:
            return 'min(5dvmin, 1.5rem)'
    }
}
