import { useEffect } from 'react'
import { randomNumberGenerator } from '../utils.js'
import { SYMBOLS } from '../constants.js'
import { Square } from './Square.jsx'

export function Board({
    playerHasWon, playerHasLost,
    totalBombs, tableSize, randomSeed, isDebugMode,
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

    const revealAllPossibleCells = (newTableCells, newTableCellsInfo, index) => {
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
                    newTableCells = revealAllPossibleCells(newTableCells, newTableCellsInfo, newIndex)
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

        let newTableCellsInfo = [...tableCellsInfo]
        if (isFirstPlay) {
            newTableCellsInfo = generateTableCellsInfo(index)
            setTableCellsInfo(newTableCellsInfo)
        }

        let newTableCells = [...tableCells]
        newTableCells = revealAllPossibleCells(newTableCells, newTableCellsInfo, index)

        if (newTableCellsInfo[index] === SYMBOLS.BOMB) {
            // revealAllPossibleCells will not reveal the bomb, so we do it manually
            newTableCells[index] = SYMBOLS.BOMB
        }

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

    let cellsToShow = tableCells
    if (isDebugMode) cellsToShow = tableCellsInfo

    const windowSize = window.screen.width
    let squareSize = windowSize / (tableSize + 2)
    if (squareSize > 50) squareSize = 50
    if (squareSize < 30) squareSize = 30

    return (
        <section
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${tableSize}, 1fr)`,
                gap: "5px"
            }}
        >
            {
                cellsToShow.map((cell, index) => (
                    <Square
                        key={index}
                        index={index}
                        squareSize={squareSize}
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