import { DEFAULT_TABLE_SIZE, SYMBOLS } from './constants'

export const minesAround = (table, index) => {
    let mines = 0
    const row = Math.floor(index / DEFAULT_TABLE_SIZE)
    const col = index % DEFAULT_TABLE_SIZE

    for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= DEFAULT_TABLE_SIZE) {
            continue
        }

        for (let j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= DEFAULT_TABLE_SIZE) {
                continue
            }

            if (table[i * DEFAULT_TABLE_SIZE + j] === SYMBOLS.BOMB) {
                mines++
            }
        }
    }

    return mines
}

export const areClose = (i1, i2) => {
    const row1 = Math.floor(i1 / DEFAULT_TABLE_SIZE)
    const col1 = i1 % DEFAULT_TABLE_SIZE
    const row2 = Math.floor(i2 / DEFAULT_TABLE_SIZE)
    const col2 = i2 % DEFAULT_TABLE_SIZE

    const rowDiff = Math.abs(row1 - row2)
    const colDiff = Math.abs(col1 - col2)

    return rowDiff <= 1 && colDiff <= 1
}

export const isOutOfBound = (i) =>
    i < 0 || i >= DEFAULT_TABLE_SIZE * DEFAULT_TABLE_SIZE

export const isInSameRow = (i1, i2) =>
    Math.floor(i1 / DEFAULT_TABLE_SIZE) === Math.floor(i2 / DEFAULT_TABLE_SIZE)

export const randomNumberGenerator = (seed) => {
    return () => {
        const x = Math.sin(seed++) * 10000
        return x - Math.floor(x)
    }
}
