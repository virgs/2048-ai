import { Board } from '../engine/Board'
import { Direction } from '../engine/Direction'
import { SolverRequest, SolverResponse } from './WebWorker'
import Worker from './WebWorker?worker'

type UndefinedDirection = Direction | undefined

type PromiseResult = (value: UndefinedDirection | PromiseLike<UndefinedDirection>) => void

export class NextMoveAiWorker {
    private readonly runs: number
    private readonly worker: Worker
    private readyPromiseResolve: Promise<void>
    private readonly promisesResolves: PromiseResult[]

    public constructor(runs: number = 1000) {
        this.runs = runs
        this.worker = new Worker()
        this.promisesResolves = []
        this.readyPromiseResolve = new Promise<void>((resolve) => {
            this.worker.onmessage = () => {
                this.createWorkerHooks()
                resolve()
            }
        })
    }

    public async waitUntilItsReady(): Promise<void> {
        return this.readyPromiseResolve
    }

    public terminate(): void {
        this.worker.terminate()
    }

    public async run(board: Board): Promise<UndefinedDirection> {
        return new Promise((resolve) => {
            const request: SolverRequest = {
                grid: JSON.stringify(board.grid),
                runs: this.runs,
                messageId: this.promisesResolves.length,
            }
            this.promisesResolves.push(resolve)
            this.worker.postMessage(request)
        })
    }

    private createWorkerHooks() {
        this.worker.onerror = async (event) => console.error(event)
        this.worker.onmessage = async (event: MessageEvent<SolverResponse>) => {
            this.promisesResolves[event.data.messageId](event.data.direction)
        }
    }
}
