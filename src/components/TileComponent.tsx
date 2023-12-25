import { useEffect, useState } from 'react'
import { colorsFromNumber } from '../constants/Colors'
import { fontSizeFromNumber } from '../constants/Size'
import './TileComponent.css'

export function TileComponent(props: { value: number }) {
    const [classes, updateClasses] = useState('tile')
    const [value, updateValue] = useState(props.value)

    useEffect(() => {
        console.log('number changed', value, props.value)
        updateValue(props.value)
        if (props.value > 0) {
            updateClasses(classes + ' animate')
            setTimeout(() => {
                updateClasses('tile')
            }, 750)
        }
    }, [props.value])

    const style = {
        ...colorsFromNumber(value),
        fontSize: fontSizeFromNumber(value),
    }

    return (
        <div className={classes} style={style}>
            {value > 0 ? value : ''}
        </div>
    )
}
