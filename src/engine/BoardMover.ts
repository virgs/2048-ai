import { Board, Grid } from "./Board";
import { Direction } from "./Direction";

export class BoardMover {
    private readonly board: Board;

    constructor(board: Board) {
        this.board = board
    }

    public makeMove(direction: Direction): Board {
        let score = this.board.score

        const moveRowToLeft = (row: number[]): number[] => {
            const nonZeroTiles = row.filter(tile => tile !== 0);
            const mergedRow: number[] = [];

            for (let i = 0; i < nonZeroTiles.length; i++) {
                if (i < nonZeroTiles.length - 1 && nonZeroTiles[i] === nonZeroTiles[i + 1]) {
                    const mergedValue = nonZeroTiles[i] * 2;
                    mergedRow.push(mergedValue);
                    score += mergedValue;
                    ++i;
                } else {
                    mergedRow.push(nonZeroTiles[i]);
                }
            }

            // Pad the merged row with zeros to match the length of the original row
            return [...mergedRow, ...Array(row.length - mergedRow.length).fill(0)];
        };

        const moveBoard = (board: Grid): Grid => {
            switch (direction) {
                case Direction.Up:
                    return BoardMover.transpose(BoardMover.transpose(board).map((row) => moveRowToLeft(row)))
                case Direction.Down:
                    return BoardMover.transpose(BoardMover.flipHorizontal(BoardMover.transpose(board).map(row => moveRowToLeft(row))))
                case Direction.Left:
                    return board.map((row) => moveRowToLeft(row))
                case Direction.Right:
                    return BoardMover.flipHorizontal(board.map(row => moveRowToLeft(row)))
            }
        };

        const newGrid = moveBoard(this.board.grid);

        return new Board({ grid: newGrid, score: score })
    }

    public canMove(direction: Direction): boolean {
        switch (direction) {
            case Direction.Left:
                return this.canMoveInDirection(-1, 0);
            case Direction.Right:
                return this.canMoveInDirection(1, 0);
            case Direction.Up:
                return this.canMoveInDirection(0, -1);
            case Direction.Down:
                return this.canMoveInDirection(0, 1);
            default:
                return false;
        }
    }

    private canMoveInDirection(colDelta: number, rowDelta: number): boolean {
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                const tile = this.board.grid[row][col];

                if (tile !== 0) {
                    const newRow = row + rowDelta;
                    const newCol = col + colDelta;

                    if (
                        newRow >= 0 && newRow < Board.SIZE && newCol >= 0 && newCol < Board.SIZE &&
                        (this.board.grid[newRow][newCol] === 0 || this.board.grid[newRow][newCol] === tile)
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private static flipHorizontal(grid: Grid): Grid {
        return grid
            .map(row => row.slice().reverse());
    }


    private static transpose(grid: Grid): Grid {
        return grid[0]
            .map((_, i) => grid
                .map(row => row[i]));
    }

}
