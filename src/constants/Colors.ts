export const colorsFromNumber = (input: number): { backgroundColor: string; color: string } => {
    switch (input) {
        case 0:
            return { backgroundColor: '#cdc1b4', color: 'transparent' }
        case 2:
            return { backgroundColor: '#eee4da', color: '#776e65' }
        case 4:
            return { backgroundColor: '#ede0c8', color: '#776e65' }
        case 8:
            return { backgroundColor: '#f2b179', color: '#f9f6f2' }
        case 16:
            return { backgroundColor: '#f59563', color: '#f9f6f2' }
        case 32:
            return { backgroundColor: '#f67c5f', color: '#f9f6f2' }
        case 64:
            return { backgroundColor: '#f65e3b', color: '#f9f6f2' }
        case 128:
            return { backgroundColor: '#edcf72', color: '#f9f6f2' }
        case 256:
            return { backgroundColor: '#edcc61', color: '#f9f6f2' }
        case 512:
            return { backgroundColor: '#edc850', color: '#f9f6f2' }
        case 1024:
            return { backgroundColor: '#edc53f', color: '#f9f6f2' }
        case 2048:
            return { backgroundColor: '#edc22e', color: '#f9f6f2' }
        default:
            return { backgroundColor: '#8f7a66', color: '#f9f6f2' }
    }
}
