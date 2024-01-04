import { useEffect, useRef, useState } from 'react'
import './App.css'
import HeadingComponent from './components/HeadingComponent'
import { BoardComponent } from './components/BoardComponent'
import { AiAction } from './constants/AiAction'
import { animationDuration } from './constants/Animation'
import { keyCodeToDirection } from './constants/KeyCodes'
import { Board } from './engine/Board'
import { BoardMover, Translation } from './engine/BoardMover'
import { Direction } from './engine/Direction'
import { GameOverModalComponent } from './components/GameOverModalComponent'
import { GameVictoryModalComponent } from './components/GameVictoryModalComponent'
import { Solver } from './ai/Solver'

const monteCarloRuns = 1000
const greatestPieceValueThreshold = 64
const solver = new Solver(monteCarloRuns)

function App() {
  const appRef = useRef(null)
  const [aiAction, setAiAction] = useState<AiAction>(AiAction.STOP_PLAYING)
  const [victory, setVictory] = useState<boolean>(false)
  const [gameOverModalIsBeingShown, setGameOverModalIsBeingShown] = useState<boolean>(false)
  const [gameVictoryModalIsBeingShown, setGameVictoryModalIsBeingShown] = useState<boolean>(false)
  const [board, setBoard] = useState<Board>(new Board())
  const [moves, setMoves] = useState<Direction[]>([])
  const [translations, setTranslations] = useState<Translation[]>([])

  let timer: number | undefined

  useEffect(() => {
    //@ts-ignore
    appRef.current?.focus()
  })

  const makeMove = (board: Board, direction?: Direction): Board => {
    if (direction !== undefined) {
      const boardMover = new BoardMover(board)
      if (boardMover.canMove(direction)) {
        const afterMove = boardMover.move(direction)
        setTranslations(afterMove.translations)
        setMoves((moves) => moves.concat(direction))
        if (afterMove.board.gameIsOver()) {
          setGameOverModalIsBeingShown(true)
          console.log('game over')
        } else if (afterMove.board.getGreatesPieceValue() >= greatestPieceValueThreshold && !victory) {
          console.log('you win')
          setGameVictoryModalIsBeingShown(() => true)
          setVictory(() => true)
        }
        return afterMove.board
      }
    }
    return board
  }

  function handleKeyPress(keyCode: string) {
    let direction = keyCodeToDirection(keyCode)
    if (
      direction !== undefined &&
      aiAction === AiAction.STOP_PLAYING &&
      !gameOverModalIsBeingShown &&
      !gameVictoryModalIsBeingShown
    ) {
      setBoard(makeMove(board, direction))
    }
  }

  const runAiMove = async () => {
    const direction: Direction | undefined = await solver.run(board.clone())
    setBoard(makeMove(board, direction))
  }

  useEffect(() => {
    if (aiAction === AiAction.STOP_PLAYING || aiAction === AiAction.PLAY_ONE_STEP) {
      setAiAction(AiAction.STOP_PLAYING)
    } else if (aiAction === AiAction.KEEP_PLAYING) {
      timer = setTimeout(runAiMove, 3 * animationDuration)
    }
  }, [board])

  const onAiAction = async (aiAction: AiAction) => {
    clearTimeout(timer)

    setAiAction(() => aiAction)
    if (aiAction !== AiAction.STOP_PLAYING) {
      runAiMove()
    }
  }

  const resetGame = () => {
    clearTimeout(timer)
    console.log('reset')
    setVictory(false)
    setGameVictoryModalIsBeingShown(false)
    setGameOverModalIsBeingShown(false)
    setAiAction(AiAction.STOP_PLAYING)
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
      onKeyUp={(event) => handleKeyPress(event.code)}
      ref={appRef}
      tabIndex={0}
    >
      <div className="row py-sm-3 p-lg-1 justify-content-center gx-0">
        <div className="col-12 col-sm-6 col-md-12 mb-2 mx-auto">
          <HeadingComponent
            board={board}
            aiIsPlaying={aiAction === AiAction.KEEP_PLAYING}
            newGameButtonHit={resetGame}
            onAiButtonHit={onAiAction}
            moves={moves}
            score={board.score}
          ></HeadingComponent>
        </div>
        <div className="col-12 col-sm-6 col-md-12 mx-auto">
          <BoardComponent
            board={board}
            translations={translations}
            onSlideTiles={(direction) => {
              if (direction !== undefined && aiAction === AiAction.STOP_PLAYING) {
                return setBoard(makeMove(board, direction))
              }
            }}
          ></BoardComponent>
        </div>
      </div>
      <GameOverModalComponent
        show={gameOverModalIsBeingShown}
        dismiss={() => setGameOverModalIsBeingShown(false)}
      ></GameOverModalComponent>
      <GameVictoryModalComponent
        show={gameVictoryModalIsBeingShown}
        dismiss={() => {
          //@ts-ignore
          appRef.current?.focus()
          setGameVictoryModalIsBeingShown(false)
        }}
      ></GameVictoryModalComponent>
    </div>
  )
}

export default App
