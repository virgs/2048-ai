import { useEffect, useState } from "react";
import { Board, Grid } from "../engine/Board";
import { TileComponent } from "./TileComponent";
import "./GridComponent.css"

export function GridComponent({ grid }: { grid: Grid }) {
    const tileSize = (100 / Board.SIZE) + '%'
    const [dragStartingPoint, dragStartingPointUpdate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        console.log(dragStartingPoint)
    }, [dragStartingPoint]);

    return (
        <div onMouseDown={event => dragStartingPointUpdate({ x: event.screenX, y: event.screenY })}
            onMouseUp={event => dragStartingPointUpdate({ x: event.screenX, y: event.screenY })}

            className="grid p-1">{
                grid
                    .map((row, rowIndex) =>
                        <div key={rowIndex} className="grid-row btn-group">
                            {
                                row
                                    .map((cell, cellIndex) =>
                                        <div key={cellIndex} className="cell" style={{ width: tileSize }}>
                                            <TileComponent value={cell}>
                                            </TileComponent>
                                        </div>)
                            }
                        </div>)}
        </div>)
}
