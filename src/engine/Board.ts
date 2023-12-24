
export type Grid = number[][];

type BoardConfiguration = {
    grid: Grid,
    score: number
}

export class Board {
    public static readonly SIZE = 4;
    private static readonly NEW_CELL_VALUE_TWO_PROBABILITY = 0.9;
    private readonly _score: number;
    private readonly _grid: Grid;

    constructor(clone?: BoardConfiguration) {
        if (clone) {
            this._grid = clone.grid
                .map(row => row.slice())
            this._score = clone.score
            this.addRandomTile();
        } else {
            this._grid = this.initializeGrid();
            this._score = 0
            this.addRandomTile();
            this.addRandomTile();
        }
    }

    public print(): void {
        console.log(`--- SCORE: ${this.score} ---`);
        for (let i = 0; i < Board.SIZE; i++) {
            console.log(i + ':\t' + this.grid[i].join('\t'));
        }
        console.log(`\n\n`);
    }

    public get score(): number {
        return this._score;
    }

    public get grid(): Grid {
        return this._grid;
    }

    public gameIsOver(): boolean {
        // Check if there are any empty cells
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === 0) {
                    return false; // There is an empty cell, the game is not over
                }
            }
        }

        // Check if there are any adjacent tiles with the same value
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const currentTile = this.grid[i][j];

                // Check right neighbor
                if (j < this.grid[i].length - 1 && currentTile === this.grid[i][j + 1]) {
                    return false;
                }

                // Check bottom neighbor
                if (i < this.grid.length - 1 && currentTile === this.grid[i + 1][j]) {
                    return false;
                }
            }
        }

        // No more valid moves, the game is over
        return true;
    }

    private initializeGrid(): Grid {
        const board: Grid = [];
        let value = 0;
        for (let i = 0; i < Board.SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < Board.SIZE; j++) {
                ++value
                board[i][j] = 0;
                board[i][j] = 2 ** value;
            }
        }
        return board;
    }

    private addRandomTile(): boolean {
        const emptyCells: [number, number][] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push([i, j]);
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const [row, col] = emptyCells[randomIndex];
            this.grid[row][col] = Math.random() < Board.NEW_CELL_VALUE_TWO_PROBABILITY ? 2 : 4;
            return true
        }
        return false
    }


}
