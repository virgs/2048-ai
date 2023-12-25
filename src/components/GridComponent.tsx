import { Board, Grid } from '../engine/Board'
import './GridComponent.css'
import { TileComponent } from './TileComponent'

export function GridComponent({ grid }: { grid: Grid }) {
    const tileSize = 100 / Board.SIZE + '%'

    return (
        <div className="grid p-1">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row btn-group">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="grid-cell" style={{ width: tileSize }}>
                            <TileComponent value={cell}></TileComponent>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
