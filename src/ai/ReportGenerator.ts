import { Board } from '../engine/Board'
import { BoardMover } from '../engine/BoardMover'
import { Direction } from '../engine/Direction'
import { NextMoveAiWorker } from './NextMoveAiWorker'

const formatDuration = (ms: number) => {
    if (ms < 0) ms = -ms
    const time = {
        day: Math.floor(ms / 86400000),
        hour: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
        second: Math.floor(ms / 1000) % 60,
        millisecond: Math.floor(ms) % 1000,
    }
    return Object.entries(time)
        .filter((val) => val[1] !== 0)
        .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
        .join(', ')
}

type SingleGameReport = {
    score: number
    greatesTile: number
    moves: number
}

type Stats = {
    max: number
    mean: number
    p1: number
    p5: number
    p25: number
    p50: number
    p75: number
    p95: number
    p99: number
}

type AiReport = {
    totalTime: string
    monteCarloRunsPerMove: number
    numberOfGames: number
    score: Stats
    winRatio: number
    greatestTileValue: Stats
    moves: Stats
    games: SingleGameReport[]
}

export class ReportGenerator {
    private readonly runs: number
    private readonly maxSimultaneousRuns: number
    private readonly monteCarloExplorationRuns: number

    public constructor(runs: number, maxSimultaneousRuns: number, monteCarloExplorationRuns: number) {
        this.runs = runs
        this.maxSimultaneousRuns = maxSimultaneousRuns
        this.monteCarloExplorationRuns = monteCarloExplorationRuns
    }

    public async run() {
        const startTime = Date.now()
        const singleGameReports: SingleGameReport[] = []
        let remainingRuns = this.runs
        console.log(`Start report ${this.monteCarloExplorationRuns}`, new Date())
        while (remainingRuns > 0) {
            const singleReports = await Promise.all(
                Array.from(Array(this.maxSimultaneousRuns)).map(async () => {
                    const singleItemReport = await this.playSingleGame()
                    --remainingRuns
                    console.log(
                        `Report status ${this.monteCarloExplorationRuns}: ${
                            Math.trunc((1000 * (this.runs - remainingRuns)) / this.runs) / 10
                        }% - ${formatDuration(Date.now() - startTime)}`
                    )
                    return singleItemReport
                })
            )
            singleGameReports.push(...singleReports)
            const finalReport: AiReport = this.calculateFinalReport(
                singleGameReports,
                formatDuration(Date.now() - startTime)
            )
            this.save(finalReport)
        }
    }

    private async playSingleGame(): Promise<SingleGameReport> {
        const solver = new NextMoveAiWorker(this.monteCarloExplorationRuns)
        let moves = 0
        let board = new Board()

        while (!board.gameIsOver()) {
            const direction = (await solver.run(board)!) as Direction
            const boardMover = new BoardMover(board)
            board = boardMover.move(direction).board
            ++moves
        }

        return {
            moves,
            score: board.score,
            greatesTile: board.getGreatesPieceValue(),
        }
    }

    private calculateFinalReport(singleGameReports: SingleGameReport[], totalTime: string): AiReport {
        const calculateStat = (values: number[]): Stats => {
            const descSorted: number[] = values.sort((a, b) => b - a)
            const sum = descSorted.reduce((acc, item) => acc + item, 0)
            const max = descSorted.reduce((acc, item) => (item > acc ? item : acc), -1)
            const mean = sum / descSorted.length
            return {
                max: max,
                mean: mean,
                p1: descSorted[Math.floor(1 * (descSorted.length / 100))],
                p5: descSorted[Math.floor(5 * (descSorted.length / 100))],
                p25: descSorted[Math.floor(25 * (descSorted.length / 100))],
                p50: descSorted[Math.floor(50 * (descSorted.length / 100))],
                p75: descSorted[Math.floor(75 * (descSorted.length / 100))],
                p95: descSorted[Math.floor(95 * (descSorted.length / 100))],
                p99: descSorted[Math.floor(99 * (descSorted.length / 100))],
            }
        }

        return {
            totalTime: totalTime,
            winRatio:
                singleGameReports.reduce((acc, item) => (item.greatesTile >= 2048 ? acc + 1 : acc), 0) /
                singleGameReports.length,
            numberOfGames: singleGameReports.length,
            score: calculateStat(singleGameReports.map((item) => item.score)),
            greatestTileValue: calculateStat(singleGameReports.map((item) => item.greatesTile)),
            moves: calculateStat(singleGameReports.map((item) => item.moves)),
            monteCarloRunsPerMove: this.monteCarloExplorationRuns,
            games: singleGameReports,
        }
    }

    private save(finalReport: AiReport) {
        const a = document.createElement('a')
        const file = new Blob([JSON.stringify(finalReport)], { type: 'text/json' })
        a.href = URL.createObjectURL(file)
        //@ts-expect-error
        finalReport.url = window.location.href
        a.download = `2048-ai-runs-${this.monteCarloExplorationRuns}.json`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
    }
}
