import { Point } from '../constants/Point'
import { Board } from './Board'
import { Direction } from './Direction'

export type Translation = {
    from: Point
    to: Point
}

export type MoveResult = {
    board: Board
    translations: Translation[]
    created?: Point
}

export class BoardMover {
    private board: Board

    constructor(board: Board) {
        this.board = board.clone()
    }

    public canMove(direction: Direction): boolean {
        switch (direction) {
            case Direction.Left:
                return this.canMoveInDirection(-1, 0)
            case Direction.Right:
                return this.canMoveInDirection(1, 0)
            case Direction.Up:
                return this.canMoveInDirection(0, -1)
            case Direction.Down:
                return this.canMoveInDirection(0, 1)
            default:
                return false
        }
    }

    public move(direction: Direction): MoveResult {
        if (!this.canMove(direction)) {
            return {
                board: this.board,
                translations: [],
            }
        }
        switch (direction) {
            case Direction.Left:
                return this.moveLeft()
            case Direction.Right:
                return this.moveRight()
            case Direction.Up:
                return this.moveUp()
            case Direction.Down:
                return this.moveDown()
        }
    }

    // Helper method to transpose a grid (swap rows and columns)
    private transposeGrid(grid: number[][]): number[][] {
        const transposed: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                transposed[col][row] = grid[row][col]
            }
        }
        return transposed
    }

    // Helper method to reverse each column (vertical mirror)
    private reverseColumns(grid: number[][]): number[][] {
        return [...grid].reverse()
    }

    // Helper method to transform translations for different directions
    private transformTranslations(translations: Translation[], direction: Direction): Translation[] {
        return translations.map((translation) => {
            let from = { ...translation.from }
            let to = { ...translation.to }

            switch (direction) {
                case Direction.Down:
                    // Vertical mirror transformation
                    from.y = Board.SIZE - 1 - from.y
                    to.y = Board.SIZE - 1 - to.y
                    break
                case Direction.Left:
                    // Transpose transformation (swap x and y)
                    ;[from.x, from.y] = [from.y, from.x]
                    ;[to.x, to.y] = [to.y, to.x]
                    break
                case Direction.Right:
                    // Transpose + reverse columns transformation
                    ;[from.x, from.y] = [from.y, from.x]
                    ;[to.x, to.y] = [to.y, to.x]
                    from.y = Board.SIZE - 1 - from.y
                    to.y = Board.SIZE - 1 - to.y
                    break
            }

            return { from, to }
        })
    }

    private canMoveInDirection(colDelta: number, rowDelta: number): boolean {
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                const tile = this.board.grid[row][col]

                if (tile !== 0) {
                    const newRow = row + rowDelta
                    const newCol = col + colDelta

                    if (
                        newRow >= 0 &&
                        newRow < Board.SIZE &&
                        newCol >= 0 &&
                        newCol < Board.SIZE &&
                        (this.board.grid[newRow][newCol] === 0 || this.board.grid[newRow][newCol] === tile)
                    ) {
                        return true
                    }
                }
            }
        }

        return false
    }

    // Helper method to merge a single column moving up
    private mergeColumnUp(tiles: number[]): { mergedTiles: number[]; score: number } {
        const mergedTiles: number[] = []
        const mergedIndices: Set<number> = new Set()
        let score = 0

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] !== 0) {
                const currentTile = tiles[i]
                const prevMergedTile = mergedTiles[mergedTiles.length - 1]
                const prevMergedIndex = mergedTiles.length - 1

                if (prevMergedTile === currentTile && !mergedIndices.has(prevMergedIndex)) {
                    // Merge tiles only if the previous tile hasn't already been merged
                    mergedTiles[mergedTiles.length - 1] *= 2
                    mergedIndices.add(prevMergedIndex)
                    score += mergedTiles[mergedTiles.length - 1]
                } else {
                    // Move tile up
                    mergedTiles.push(currentTile)
                }
            }
        }

        return { mergedTiles, score }
    }

    // Helper method to generate translations for a column moving up
    private generateTranslationsForColumn(originalTiles: number[], col: number): Translation[] {
        const translations: Translation[] = []
        const mergedTiles: number[] = []
        const mergedIndices: Set<number> = new Set()

        for (let i = 0; i < originalTiles.length; i++) {
            if (originalTiles[i] !== 0) {
                const currentTile = originalTiles[i]
                const prevMergedTile = mergedTiles[mergedTiles.length - 1]
                const prevMergedIndex = mergedTiles.length - 1

                if (prevMergedTile === currentTile && !mergedIndices.has(prevMergedIndex)) {
                    // This tile will merge with the previous one
                    mergedIndices.add(prevMergedIndex)
                    translations.push({
                        from: { y: i, x: col },
                        to: { y: prevMergedIndex, x: col },
                    })
                } else {
                    // This tile will move to a new position
                    mergedTiles.push(currentTile)
                    translations.push({
                        from: { y: i, x: col },
                        to: { y: mergedTiles.length - 1, x: col },
                    })
                }
            }
        }

        return translations
    }

    private moveUp(): MoveResult {
        const changes: Translation[] = []
        let totalScore = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let col = 0; col < Board.SIZE; col++) {
            const originalTiles: number[] = this.board.grid.map((row) => row[col])
            const { mergedTiles, score } = this.mergeColumnUp(originalTiles)
            const columnTranslations = this.generateTranslationsForColumn(originalTiles, col)

            totalScore += score
            changes.push(...columnTranslations)

            // Update the board with merged tiles
            for (let i = 0; i < mergedTiles.length; i++) {
                newBoard[i][col] = mergedTiles[i]
            }
        }

        const board = new Board({ grid: newBoard, score: this.board.score + totalScore })
        const created = board.addRandomTile()
        return {
            board: board,
            translations: changes,
            created: created,
        }
    }

    private moveDown(): MoveResult {
        // Create a vertically mirrored board
        const mirroredGrid = this.reverseColumns(this.board.grid)
        const mirroredBoard = new Board({ grid: mirroredGrid, score: this.board.score })

        // Create a temporary BoardMover for the mirrored board
        const tempMover = new BoardMover(mirroredBoard)

        // Perform moveUp on the mirrored board
        const tempResult = tempMover.moveUp()

        // Mirror the result back
        const finalGrid = this.reverseColumns(tempResult.board.grid)
        const finalBoard = new Board({ grid: finalGrid, score: tempResult.board.score })

        // Transform translations back to original coordinate system
        const transformedTranslations = this.transformTranslations(tempResult.translations, Direction.Down)

        return {
            board: finalBoard,
            translations: transformedTranslations,
            created: tempResult.created
                ? {
                      x: tempResult.created.x,
                      y: Board.SIZE - 1 - tempResult.created.y,
                  }
                : undefined,
        }
    }

    private moveLeft(): MoveResult {
        // Create a transposed board (swap rows and columns)
        const transposedGrid = this.transposeGrid(this.board.grid)
        const transposedBoard = new Board({ grid: transposedGrid, score: this.board.score })

        // Create a temporary BoardMover for the transposed board
        const tempMover = new BoardMover(transposedBoard)

        // Perform moveUp on the transposed board
        const tempResult = tempMover.moveUp()

        // Transpose the result back
        const finalGrid = this.transposeGrid(tempResult.board.grid)
        const finalBoard = new Board({ grid: finalGrid, score: tempResult.board.score })

        // Transform translations back to original coordinate system
        const transformedTranslations = this.transformTranslations(tempResult.translations, Direction.Left)

        return {
            board: finalBoard,
            translations: transformedTranslations,
            created: tempResult.created
                ? {
                      x: tempResult.created.y,
                      y: tempResult.created.x,
                  }
                : undefined,
        }
    }

    private moveRight(): MoveResult {
        // For moving right: transpose -> reverse columns -> move up -> reverse columns -> transpose back
        const transposedGrid = this.transposeGrid(this.board.grid)
        const reversedGrid = this.reverseColumns(transposedGrid)
        const tempBoard = new Board({ grid: reversedGrid, score: this.board.score })

        // Create a temporary BoardMover for the transformed board
        const tempMover = new BoardMover(tempBoard)

        // Perform moveUp on the transformed board
        const tempResult = tempMover.moveUp()

        // Reverse the transformations: reverse columns back, then transpose back
        const unReversedGrid = this.reverseColumns(tempResult.board.grid)
        const finalGrid = this.transposeGrid(unReversedGrid)
        const finalBoard = new Board({ grid: finalGrid, score: tempResult.board.score })

        // Transform translations back to original coordinate system
        const transformedTranslations = this.transformTranslations(tempResult.translations, Direction.Right)

        // Transform the created tile position back
        let transformedCreated = undefined
        if (tempResult.created) {
            // Apply reverse transformations to the created position
            const unReversedY = Board.SIZE - 1 - tempResult.created.y
            const unReversedX = tempResult.created.x
            transformedCreated = { x: unReversedY, y: unReversedX }
        }

        return {
            board: finalBoard,
            translations: transformedTranslations,
            created: transformedCreated,
        }
    }
}
