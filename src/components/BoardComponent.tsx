import { useState } from 'react'
import { Point, vectorApproximateDirection } from '../constants/Point'
import { Board } from '../engine/Board'
import { Translation } from '../engine/BoardMover'
import { Direction } from '../engine/Direction'
import './BoardComponent.css'
import { GridComponent } from './GridComponent'

export function BoardComponent({
    board,
    translations,
    onSlideTiles,
}: {
    board: Board
    translations: Translation[]
    onSlideTiles: (direction: Direction) => void
}) {
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
            onSlideTiles(direction)
        }
    }

    return (
        <div
            className="board mx-auto"
            onPointerDown={(event) => setPointerDownCoordinates({ x: event.screenX, y: event.screenY })}
            onPointerUp={(e) => onPointerUp({ x: e.screenX, y: e.screenY })}
        >
            <GridComponent translations={translations} grid={board.grid}></GridComponent>
        </div>
    )
}
