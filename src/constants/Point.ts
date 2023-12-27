import { Direction } from '../engine/Direction'

export interface Point {
    x: number;
    y: number;
}

export type ApproximateDirectionOptions = {
    minLength: number
    degreesTolerance: number
}

export const pointsAreEqual = (a: Point, b: Point): boolean => {
    return a.x === b.x && a.y === b.y
}

export const vectorApproximateDirection = (
    vector: Point,
    options?: Partial<ApproximateDirectionOptions>
): Direction | undefined => {
    if (options?.minLength) {
        const minLengthSquared: number = options.minLength * options.minLength
        if (minLengthSquared > vector.x * vector.x + vector.y * vector.y) {
            return undefined
        }
    }
    var radianAngles = Math.atan2(vector.y, vector.x)
    var degrees = (180 * radianAngles) / Math.PI
    const positiveRoundedValue = (360 + Math.round(degrees)) % 360

    const tolerance = Math.min(45, options?.degreesTolerance || 0)

    if (positiveRoundedValue > 360 - tolerance || positiveRoundedValue < 0 + tolerance) return Direction.Right
    else if (positiveRoundedValue > 90 - tolerance && positiveRoundedValue < 90 + tolerance) return Direction.Down
    else if (positiveRoundedValue > 180 - tolerance && positiveRoundedValue < 180 + tolerance) return Direction.Left
    else if (positiveRoundedValue > 270 - tolerance && positiveRoundedValue < 270 + tolerance) return Direction.Up
    return undefined
}
