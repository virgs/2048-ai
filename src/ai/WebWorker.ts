import { Board, Grid } from "../engine/Board"
import { Direction } from "../engine/Direction"
import { MonteCarlo } from "./MonteCarlo"

export type SolverRequest = {
    runs: number
    grid: string
    messageId: number
}

export type SolverResponse = {
    direction?: Direction
    messageId: number
}

postMessage({ ready: true })

self.onmessage = (event: MessageEvent<SolverRequest>) => {
    const request = event.data
    try {
        const monteCarlo = new MonteCarlo(request.runs)
        const board = new Board({ grid: JSON.parse(request.grid), score: -1 })
        const updateResponse: SolverResponse = {
            direction: monteCarlo.findBestMove(board.clone()),
            messageId: request.messageId
        }
        self.postMessage(updateResponse)
    } catch (exception) {
        console.log(`WW ${request} got exception`)
        console.error(exception)
        self.postMessage(exception)
    }
}
