import { useEffect, useState } from 'react'
import './Heading.css'
import { Direction } from './engine/Direction'
import { AiAction } from './constants/AiAction'
import { Play, SkipForward, X, RefreshCw } from 'react-feather'

type HeadingProps = {
    score: number
    moves: Direction[]
    aiIsPlaying: boolean
    onAiButtonHit: (aiAction: AiAction) => void
    newGameButtonHit: () => void
}

const featherIconSize = '.9rem'

export default function Heading({ score, moves, aiIsPlaying, onAiButtonHit, newGameButtonHit }: HeadingProps) {
    const [movesTextHasOverflown, setMovesTextHasOverflown] = useState<Boolean>(false)
    const mappedMoves = () =>
        moves
            .map((move) => {
                switch (move) {
                    case Direction.Up:
                        return '↑'
                    case Direction.Down:
                        return '↓'
                    case Direction.Left:
                        return '←'
                    case Direction.Right:
                        return '→'
                }
            })
            .join('')

    useEffect(() => {
        const text = document.querySelector('.moves-text')
        if (text) {
            const textWidth = text.scrollWidth
            const parentWidth = text.parentElement!.clientWidth
            if (textWidth > parentWidth) {
                setMovesTextHasOverflown(true)
            }
        }
    }, [moves])

    const mainActionButton = () => {
        if (aiIsPlaying) {
            return (
                <button
                    type="button"
                    className="btn game-button abort-button"
                    onClick={() => onAiButtonHit(AiAction.STOP_PLAYING)}
                >
                    <X size={featherIconSize} className="feather-icon" /> Abort
                </button>
            )
        } else {
            return (
                <button type="button" className="btn game-button" onClick={() => onAiButtonHit(AiAction.KEEP_PLAYING)}>
                    <Play size={featherIconSize} className="feather-icon" />
                    Play
                </button>
            )
        }
    }

    return (
        <div className="heading container mx-auto m-0 p-md-0">
            <div className="row g-0 justify-content-between align-items-center mb-1">
                <div className="col-6">
                    <h1 className="title">2048</h1>
                </div>
                <div className="col-5 col-md-4">
                    <div className="pannel">
                        <div className="pannel-title">score</div>
                        <div style={{ lineHeight: 'normal' }}>{score}</div>
                    </div>
                </div>
            </div>
            <div className="row g-0 justify-content-between align-items-center mb-1">
                <div className="col-6">
                    <div style={{ textAlign: 'left', fontSize: '22px' }}>
                        Join the tiles, get to <strong>2048!</strong>
                    </div>
                </div>
                <div className="col-5 col-md-4">
                    <button type="button" className="btn game-button" onClick={newGameButtonHit}>
                        <RefreshCw size={featherIconSize} className="feather-icon" />
                        Restart
                    </button>
                </div>
            </div>
            <div className="row g-0 justify-content-between align-items-center mb-1">
                <div className="col-12">
                    <div className="pannel">
                        <div className="pannel-title">
                            moves ({moves.length})
                            <div
                                className="row justify-content-between m-0"
                                style={{ fontSize: '16px', minHeight: '34px' }}
                            >
                                <div
                                    className="col-1 pe-0 mx-0 moves-ellipsis"
                                    style={{ color: movesTextHasOverflown ? 'unset' : 'transparent', fontSize: '20px' }}
                                >
                                    ...
                                </div>
                                <div className="col-11 p-1 ps-0" style={{ maxWidth: 'calc(100%-50px)' }}>
                                    <div className="moves-text-container">
                                        <div className="moves-text">{mappedMoves()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-1 g-0 align-items-center">
                <div className="col-auto" style={{ fontWeight: 'bolder', fontSize: '16px' }}>
                    AI
                </div>
                <div className="col ms-2" style={{ borderTop: '1.5px solid #bbada0', width: '100%' }}></div>
            </div>
            <div className="row g-0 justify-content-between align-items-center mb-1">
                <div className="col-5 col-md-4">
                    <button
                        disabled={aiIsPlaying}
                        type="button"
                        className="btn button-secondary game-button"
                        onClick={() => onAiButtonHit(AiAction.PLAY_ONE_STEP)}
                    >
                        <SkipForward size={featherIconSize} className="feather-icon" />
                        Play once
                    </button>
                </div>
                <div className="col-5 col-md-4">{mainActionButton()}</div>
            </div>
        </div>
    )
}
