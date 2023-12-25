export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export const Directions = Object.keys(Direction)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key) as Direction)
