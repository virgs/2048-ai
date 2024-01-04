import { useEffect, useState } from 'react'
import './App.css'
import Heading from './Heading'
// import { MonteCarlo } from './ai/MonteCarlo'
import { BoardComponent } from './components/BoardComponent'
import { AiAction } from './constants/AiAction'
import { keyCodeToDirection } from './constants/KeyCodes'
import { Board } from './engine/Board'
import { BoardMover, Translation } from './engine/BoardMover'
import { Direction, Directions } from './engine/Direction'
import { animationDuration } from './constants/Animation'

// const monteCarloRuns = 1000

function App() {
    const [lastAiAction, setLastAiAction] = useState<AiAction>(AiAction.STOP_PLAYING)
    const [board, setBoard] = useState<Board>(new Board())
    const [moves, setMoves] = useState<Direction[]>([])
    const [translations, setTranslations] = useState<Translation[]>([])

    let timer: number | undefined

    const makeMove = (board: Board, direction?: Direction): Board => {
        if (direction !== undefined) {
            console.log(Direction[direction], AiAction[lastAiAction], timer)
            const afterMove = new BoardMover(board).move(direction)
            setTranslations(afterMove.translations)
            setMoves((moves) => moves.concat(direction))
            if (afterMove.board.gameIsOver()) {
                console.log('game over')
            }
            return afterMove.board!
        }
        return board
    }

    function handleKeyPress(keyCode: string) {
        let direction = keyCodeToDirection(keyCode)
        if (direction !== undefined) {
            setBoard(makeMove(board, direction))
        }
    }

    const monteCarloMove = () => {
        // const monteCarlo = new MonteCarlo(monteCarloRuns)
        // const direction = monteCarlo.findBestMove(board.clone())
        const direction = Math.floor(Math.random() * Directions.length)
        setBoard(makeMove(board, direction))
    }

    useEffect(() => {
        if (lastAiAction === AiAction.STOP_PLAYING || lastAiAction === AiAction.PLAY_ONE_STEP) {
            setLastAiAction(AiAction.STOP_PLAYING)
        } else if (lastAiAction === AiAction.KEEP_PLAYING) {
            timer = setTimeout(monteCarloMove, 10 * animationDuration)
        }
    }, [board])

    const onAiAction = async (aiAction: AiAction) => {
        clearTimeout(timer)

        setLastAiAction(() => aiAction)
        if (aiAction !== AiAction.STOP_PLAYING) {
            monteCarloMove()
        }
    }

    const resetGame = () => {
        clearTimeout(timer)
        console.log('reset')
        setLastAiAction(AiAction.STOP_PLAYING)
        setBoard(new Board())
        setMoves([])
        setTranslations([])
    }

    return (
        <div
            id="app"
            className="container-fluid p-0 text-center"
            autoFocus
            onKeyDown={(event) => {
                if (keyCodeToDirection(event.code) !== undefined) {
                    // disables page scrolling with keyboard arrows
                    return event.preventDefault()
                }
            }}
            onKeyUp={(event) => {
                return handleKeyPress(event.code)
            }}
            tabIndex={0}
        >
            <div className="row py-sm-3 p-lg-1 justify-content-center gx-0">
                <div className="col-12 col-sm-6 col-md-12 mb-2 mx-auto">
                    <Heading
                        aiIsPlaying={lastAiAction === AiAction.KEEP_PLAYING}
                        newGameButtonHit={resetGame}
                        onAiButtonHit={onAiAction}
                        moves={moves}
                        score={board.score}
                    ></Heading>
                </div>
                <div className="col-12 col-sm-6 col-md-12 mx-auto">
                    <BoardComponent
                        board={board}
                        translations={translations}
                        onSlideTiles={(direction) => setBoard(makeMove(board, direction))}
                    ></BoardComponent>
                </div>
            </div>
        </div>
    )
}

export default App
