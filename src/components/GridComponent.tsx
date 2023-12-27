import { useEffect } from 'react'
import { pointsAreEqual } from '../constants/Point'
import { Board, Grid } from '../engine/Board'
import { Translation } from '../engine/BoardMover'
import './GridComponent.css'
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

        tile.parentNode?.appendChild(clone)

        setTimeout(() => {
            const translate = `translate(${horizontalDiff * 100}%, ${verticalDiff * 100}%)`
            clone.style.transform = translate
            setTimeout(() => tile.parentNode?.removeChild(clone), animationDuration)
        }, 10)
    }
}

export function GridComponent({ grid, translations }: { grid: Grid, translations: Translation[] }) {
    const tileSize = 100 / Board.SIZE + '%'
    const animationDuration = Number(getComputedStyle(document.documentElement)
        .getPropertyValue('--animation-duration').replace(/[a-zA-Z]+/g, ''));

    useEffect(() => {
        translations
            .forEach(translation => translate(translation, animationDuration));
    }, [translations])

    return (
        <div className="grid p-1">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row btn-group">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="grid-cell" style={{ width: tileSize }}>
                            <TileComponent
                                id={rowIndex * Board.SIZE + colIndex}
                                // leaving={translations.find(translation => pointsAreEqual(translation.from, { x: colIndex, y: rowIndex }))}
                                coming={translations.find(translation => pointsAreEqual(translation.to, { x: colIndex, y: rowIndex }))}
                                value={cell}>
                            </TileComponent>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
