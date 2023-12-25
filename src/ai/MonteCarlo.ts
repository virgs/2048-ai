import { Board } from '../engine/Board'
import { BoardMover } from '../engine/BoardMover'
import { Direction, Directions } from '../engine/Direction'

// type Node = {
//     board: Board;
//     visits: number;
//     score: number;
//     children: Node[];
//     parent: Node | null;
//     move: Direction | null;
// };

export class MonteCarlo {
    private readonly runs: number

    constructor(runs: number = 1000) {
        this.runs = runs
    }

    public findBestMove(board: Board): Direction | null {
        const directionsScoreMap: Map<Direction, number[]> = new Map()
        Directions.filter((direction) => new BoardMover(board).canMove(direction)).forEach((direction) => {
            // console.log(Direction[direction])
            const startingPoint = new BoardMover(board).makeMove(direction)
            for (let i = 0; i < this.runs; i++) {
                const simulationScore = this.randomlyPlayUntilItsOver(startingPoint)
                // console.log(simulationScore)
                if (directionsScoreMap.has(direction)) {
                    directionsScoreMap.get(direction)!.push(simulationScore)
                } else {
                    directionsScoreMap.set(direction, [simulationScore])
                }
            }
        })

        let bestChild = {
            direction: Direction.Down,
            avg: -1,
        }
        directionsScoreMap.forEach((scores, direction) => {
            const avg = scores.reduce((acc, score) => acc + score, 0) / scores.length
            // console.log(Direction[direction], avg)
            if (avg > bestChild.avg || bestChild.avg === -1) {
                bestChild.direction = direction
                bestChild.avg = avg
            }
        })

        return bestChild.direction
    }

    private randomlyPlayUntilItsOver(initial: Board): number {
        let simulationBoard = initial
        while (!simulationBoard.gameIsOver()) {
            const boardMover = new BoardMover(simulationBoard)

            const possibleDirections = Directions.filter((direction) => boardMover.canMove(direction))
            const randomMove = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
            simulationBoard = boardMover.makeMove(randomMove)
        }
        return simulationBoard.score
    }
}
