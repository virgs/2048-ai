import { useEffect, useState } from "react";
import { colorsFromNumber } from "../Colors";
import "./TileComponent.css";
import { fontSizeFromNumber } from "../Size";

export function TileComponent(props: { value: number }) {

    const [value, updateValue] = useState(props.value);

    useEffect(() => {
        updateValue(props.value);
    }, [props.value]);

    const style = {
        ...colorsFromNumber(value),
        fontSize: fontSizeFromNumber(value)
    }
    return (
        <div onClick={() => updateValue(value > 0 ? value * 2 : 1)} className="tile" style={style}>
            {value}
        </div>
    );
}

