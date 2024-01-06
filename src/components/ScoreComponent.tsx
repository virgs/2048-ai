import { useEffect, useState } from "react"
import "./ScoreComponent.css"

let scoreIncreasedId = 0
const maxScoreIncreasedId = 1000

function ScoreIncreased({ increase, onDismiss, id }: { id: number, increase: number, onDismiss: (id: number) => void }) {
    useEffect(() => {
        setTimeout(() => {
            onDismiss(id);
        }, 2000)
    }, [])
    return <div className="score-increase">+{increase}</div>
}

export function ScoreComponent(props: { score: number }) {
    const [score, setScore] = useState<number>(0)
    const [increaseEffectList, setIncreaseEffectList] = useState<{ id: number, value: number }[]>([])
    const formatter = Intl.NumberFormat("en");



    const removeEffect = (id: number) => {
        setIncreaseEffectList(list => list
            .filter(effect => effect.id !== id))
    }

    useEffect(() => {
        const nextScore = props.score || 0
        const difference = nextScore - score
        if (difference > 0) {
            setIncreaseEffectList(list => list.concat({
                id: ++scoreIncreasedId % maxScoreIncreasedId,
                value: difference
            }))
        }
        setScore(nextScore)
    }, [props.score])


    return <>
        <div style={{ lineHeight: 'normal', position: 'relative', fontSize: '20px' }}>
            {increaseEffectList
                .map((effect) => <ScoreIncreased key={effect.id} id={effect.id} increase={effect.value} onDismiss={removeEffect}>
                </ScoreIncreased>)}
            {formatter.format(props.score)}
        </div>
    </>
}