import { Direction } from '../engine/Direction'

export enum KeyCodes {
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    ArrowDown = 'ArrowDown',
    ArrowUp = 'ArrowUp',
}

export const keyCodeToDirection = (keyCode: string): Direction | undefined => {
    switch (keyCode) {
        case KeyCodes.ArrowLeft:
            return Direction.Left
        case KeyCodes.ArrowRight:
            return Direction.Right
        case KeyCodes.ArrowUp:
            return Direction.Up
        case KeyCodes.ArrowDown:
            return Direction.Down
    }
}
