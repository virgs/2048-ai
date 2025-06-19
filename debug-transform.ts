import { BoardMover } from './src/engine/BoardMover'
import { Board } from './src/engine/Board'

// Simple test to understand what's happening with transformations
const grid = [
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]

console.log('Original grid:')
console.log(grid)

const mover = new BoardMover(new Board({ grid, score: 0 }))

// Test transpose
const transposed = mover['transposeGrid'](grid)
console.log('\nTransposed:')
console.log(transposed)

// Test reverse rows
const reversed = mover['reverseRows'](transposed)
console.log('\nReversed rows:')
console.log(reversed)

// Test reverse back
const reversedBack = mover['reverseRows'](reversed)
console.log('\nReversed back:')
console.log(reversedBack)

// Test transpose back
const transposedBack = mover['transposeGrid'](reversedBack)
console.log('\nTransposed back:')
console.log(transposedBack)
