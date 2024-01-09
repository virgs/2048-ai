import { useEffect, useState } from 'react'
import { colorsFromNumber } from '../constants/Colors'
import { fontSizeFromNumber } from '../constants/Size'
import { animationDuration } from '../constants/Animation'
import './TileComponent.css'

export function TileComponent(props: { value: number; id: number; created: boolean; merge: boolean }) {
    const defaultClasses = 'tile'
    const [value, setValue] = useState(props.value)
    const [classes, setClasses] = useState(defaultClasses)
    const defaultStyle = () => ({
        ...colorsFromNumber(props.value),
        fontSize: fontSizeFromNumber(props.value),
    })
    const [style, setStyle] = useState<React.CSSProperties>(defaultStyle())

    const removeAnimationClasses = () => {
        setTimeout(() => {
            setClasses(defaultClasses)
        }, animationDuration)
    }

    const startAnimation = () => {
        setValue(props.value)
        setStyle(() => defaultStyle())
        if (props.created) {
            setClasses(classes + ' fadeInScale')
            removeAnimationClasses()
        } else if (props.merge) {
            setClasses(classes + ' merge')
            removeAnimationClasses()
        }
    }

    useEffect(() => {
        if (value > 0 || props.created) {
            setStyle({
                ...colorsFromNumber(0),
            })
        }
        setTimeout(startAnimation, animationDuration)
    }, [props.value, props.created, props.merge])

    return (
        <div id={'cell-' + props.id} className={classes} style={style}>
            {value > 0 ? value : ''}
        </div>
    )
}
