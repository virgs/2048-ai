import { BoardMover } from './src/engine/BoardMover'
import { Board } from './src/engine/Board'
import { Direction } from './src/engine/Direction'

// Simple test to understand the behavior
const grid = [
    [0, 2, 0, 4],
    [0, 0, 2, 0],
    [4, 0, 0, 8],
    [0, 0, 0, 0],
]

const board = new Board({ grid, score: 0 })
const mover = new BoardMover(board)

console.log('Original board:')
board.print()

const result = mover.move(Direction.Left)

console.log('After move left:')
result.board.print()

console.log('Translations:', result.translations)
