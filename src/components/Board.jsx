import { useEffect } from 'react'
import { randomNumberGenerator } from '../utils.js'
import { SYMBOLS } from '../constants.js'
import { Square } from './Square.jsx'

export function Board({
    playerHasWon, playerHasLost,
    totalBombs, tableSize, randomSeed,
    tableCells, setTableCells, tableCellsInfo, setTableCellsInfo,
    restartGame
}) {
    const isFirstPlay = tableCells.every(cell => cell === null)

    useEffect(() => {
        restartGame()
    }, [totalBombs, tableSize, randomSeed])

    const minesAround = (table, index) => {
        let mines = 0
        const row = Math.floor(index / tableSize)
        const col = index % tableSize

        for (let i = row - 1; i <= row + 1; i++) {
            if (i < 0 || i >= tableSize) {
                continue
            }

            for (let j = col - 1; j <= col + 1; j++) {
                if (j < 0 || j >= tableSize) {
                    continue
                }

                if (table[i * tableSize + j] === SYMBOLS.BOMB) {
                    mines++
                }
            }
        }

        return mines
    }

    const areClose = (i1, i2) => {
        const row1 = Math.floor(i1 / tableSize)
        const col1 = i1 % tableSize
        const row2 = Math.floor(i2 / tableSize)
        const col2 = i2 % tableSize

        const rowDiff = Math.abs(row1 - row2)
        const colDiff = Math.abs(col1 - col2)

        return rowDiff <= 1 && colDiff <= 1
    }

    const isOutOfBound = (i) =>
        i < 0 || i >= tableSize * tableSize

    const generateTableCellsInfo = (index) => {
        let generateNumber = Math.random
        if (randomSeed !== -1) {
            generateNumber = randomNumberGenerator(randomSeed)
        }

        const newTableCellsInfo = Array(tableSize * tableSize)
        for (let i = 0; i < totalBombs; i++) {
            const randomIndex = Math.floor(generateNumber() * tableSize * tableSize)
            if (areClose(index, randomIndex)) {
                i--
                continue
            }

            if (newTableCellsInfo[randomIndex] === SYMBOLS.BOMB) {
                i--
            }

            newTableCellsInfo[randomIndex] = SYMBOLS.BOMB
        }

        for (let i = 0; i < tableSize * tableSize; i++) {
            if (newTableCellsInfo[i] === SYMBOLS.BOMB) {
                continue
            }

            const numberOfMines = minesAround(newTableCellsInfo, i)
            newTableCellsInfo[i] = SYMBOLS[numberOfMines]
        }

        return newTableCellsInfo
    }

    const generateTableCells = (newTableCells, newTableCellsInfo, index) => {
        if (newTableCells[index] !== null) {
            // The cell has already been discovered
            return newTableCells
        }
        if (newTableCellsInfo[index] === SYMBOLS.BOMB) {
            // The cell is a bomb
            return newTableCells
        }

        newTableCells[index] = newTableCellsInfo[index]
        if (newTableCells[index] !== SYMBOLS[0]) {
            // The cell has a bomb nearby
            return newTableCells
        }


        const row = Math.floor(index / tableSize)
        const col = index % tableSize
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                const newIndex = i * tableSize + j
                if (!isOutOfBound(i) && areClose(index, newIndex)) {
                    newTableCells = generateTableCells(newTableCells, newTableCellsInfo, newIndex)
                }
            }
        }

        return newTableCells
    }

    const updateGame = (index) => {
        if (playerHasLost || playerHasWon) return

        if (tableCells[index] === SYMBOLS.FLAG) {
            const newTableCells = [...tableCells]
            newTableCells[index] = null
            setTableCells(newTableCells)

            return
        }

        const alreadyDiscovered = tableCells[index] !== null
        if (alreadyDiscovered) return

        if (isFirstPlay) {
            const newTableCellsInfo = generateTableCellsInfo(index)
            setTableCellsInfo(newTableCellsInfo)

            let newTableCells = [...tableCells]
            newTableCells = generateTableCells(newTableCells, newTableCellsInfo, index)
            setTableCells(newTableCells)

            return
        }

        const cellToDiscover = tableCellsInfo[index]
        const newTableCells = [...tableCells]
        newTableCells[index] = cellToDiscover
        setTableCells(newTableCells)
    }

    const addFlag = (index) => {
        if (isFirstPlay) return
        if (playerHasLost || playerHasWon) return

        const alreadyDiscovered = tableCells[index] !== null && tableCells[index] !== SYMBOLS.FLAG
        if (alreadyDiscovered) return

        const newTableCells = [...tableCells]
        newTableCells[index] = tableCells[index] === SYMBOLS.FLAG ? null : SYMBOLS.FLAG
        setTableCells(newTableCells)
    }

    return (
        <section
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${tableSize}, 1fr)`,
                gap: "5px"
            }}
        >
            {
                tableCells.map((cell, index) => (
                    <Square
                        key={index}
                        index={index}
                        updateGame={updateGame}
                        addFlag={addFlag}
                    >
                        {cell}
                    </Square>
                ))
            }
        </section>
    )
}