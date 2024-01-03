import { useEffect, useState } from 'react'
import './Heading.css'
import { Direction } from './engine/Direction'

type HeadingProps = {
  score: number
  moves: Direction[]
  onAiButtonHit: (runs: number) => void
  newGameButtonHit: () => void
}

function Heading({ score, moves, onAiButtonHit, newGameButtonHit }: HeadingProps) {
  const [movesTextHasOverflown, setMovesTextHasOverflown] = useState<Boolean>(false)
  const mappedMoves = () => moves
    .map(move => {
      switch (move) {
        case Direction.Up: return '⬆️'
        case Direction.Down: return '⬇️'
        case Direction.Left: return '⬅️'
        case Direction.Right: return '➡️'
      }
    })
    .join('')

  useEffect(() => {
    const text = document.querySelector('.moves-text')
    if (text) {
      const textWidth = text.scrollWidth
      const parentWidth = text.parentElement!.clientWidth
      console.log(textWidth, parentWidth, textWidth > parentWidth)
      if (textWidth > parentWidth) {
        setMovesTextHasOverflown(true)
      }
    }
  }, [moves])

  return (
    <div className='heading container mx-auto m-0 p-md-0'>
      <div className='row g-0 justify-content-between align-items-center mb-3'>
        <div className='col-6'>
          <h1 className='title'>2048</h1>
        </div>
        <div className='col-5 col-sm-4'>
          <div className='pannel'>
            <div className='pannel-title'>score</div>
            <div style={{ lineHeight: 'normal' }}>{score}</div>
          </div>
        </div>
      </div>
      <div className='row g-0 justify-content-between align-items-center mb-3'>
        <div className='col-6'>
          <div style={{ textAlign: 'left', fontSize: '24px' }}>Join the tiles, get to <strong>2048!</strong></div>
        </div>
        <div className='col-5 col-sm-4'>
          <button className='game-button' onClick={newGameButtonHit}>New Game</button>
        </div>
      </div>
      <div className='row g-0 justify-content-between align-items-center mb-3'>
        <div className='col-12'>
          <div className='pannel'>
            <div className='pannel-title'>moves ({moves.length})
              <div className='row justify-content-between m-0' style={{ fontSize: '16px', minHeight: '34px' }}>
                <div className='col-1 pr-0 mx-0 moves-ellipsis' style={{ color: movesTextHasOverflown ? 'unset' : 'transparent', fontSize: '20px' }}>...</div>
                <div className='col-11 p-1 pl-0' style={{ maxWidth: 'calc(100%-50px)' }}>
                  <div className='moves-text-container'>
                    <div className='moves-text'>{mappedMoves()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row mb-3 align-items-center'>
        <div className='col-auto' style={{ fontWeight: 'bolder', fontSize: '20px' }}>AI</div>
        <div className='col' style={{ borderTop: '1px solid #bbada0', width: '100%' }}></div>
      </div>
      <div className='row justify-content-between align-items-center mb-3'>
        <div className='col-6'>
          <button className='game-button' onClick={() => onAiButtonHit(1)}>One step</button>
        </div>
        <div className='col-6'>
          <button className='game-button' onClick={() => onAiButtonHit(2)}>{true ? 'Play forever' : 'Stop playing'}</button>
        </div>
      </div>
    </div>
  )
}

export default Heading
