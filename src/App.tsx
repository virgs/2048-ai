import { useEffect, useState } from 'react'
import './App.css'
import { MonteCarlo } from './ai/MonteCarlo'
import { BoardComponent } from './components/BoardComponent'
import { keyCodeToDirection } from './constants/KeyCodes'
import { Board } from './engine/Board'
import { BoardMover, Translation } from './engine/BoardMover'
import { Direction } from './engine/Direction'
import { animationDuration } from './constants/Animation'

const monteCarloRuns = 1000

function App() {
    const [board, setBoard] = useState<Board>(new Board())
    const [timer, setTimer] = useState<number>(0)
    const [translations, setTranslations] = useState<Translation[]>([])

    const makeMove = (board: Board, direction?: Direction): Board => {
        if (direction !== undefined) {
            console.log(Direction[direction])
            const afterMove = new BoardMover(board).move(direction)
            setTranslations(afterMove.translations)
            if (afterMove.board.gameIsOver()) {
                console.log('game over')
            }
            return afterMove.board!
        }
        return board
    }

    const buttonClick = async () => {
        setTimer(setInterval(() => runMonteCarlo(), 10 * animationDuration))
    }

    function handleKeyPress(keyCode: string) {
        let direction = keyCodeToDirection(keyCode)
        if (direction !== undefined) {
            setBoard(makeMove(board, direction))
        }
    }

    const runMonteCarlo = () => {
        console.log('executing')
        setBoard((board) => {
            const mc = new MonteCarlo(monteCarloRuns)
            const direction = mc.findBestMove(board.clone())
            return makeMove(board, direction)
        })
    }

    useEffect(() => {
        return () => {
            clearInterval(timer)
            setTimer(0)
        }
    }, [])

    return (
        <div
            id="app"
            className="container p-0"
            style={{ minWidth: '100vw' }}
            autoFocus
            onKeyUp={(event) => {
                // disables page scrolling with keyboard arrows
                event.preventDefault()
                return handleKeyPress(event.code)
            }}
            tabIndex={0}
        >
            <div className="row g-0 justify-content-between">
                <div className="col-12 col-sm-3 col-lg-12">
                    <button onClick={buttonClick}>New Game</button>
                    <button onClick={buttonClick}>Hint</button>
                    <button onClick={buttonClick}>OneStep</button>
                    <button onClick={buttonClick}>Let it play</button>
                </div>
                <div className="col-12 col-sm-auto col-lg-12">
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
