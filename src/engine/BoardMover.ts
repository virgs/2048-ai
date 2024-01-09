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

    private moveUp(): MoveResult {
        const changes: Translation[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let col = 0; col < Board.SIZE; col++) {
            const tiles: number[] = this.board.grid.map((row) => row[col])
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
                    changes.push({
                        from: { y: i, x: col },
                        to: { y: mergedTiles.length - 1, x: col },
                    })
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
        const board = new Board({ grid: newBoard, score: this.board.score + score })
        const created = board.addRandomTile()
        return {
            board: board,
            translations: changes,
            created: created,
        }
    }

    private moveDown(): MoveResult {
        const changes: Translation[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let col = 0; col < Board.SIZE; col++) {
            const tiles: number[] = this.board.grid.map((row) => row[col])
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
                    changes.push({
                        from: { y: i, x: col },
                        to: { y: Board.SIZE - 1 - (mergedTiles.length - 1), x: col },
                    })
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
        const board = new Board({ grid: newBoard, score: this.board.score + score })
        const created = board.addRandomTile()
        return {
            board: board,
            translations: changes,
            created: created,
        }
    }

    private moveLeft(): MoveResult {
        const changes: Translation[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let row = 0; row < Board.SIZE; row++) {
            const tiles: number[] = this.board.grid[row]
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
                    changes.push({
                        from: { y: row, x: i },
                        to: { y: row, x: mergedTiles.length - 1 },
                    })
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

        const board = new Board({ grid: newBoard, score: this.board.score + score })
        const created = board.addRandomTile()
        return {
            board: board,
            translations: changes,
            created: created,
        }
    }

    private moveRight(): MoveResult {
        const changes: Translation[] = []
        let score = 0
        const newBoard: number[][] = Array.from({ length: Board.SIZE }, () => Array(Board.SIZE).fill(0))

        for (let row = 0; row < Board.SIZE; row++) {
            const tiles: number[] = this.board.grid[row]
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
                    changes.push({
                        from: { y: row, x: i },
                        to: { y: row, x: Board.SIZE - 1 - (mergedTiles.length - 1) },
                    })
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
        const board = new Board({ grid: newBoard, score: this.board.score + score })
        const created = board.addRandomTile()
        return {
            board: board,
            translations: changes,
            created: created,
        }
    }
}
