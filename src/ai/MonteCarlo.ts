import { Board } from '../engine/Board'
import { BoardMover } from '../engine/BoardMover'
import { Direction, Directions } from '../engine/Direction'

export class MonteCarlo {
    private readonly runs: number

    constructor(runs: number = 1000) {
        this.runs = runs
    }

    public findBestMove(board: Board): Direction | undefined {
        const directionsScoreMap: Map<Direction, number[]> = new Map()
        Directions.filter((direction) => new BoardMover(board).canMove(direction)).forEach((direction) => {
            const startingPoint = new BoardMover(board).move(direction)
            for (let i = 0; i < this.runs; i++) {
                const simulationScore = this.randomlyPlayUntilItsOver(startingPoint.board)
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

            const availableDirections = Directions.filter((direction) => boardMover.canMove(direction))
            if (availableDirections.length === 0) {
                console.log('no move available')
                break
            }
            const randomMove = availableDirections[Math.floor(Math.random() * availableDirections.length)]
            simulationBoard = boardMover.move(randomMove).board
        }
        return simulationBoard.score
    }
}
