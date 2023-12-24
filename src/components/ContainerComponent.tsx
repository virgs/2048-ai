import { Board } from "../engine/Board";
import { GridComponent } from "./GridComponent";
import "./ContainerComponent.css"

export function ContainerComponent() {
    const board = new Board()

    return (
        <div className="container-2048">
            <GridComponent grid={board.grid}></GridComponent>
        </div>)
}
