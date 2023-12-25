import { useState } from 'react'
import { Point, vectorApproximateDirection } from '../constants/Point'
import { Board } from '../engine/Board'
import { BoardMover } from '../engine/BoardMover'
import { Direction } from '../engine/Direction'
import './ContainerComponent.css'
import { GridComponent } from './GridComponent'

export function ContainerComponent() {
    const [board, updateBoard] = useState<Board>(new Board())
    const [pointerDownCoordinates, setPointerDownCoordinates] = useState<Point>({ x: 0, y: 0 })

    const onPointerUp = (point: Point) => {
        const direction = vectorApproximateDirection(
            {
                x: point.x - pointerDownCoordinates.x,
                y: point.y - pointerDownCoordinates.y,
            },
            { minLength: 50, degreesTolerance: 30 }
        )
        if (direction !== undefined) {
            console.log(Direction[direction])
            const afterMove = new BoardMover(board).move(direction)
            console.log(afterMove.changes)
            afterMove.board.print()
            updateBoard(afterMove.board)
        }
    }

    function handleKeyPress(keyCode: string) {
        let direction = undefined
        switch (keyCode) {
            case 'ArrowLeft':
                direction = Direction.Left
                break
            case 'ArrowRight':
                direction = Direction.Right
                break
            case 'ArrowUp':
                direction = Direction.Up
                break
            case 'ArrowDown':
                direction = Direction.Down
                break
        }

        if (direction !== undefined) {
            console.log(Direction[direction])
            const afterMove = new BoardMover(board).move(direction)
            console.log(afterMove.changes)
            afterMove.board.print()
            updateBoard(afterMove.board)
        }
    }

    return (
        <div
            className="container-2048"
            onPointerDown={(event) => setPointerDownCoordinates({ x: event.screenX, y: event.screenY })}
            onPointerUp={(e) => onPointerUp({ x: e.screenX, y: e.screenY })}
            onKeyUp={(event) => handleKeyPress(event.code)}
            tabIndex={0}
        >
            <GridComponent grid={board.grid}></GridComponent>
        </div>
    )
}
