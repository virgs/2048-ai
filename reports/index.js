import * as fs from 'fs'

const loadFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename).toString())
}

const calculateFinalReport = (singleGameReports, totalTime) => {
    const calculateStat = (values) => {
        const descSorted = values.sort((a, b) => b - a)
        const sum = descSorted.reduce((acc, item) => acc + item, 0)
        const max = descSorted.reduce((acc, item) => (item > acc ? item : acc), -1)
        const mean = sum / descSorted.length
        return {
            max: max,
            mean: mean,
            stdDev: Math.sqrt(
                descSorted
                    .reduce((acc, item) => acc.concat((item - mean) ** 2), [])
                    .reduce((acc, item) => acc + item, 0) /
                descSorted.length
            ),
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
        winRatio: singleGameReports.games
            .reduce((acc, item) => item.greatesTile >= 2048 ? acc + 1 : acc, 0) / singleGameReports.length,
        numberOfGames: singleGameReports.games.length,
        score: calculateStat(singleGameReports.games
            .map(item => item.score)),
        greatesTileValue: calculateStat(singleGameReports.games
            .map(item => item.greatesTile)),
        moves: calculateStat(singleGameReports.games
            .map(item => item.moves)),
        monteCarloRunsPerMove: 250,
        games: singleGameReports
    }
}

const save = (filename, finalReport) => {
    fs.writeFileSync(filename, JSON.stringify(finalReport))
}

const filename = '2048-ai-runs-50.json'
const singleGameReports = loadFile(`reports/${filename}`)

const finalReport = calculateFinalReport(singleGameReports, "59 minutes, 21 seconds, 619 milliseconds")
save(`reports/new-${filename}`, finalReport)
