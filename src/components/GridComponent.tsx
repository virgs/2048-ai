import { useEffect } from 'react'
import { Point, pointsAreEqual } from '../constants/Point'
import { Board, Grid } from '../engine/Board'
import { MoveResult, Translation } from '../engine/BoardMover'
import './GridComponent.css'
import { animationDuration } from '../constants/Animation'
import { TileComponent } from './TileComponent'

const translate = (translation: Translation, animationDuration: number): void => {
    const tile = document.getElementById(`cell-${translation.from.y * Board.SIZE + translation.from.x}`)
    if (tile) {
        const clone = tile.cloneNode(true) as HTMLElement
        const horizontalDiff = translation.to.x - translation.from.x
        const verticalDiff = translation.to.y - translation.from.y

        clone.id += '-temp-moving'
        clone.style.zIndex = '2'
        clone.style.position = 'absolute'
        clone.style.width = tile.offsetWidth + 'px'
        clone.style.height = tile.offsetHeight + 'px'

        const parentNode = tile.parentNode
        if (parentNode) {
            parentNode.appendChild(clone)
            const parentElementWidth = tile.parentElement!.offsetWidth
            const parentElementHeight = tile.parentElement!.offsetHeight

            setTimeout(() => {
                const translate = `translate(${horizontalDiff * parentElementWidth}px, ${verticalDiff * parentElementHeight
                    }px)`
                clone.style.transform = translate
                setTimeout(() => tile.parentNode?.removeChild(clone), animationDuration)
            }, 10)
        }
    }
}

export function GridComponent({ grid, lastMoveResult }: { grid: Grid; lastMoveResult?: MoveResult }) {
    const tileSize = 100 / Board.SIZE + '%'

    useEffect(() => {
        lastMoveResult?.translations
            .forEach((translation) => translate(translation, animationDuration))
    }, [lastMoveResult])

    const isMerge = (cell: Point): boolean => {
        const sameDestinations = lastMoveResult?.translations
            .filter((translation) =>
                pointsAreEqual(translation.to, cell)
            )?.length || 0
        return sameDestinations > 1
    }

    return (
        <div className="grid p-2">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row btn-group">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="grid-cell p-2" style={{ width: tileSize }}>
                            <TileComponent
                                id={rowIndex * Board.SIZE + colIndex}
                                merge={isMerge({ x: colIndex, y: rowIndex })}
                                coming={lastMoveResult?.translations.find((translation) =>
                                    pointsAreEqual(translation.to, { x: colIndex, y: rowIndex })
                                ) !== undefined}
                                leaving={lastMoveResult?.translations
                                    .find((translation) =>
                                        pointsAreEqual(translation.from, { x: colIndex, y: rowIndex })
                                    ) !== undefined}
                                created={pointsAreEqual(lastMoveResult?.created, { x: colIndex, y: rowIndex })}
                                value={cell}
                            ></TileComponent>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
