import { BoardMover } from '../engine/BoardMover'
import { Board } from '../engine/Board'
import { Direction } from '../engine/Direction'

// Helper function to create a board with a specific grid
function createBoardWithGrid(grid: number[][]): Board {
    return new Board({ grid, score: 0 })
}

describe('BoardMover', () => {
    beforeEach(() => {
        // Mock addRandomTile to prevent random tile addition during tests
        jest.spyOn(Board.prototype, 'addRandomTile').mockImplementation(() => {
            return { x: 0, y: 0 } // Return a consistent position without actually adding a tile
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('move method', () => {
        describe('moving left', () => {
            it('should move tiles to the left when there are empty spaces', () => {
                const grid = [
                    [0, 2, 0, 0],
                    [0, 0, 4, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual([
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.translations.length).toBeGreaterThan(0)
                expect(result.created).toBeDefined()
            })

            it('should merge tiles when moving left', () => {
                const grid = [
                    [2, 2, 0, 0],
                    [4, 4, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual([
                    [4, 0, 0, 0],
                    [8, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
                expect(result.translations.length).toBeGreaterThan(0)
            })

            it('should NOT merge newly created tiles', () => {
                const grid = [
                    [2, 2, 4, 4],
                    [8, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual([
                    [4, 8, 0, 0],
                    [8, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
            })

            it('should not move when no move is possible to the left', () => {
                const grid = [
                    [2, 4, 8, 16],
                    [4, 8, 16, 32],
                    [8, 16, 32, 64],
                    [16, 32, 64, 128],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual(grid)
                expect(result.translations).toHaveLength(0)
                expect(result.created).toBeUndefined()
            })

            it('should handle complex merging scenarios', () => {
                const grid = [
                    [2, 2, 2, 2],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual([
                    [4, 4, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(8) // 4 + 4 = 8
            })
        })

        describe('moving right', () => {
            it('should move tiles to the right when there are empty spaces', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Right)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 2],
                    [0, 0, 0, 4],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.translations.length).toBeGreaterThan(0)
                expect(result.created).toBeDefined()
            })

            it('should merge tiles when moving right', () => {
                const grid = [
                    [0, 0, 2, 2],
                    [0, 0, 4, 4],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Right)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 4],
                    [0, 0, 0, 8],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
            })

            it('should NOT merge newly created tiles', () => {
                const grid = [
                    [2, 2, 4, 4],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Right)

                expect(result.board.grid).toEqual([
                    [0, 0, 4, 8],
                    [0, 0, 0, 2],
                    [0, 0, 0, 4],
                    [0, 0, 0, 4],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
            })

            it('should not move when no move is possible to the right', () => {
                const grid = [
                    [2, 4, 8, 16],
                    [4, 8, 16, 32],
                    [8, 16, 32, 64],
                    [16, 32, 64, 128],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Right)

                expect(result.board.grid).toEqual(grid)
                expect(result.translations).toHaveLength(0)
                expect(result.created).toBeUndefined()
            })

            it('should handle complex merging scenarios', () => {
                const grid = [
                    [2, 2, 2, 2],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Right)

                expect(result.board.grid).toEqual([
                    [0, 0, 4, 4],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(8) // 4 + 4 = 8
            })
        })

        describe('moving up', () => {
            it('should move tiles up when there are empty spaces', () => {
                const grid = [
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Up)

                expect(result.board.grid).toEqual([
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.translations.length).toBeGreaterThan(0)
                expect(result.created).toBeDefined()
            })

            it('should merge tiles when moving up', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [0, 0, 0, 0],
                    [8, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Up)

                expect(result.board.grid).toEqual([
                    [4, 0, 0, 0],
                    [8, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(4) // Only one merge: 2+2=4
            })

            it('should NOT merge newly created tiles', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Up)

                expect(result.board.grid).toEqual([
                    [4, 0, 0, 0],
                    [8, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
            })

            it('should not move when no move is possible upward', () => {
                const grid = [
                    [2, 4, 8, 16],
                    [4, 8, 16, 32],
                    [8, 16, 32, 64],
                    [16, 32, 64, 128],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Up)

                expect(result.board.grid).toEqual(grid)
                expect(result.translations).toHaveLength(0)
                expect(result.created).toBeUndefined()
            })

            it('should handle complex merging scenarios', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Up)

                expect(result.board.grid).toEqual([
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.board.score).toBe(8) // 4 + 4 = 8
            })
        })

        describe('moving down', () => {
            it('should move tiles down when there are empty spaces', () => {
                const grid = [
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Down)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                ])
                expect(result.translations.length).toBeGreaterThan(0)
                expect(result.created).toBeDefined()
            })

            it('should merge tiles when moving down', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Down)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [4, 0, 0, 0],
                    [8, 0, 0, 0],
                ])
                expect(result.board.score).toBe(12) // 4 + 8 = 12
            })

            it('should not move when no move is possible downward', () => {
                const grid = [
                    [2, 4, 8, 16],
                    [4, 8, 16, 32],
                    [8, 16, 32, 64],
                    [16, 32, 64, 128],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Down)

                expect(result.board.grid).toEqual(grid)
                expect(result.translations).toHaveLength(0)
                expect(result.created).toBeUndefined()
            })

            it('should handle complex merging scenarios', () => {
                const grid = [
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                    [2, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Down)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                ])
                expect(result.board.score).toBe(8) // 4 + 4 = 8
            })
        })

        describe('edge cases', () => {
            it('should handle empty board', () => {
                const grid = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual(grid)
                expect(result.translations).toHaveLength(0)
                expect(result.created).toBeUndefined()
            })

            it('should handle board with single tile', () => {
                const grid = [
                    [0, 0, 0, 0],
                    [0, 2, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                const result = mover.move(Direction.Left)

                expect(result.board.grid).toEqual([
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ])
                expect(result.translations.length).toBeGreaterThan(0)
                expect(result.created).toBeDefined()
            })
        })

        describe('canMove method integration', () => {
            it('should return correct result when canMove returns false', () => {
                const grid = [
                    [2, 4, 8, 16],
                    [4, 8, 16, 32],
                    [8, 16, 32, 64],
                    [16, 32, 64, 128],
                ]
                const board = createBoardWithGrid(grid)
                const mover = new BoardMover(board)

                // Test all directions that should not be possible
                expect(mover.canMove(Direction.Left)).toBe(false)
                expect(mover.canMove(Direction.Right)).toBe(false)
                expect(mover.canMove(Direction.Up)).toBe(false)
                expect(mover.canMove(Direction.Down)).toBe(false)

                // Verify move returns unchanged board
                const leftResult = mover.move(Direction.Left)
                expect(leftResult.board.grid).toEqual(grid)
                expect(leftResult.translations).toHaveLength(0)
            })
        })
    })
})
