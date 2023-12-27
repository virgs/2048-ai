import { useEffect, useState } from 'react'
import { colorsFromNumber } from '../constants/Colors'
import { fontSizeFromNumber } from '../constants/Size'
import { Translation } from '../engine/BoardMover'
import './TileComponent.css'

export function TileComponent(props: { value: number, id: number, coming?: Translation }) {
    const animationDuration = Number(getComputedStyle(document.documentElement)
        .getPropertyValue('--animation-duration').replace(/[a-zA-Z]+/g, ''));
    const defaultClasses = 'tile'
    const [value, setValue] = useState(props.value)
    // const [translation, updateTranslation] = useState(props.translation)
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

        console.log('effect', props, value, props.id)
        if (props.coming) {
            if (props.value === 0) {
                console.log('disappear', props, props.id)
                // setValue(props.value)
                // setStyle(defaultStyle())
            } else if (value > 0) {
                //merge
                // console.log('merge', props)
                setTimeout(() => {
                    setValue(props.value)
                    setStyle(defaultStyle())
                    setClasses(classes + ' fadeInScale')
                    setTimeout(() => {
                        removeAnimationClasses()
                    }, animationDuration)
                }, animationDuration)
            } else if (props.value > 0 && value === 0) {
                // console.log('I was zero and it slided into me, props.id')
                setTimeout(() => {
                    setValue(props.value)
                    setStyle(defaultStyle())
                }, animationDuration)
            }
        } else {
            if (value > props.value) {
                // console.log('i went somewhere else', props.value, value, props.id)
                setValue(props.value)
                setStyle(defaultStyle())
            } else if (props.value > value || value > 0) {
                // console.log('appear out of nowhere', props.value, value, props.id)
                setTimeout(() => {
                    setStyle(defaultStyle())
                    setClasses(classes + ' fadeInScale')
                    setTimeout(() => {
                        setValue(props.value)
                        removeAnimationClasses()
                    }, animationDuration)
                }, animationDuration)
            } else {
                console.log('else', props.value, value, props.id)
                // setValue(props.value)
                // setStyle(defaultStyle())
            }
        }

    }, [props.value])

    return (
        <div id={'cell-' + props.id} className={classes} style={style}>
            {value > 0 ? value : ''}
        </div>
    )
}
