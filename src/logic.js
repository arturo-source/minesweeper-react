import { TABLE_SIZE, SYMBOLS } from './constants'

export const minesAround = (table, index) => {
    let mines = 0
    const row = Math.floor(index / TABLE_SIZE)
    const col = index % TABLE_SIZE

    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= TABLE_SIZE) {
            continue
        }

        for (let j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= TABLE_SIZE) {
                continue
            }

            if (table[i * TABLE_SIZE + j] === SYMBOLS.BOMB) {
                mines++
            }
        }
    }

    return mines
}

export const isNear = (i1, i2) => {
    const row1 = Math.floor(i1 / TABLE_SIZE)
    const col1 = i1 % TABLE_SIZE
    const row2 = Math.floor(i2 / TABLE_SIZE)
    const col2 = i2 % TABLE_SIZE

    const rowDiff = Math.abs(row1 - row2)
    const colDiff = Math.abs(col1 - col2)

    return rowDiff <= 1 && colDiff <= 1
}

export const isOutOfBound = (i) =>
    i < 0 || i >= TABLE_SIZE * TABLE_SIZE

export const isInSameRow = (i1, i2) =>
    Math.floor(i1 / TABLE_SIZE) === Math.floor(i2 / TABLE_SIZE)

export const randomNumberGenerator = (seed) => {
    return () => {
        const x = (seed * 9301 + 49297) % 233280;
        return x / 233280;
    }
}
