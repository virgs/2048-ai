import { useEffect, useState } from 'react'
import { colorsFromNumber } from '../constants/Colors'
import { fontSizeFromNumber } from '../constants/Size'
import { animationDuration } from '../constants/Animation'
import { Translation } from '../engine/BoardMover'
import './TileComponent.css'

export function TileComponent(props: { value: number; id: number; coming?: Translation }) {
    const [timer, setTimer] = useState<number>(0)
    const defaultClasses = 'tile'
    const [value, setValue] = useState(props.value)
    const [classes, setClasses] = useState(defaultClasses)
    const defaultStyle = () => ({
        ...colorsFromNumber(props.value),
        fontSize: fontSizeFromNumber(props.value),
    })
    const [style, setStyle] = useState<React.CSSProperties>(defaultStyle())

    const removeAnimationClasses = () => {
        setClasses(defaultClasses)
    }

    useEffect(() => {
        if (timer) {
            setValue(props.value)
            setStyle(defaultStyle())
            removeAnimationClasses()
            clearTimeout(timer)
            setTimer(0)
        }
        // console.log('effect', props, value, props.id)
        if (props.coming) {
            if (value > 0) {
                // console.log('replaced', props, props.id)
                setTimer(
                    setTimeout(() => {
                        setValue(props.value)
                        setStyle(defaultStyle())
                        if (props.value === value * 2) {
                            // merge
                            setClasses(classes + ' fadeInScale')
                            setTimer(
                                setTimeout(() => {
                                    setTimer(0)
                                    removeAnimationClasses()
                                }, animationDuration)
                            )
                        }
                    }, animationDuration)
                )
            } else if (props.value > 0 && value === 0) {
                // console.log('I was zero and it slided into me, props.id')
                setTimer(
                    setTimeout(() => {
                        setValue(props.value)
                        setTimer(0)
                        setStyle(defaultStyle())
                    }, animationDuration)
                )
            }
        } else {
            if (value > props.value) {
                // console.log('i went somewhere else', props.value, value, props.id)
                setValue(props.value)
                setStyle(defaultStyle())
            } else if (props.value > value || value > 0) {
                // console.log('appear out of nowhere', props.value, value, props.id)
                setTimer(
                    setTimeout(() => {
                        setStyle(defaultStyle())
                        setClasses(classes + ' fadeInScale')
                        setTimer(
                            setTimeout(() => {
                                setValue(props.value)
                                setTimer(0)
                                removeAnimationClasses()
                            }, animationDuration)
                        )
                    }, 2 * animationDuration)
                )
            }
        }
    }, [props.value])

    return (
        <div id={'cell-' + props.id} className={classes} style={style}>
            {value > 0 ? value : ''}
        </div>
    )
}
