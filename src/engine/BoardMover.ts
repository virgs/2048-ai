import { Point } from '../constants/Point'
import { Board, Grid } from './Board'
import { Direction } from './Direction'

type Change = {
    oldPosition: Point
    newPosition: Point
}

type MoveResult = {
    board: Board
    changes: Change[]
}

export class BoardMover {
    private grid: Grid

    constructor(board: Board) {
        this.grid = board.grid
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

    private canMoveInDirection(colDelta: number, rowDelta: number): boolean {
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                const tile = this.grid[row][col]

                if (tile !== 0) {
                    const newRow = row + rowDelta
                    const newCol = col + colDelta

                    if (
                        newRow >= 0 &&
                        newRow < Board.SIZE &&
                        newCol >= 0 &&
                        newCol < Board.SIZE &&
                        (this.grid[newRow][newCol] === 0 || this.grid[newRow][newCol] === tile)
                    ) {
                        return true
                    }
                }
            }
        }

        return false
    }

    private moveUp(): MoveResult {
        const changes: Change[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let col = 0; col < Board.SIZE; col++) {
            const tiles: number[] = this.grid.map((row) => row[col])
            const mergedTiles: number[] = []

            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i] !== 0) {
                    const currentTile = tiles[i]
                    const prevMergedTile = mergedTiles[mergedTiles.length - 1]

                    if (prevMergedTile === currentTile) {
                        // Merge tiles
                        mergedTiles[mergedTiles.length - 1] *= 2
                        tiles[i] = 0
                        score += mergedTiles[mergedTiles.length - 1]
                    } else {
                        // Move tile up
                        tiles[i] = 0
                        mergedTiles.push(currentTile)
                    }
                    if (i !== mergedTiles.length - 1) {
                        changes.push({
                            oldPosition: { y: i, x: col },
                            newPosition: { y: mergedTiles.length - 1, x: col },
                        })
                    }
                }
            }

            // Update the board with merged tiles
            for (let i = 0; i < mergedTiles.length; i++) {
                newBoard[i][col] = mergedTiles[i]
            }

            // Fill remaining rows with zeros
            for (let i = mergedTiles.length; i < Board.SIZE; i++) {
                newBoard[i][col] = 0
            }
        }

        return {
            board: new Board({ grid: newBoard, score: score }),
            changes,
        }
    }

    private moveDown(): MoveResult {
        const changes: Change[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let col = 0; col < Board.SIZE; col++) {
            const tiles: number[] = this.grid.map((row) => row[col])
            const mergedTiles: number[] = []

            for (let i = tiles.length - 1; i >= 0; i--) {
                if (tiles[i] !== 0) {
                    const currentTile = tiles[i]
                    const prevMergedTile = mergedTiles[mergedTiles.length - 1]

                    if (prevMergedTile === currentTile) {
                        // Merge tiles
                        mergedTiles[mergedTiles.length - 1] *= 2
                        tiles[i] = 0
                        score += mergedTiles[mergedTiles.length - 1]
                    } else {
                        // Move tile down
                        tiles[i] = 0
                        mergedTiles.push(currentTile)
                    }
                    if (i !== Board.SIZE - 1 - (mergedTiles.length - 1)) {
                        changes.push({
                            oldPosition: { y: i, x: col },
                            newPosition: { y: Board.SIZE - 1 - (mergedTiles.length - 1), x: col },
                        })
                    }

                }
            }

            // Update the board with merged tiles
            for (let i = Board.SIZE - 1; i >= Board.SIZE - mergedTiles.length; i--) {
                newBoard[i][col] = mergedTiles[Board.SIZE - 1 - i]
            }

            // Fill remaining rows with zeros
            for (let i = Board.SIZE - 1 - mergedTiles.length; i >= 0; i--) {
                newBoard[i][col] = 0
            }
        }

        return {
            board: new Board({ grid: newBoard, score: score }),
            changes: changes,
        }
    }

    private moveLeft(): MoveResult {
        const changes: Change[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let row = 0; row < Board.SIZE; row++) {
            const tiles: number[] = this.grid[row]
            const mergedTiles: number[] = []

            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i] !== 0) {
                    const currentTile = tiles[i]
                    const prevMergedTile = mergedTiles[mergedTiles.length - 1]

                    if (prevMergedTile === currentTile) {
                        // Merge tiles
                        mergedTiles[mergedTiles.length - 1] *= 2
                        tiles[i] = 0
                        score += mergedTiles[mergedTiles.length - 1]
                    } else {
                        // Move tile left
                        tiles[i] = 0
                        mergedTiles.push(currentTile)
                    }
                    if (i !== mergedTiles.length - 1) {
                        changes.push({
                            oldPosition: { y: row, x: i },
                            newPosition: { y: row, x: mergedTiles.length - 1 },
                        })
                    }
                }
            }

            // Update the board with merged tiles
            for (let i = 0; i < mergedTiles.length; i++) {
                newBoard[row][i] = mergedTiles[i]
            }

            // Fill remaining columns with zeros
            for (let i = mergedTiles.length; i < Board.SIZE; i++) {
                newBoard[row][i] = 0
            }
        }

        return {
            board: new Board({ grid: newBoard, score: score }),
            changes,
        }
    }

    private moveRight(): MoveResult {
        const changes: Change[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let row = 0; row < Board.SIZE; row++) {
            const tiles: number[] = this.grid[row]
            const mergedTiles: number[] = []

            for (let i = tiles.length - 1; i >= 0; i--) {
                if (tiles[i] !== 0) {
                    const currentTile = tiles[i]
                    const prevMergedTile = mergedTiles[mergedTiles.length - 1]

                    if (prevMergedTile === currentTile) {
                        // Merge tiles
                        mergedTiles[mergedTiles.length - 1] *= 2
                        tiles[i] = 0
                        score += mergedTiles[mergedTiles.length - 1]
                    } else {
                        // Move tile right
                        tiles[i] = 0
                        mergedTiles.push(currentTile)
                    }
                    if (i !== Board.SIZE - 1 - (mergedTiles.length - 1)) {
                        changes.push({
                            oldPosition: { y: row, x: i },
                            newPosition: { y: row, x: Board.SIZE - 1 - (mergedTiles.length - 1) },
                        })
                    }
                }
            }

            // Update the board with merged tiles
            for (let i = Board.SIZE - 1; i >= Board.SIZE - mergedTiles.length; i--) {
                newBoard[row][i] = mergedTiles[Board.SIZE - 1 - i]
            }

            // Fill remaining columns with zeros
            for (let i = Board.SIZE - 1 - mergedTiles.length; i >= 0; i--) {
                newBoard[row][i] = 0
            }
        }

        return {
            board: new Board({ grid: newBoard, score: score }),
            changes,
        }
    }
}
