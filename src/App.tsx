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

const monteCarloRuns = 1000

function App() {
  const [board, setBoard] = useState<Board>(new Board())
  const [moves, setMoves] = useState<Direction[]>([])
  const [translations, setTranslations] = useState<Translation[]>([])

  const makeMove = (board: Board, direction?: Direction): Board => {
    if (direction !== undefined) {
      console.log(Direction[direction])
      const afterMove = new BoardMover(board).move(direction)
      setTranslations(afterMove.translations)
      setMoves(moves => moves.concat(direction))
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

  const buttonClick = async (numberOfRuns: number) => {
    setTimeout(function monteCarloMove() {
      console.log('run: ' + numberOfRuns)
      setBoard((board) => {
        const monteCarlo = new MonteCarlo(monteCarloRuns)
        const direction = monteCarlo.findBestMove(board.clone())
        return makeMove(board, direction)
      })
      if (--numberOfRuns > 0) {
        setTimeout(monteCarloMove, animationDuration);
      }
    }, 0)
  }

  return (
    <div
      id="app"
      className="container p-0"
      style={{ minWidth: '100vw' }}
      autoFocus
      onKeyDown={event => {
        if (keyCodeToDirection(event.code) !== undefined) {
          return event.preventDefault()
        }
      }}
      onKeyUp={event => {
        // disables page scrolling with keyboard arrows
        event.preventDefault()
        return handleKeyPress(event.code)
      }}
      tabIndex={0}
    >
      <div className="row g-0 justify-content-between">
        <div className="col-12 col-sm-6 col-lg-12">
          <Heading newGameButtonHit={() => 0} onAiButtonHit={buttonClick} moves={moves} score={board.score}></Heading>
        </div>
        <div className="col-12 col-sm-auto col-lg-12 mt-5 mt-md-0">
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
