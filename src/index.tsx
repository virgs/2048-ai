/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'

// import { MonteCarlo } from './ai/MonteCarlo'
// import { Board } from './engine/Board'
// import { Direction } from './engine/Direction'
import './index.css'
import { Board } from './engine/Board'
import { Direction } from './engine/Direction'
import { BoardMover } from './engine/BoardMover'
import { MonteCarlo } from './ai/MonteCarlo'

const root = document.getElementById('root')
render(() => <App />, root!)

let board = new Board()
// board.printBoard()
// board = new BoardMover(board).makeMove(Direction.Right)
// board.printBoard()
// board = new BoardMover(board).makeMove(Direction.Down)
// board.printBoard()
// board = new BoardMover(board).makeMove(Direction.Left)
// board.printBoard()
// board = new BoardMover(board).makeMove(Direction.Up)
// board.printBoard()
const monteCarlo = new MonteCarlo(50)
let movesCounter = 2000000
while (!board.gameIsOver() && --movesCounter > 0) {
    const bestMove = monteCarlo.findBestMove(board)!
    if (bestMove !== null) {
        board = new BoardMover(board).makeMove(bestMove)
    }
    // console.log(bestMove, board.score)
}
board.print()

