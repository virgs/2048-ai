import { useState } from 'react'
import './App.css'
import { MonteCarlo } from './ai/MonteCarlo'
import { BoardComponent } from './components/BoardComponent'
import { animationDuration } from './constants/Animation'
import { keyCodeToDirection } from './constants/KeyCodes'
import { Board } from './engine/Board'
import { BoardMover, Translation } from './engine/BoardMover'
import { Direction } from './engine/Direction'
import Heading from './Heading'
import { AiAction } from './constants/AiAction'

const monteCarloRuns = 1000

function App() {
    const [aiIsPlaying, setAiIsPlaying] = useState<boolean>(false)
    const [lastAiAction, setLastAiAction] = useState<AiAction>(AiAction.STOP_PLAYING)
    // const [timer, setTimer] = useState<number>(0)
    const [board, setBoard] = useState<Board>(new Board())
    const [moves, setMoves] = useState<Direction[]>([])
    const [translations, setTranslations] = useState<Translation[]>([])

    const makeMove = (board: Board, direction?: Direction): Board => {
        if (direction !== undefined) {
            console.log(Direction[direction])
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

    const onAiAction = async (buttonClickAction: AiAction) => {
        setLastAiAction(() => buttonClickAction)
        // console.log(AiAction[aiAction])
        console.log(AiAction[buttonClickAction])

        if (buttonClickAction === AiAction.STOP_PLAYING) {
            setAiIsPlaying(() => false)
            // setTimer(() => 0)
            // clearTimeout(timer)
            return
        }

        setTimeout(
            function monteCarloMove(aiVirgs: AiAction) {
                setBoard((board) => {
                    setAiIsPlaying(() => true)
                    const monteCarlo = new MonteCarlo(monteCarloRuns)
                    const direction = monteCarlo.findBestMove(board.clone())
                    return makeMove(board, direction)
                })
                console.log(AiAction[lastAiAction], AiAction[aiVirgs], AiAction[buttonClickAction])
                if (buttonClickAction === AiAction.KEEP_PLAYING) {
                    console.log('iterate again')
                    return setTimeout(monteCarloMove, animationDuration)
                    // setTimer(() => setTimeout(() => monteCarloMove(buttonClickAction), animationDuration))
                } else {
                    setAiIsPlaying(() => false)
                    // clearTimeout(timer)
                    // setTimer(() => 0)
                }
            },
            0,
            buttonClickAction
        )
    }

    return (
        <div
            id="app"
            className="container p-0"
            style={{ minWidth: '100dvw' }}
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
            <div className="row p-md-3 p-lg-1 justify-content-between">
                <div className="col-12 col-md-6 col-lg-12 mb-2 mx-auto">
                    <Heading
                        aiIsPlaying={aiIsPlaying}
                        newGameButtonHit={() => 0}
                        onAiButtonHit={onAiAction}
                        moves={moves}
                        score={board.score}
                    ></Heading>
                </div>
                <div className="col-12 col-md-6 col-lg-12 mx-auto">
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
