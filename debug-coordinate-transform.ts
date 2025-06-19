// Debug script to test coordinate transformations

const BOARD_SIZE = 4

// Helper functions (copied from BoardMover)
function transposeGrid(grid: number[][]): number[][] {
    return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]))
}

function reverseColumns(grid: number[][]): number[][] {
    return grid.map((row) => [...row].reverse())
}

// Test coordinate transformation for moveRight
function testMoveRightTransformation() {
    console.log('Testing moveRight coordinate transformation...')

    // Original position: tile at (0, 0) should move to (0, 3) when moving right
    const originalFrom = { x: 0, y: 0 }
    const expectedTo = { x: 3, y: 0 } // Moving right in the same row

    console.log(`Original: from (${originalFrom.x}, ${originalFrom.y}) should go to (${expectedTo.x}, ${expectedTo.y})`)

    // Simulate the transformation sequence that moveRight uses:
    // 1. Transpose: (0,0) -> (0,0)
    let step1From = { x: originalFrom.y, y: originalFrom.x } // (0,0)
    console.log(`After transpose: (${step1From.x}, ${step1From.y})`)

    // 2. Reverse columns: in a 4x4, column 0 becomes column 3
    let step2From = { x: step1From.x, y: BOARD_SIZE - 1 - step1From.y } // (0,3)
    console.log(`After reverse columns: (${step2From.x}, ${step2From.y})`)

    // 3. After moveUp, it should go to (0,0) in the transformed space
    let step3To = { x: step2From.x, y: 0 } // (0,0)
    console.log(`After moveUp result: (${step3To.x}, ${step3To.y})`)

    // 4. Reverse columns back: (0,0) -> (0,3)
    let step4To = { x: step3To.x, y: BOARD_SIZE - 1 - step3To.y } // (0,3)
    console.log(`After un-reverse columns: (${step4To.x}, ${step4To.y})`)

    // 5. Transpose back: (0,3) -> (3,0)
    let finalTo = { x: step4To.y, y: step4To.x } // (3,0)
    console.log(`After un-transpose: (${finalTo.x}, ${finalTo.y})`)

    console.log(`Expected: (${expectedTo.x}, ${expectedTo.y}), Got: (${finalTo.x}, ${finalTo.y})`)

    // What the current transformation does:
    console.log('\nCurrent transformation logic:')
    let currentFrom = { ...originalFrom }
    let currentTo = { ...expectedTo }

    // Current logic: transpose then reverse
    ;[currentFrom.x, currentFrom.y] = [currentFrom.y, currentFrom.x] // (0,0)
    ;[currentTo.x, currentTo.y] = [currentTo.y, currentTo.x] // (0,3)
    currentFrom.y = BOARD_SIZE - 1 - currentFrom.y // (0,3)
    currentTo.y = BOARD_SIZE - 1 - currentTo.y // (0,0)

    console.log(
        `Current transform result: from (${currentFrom.x}, ${currentFrom.y}) to (${currentTo.x}, ${currentTo.y})`
    )
}

testMoveRightTransformation()
