import { useState } from 'react'
import { SYMBOLS, TABLE_SIZE, BOMB_COUNT, RANDOM_SEED } from './constants'
import { Square } from './components/Square.jsx'
import { minesAround, areClose, isOutOfBound, isInSameRow, randomNumberGenerator } from './logic.js'

function App() {
  const [tableCells, setTableCells] = useState(Array(TABLE_SIZE * TABLE_SIZE).fill(null))
  const [tableCellsInfo, setTableCellsInfo] = useState(Array(TABLE_SIZE * TABLE_SIZE).fill(null))

  const [playerHasLost, setPlayerHasLost] = useState(false)
  const [playerHasWon, setPlayerHasWon] = useState(false)

  const isFirstPlay = tableCells.every(cell => cell === null)

  const generateTableCellsInfo = (index) => {
    const generateNumber = randomNumberGenerator(RANDOM_SEED)
    const newTableCellsInfo = Array(TABLE_SIZE * TABLE_SIZE)

    for (let i = 0; i < BOMB_COUNT; i++) {
      const randomIndex = Math.floor(generateNumber() * TABLE_SIZE * TABLE_SIZE)
      if (areClose(index, randomIndex)) {
        i--
        continue
      }

      if (newTableCellsInfo[randomIndex] === SYMBOLS.BOMB) {
        i--
      }

      newTableCellsInfo[randomIndex] = SYMBOLS.BOMB
    }

    for (let i = 0; i < TABLE_SIZE * TABLE_SIZE; i++) {
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


    const topAndDown = [index - TABLE_SIZE, index + TABLE_SIZE]
    for (const i of topAndDown) {
      if (!isOutOfBound(i)) {
        newTableCells = generateTableCells(newTableCells, newTableCellsInfo, i)
      }
    }

    const leftAndRight = [index - 1, index + 1]
    for (const i of leftAndRight) {
      if (!isOutOfBound(i) && isInSameRow(index, i)) {
        newTableCells = generateTableCells(newTableCells, newTableCellsInfo, i)
      }
    }

    return newTableCells
  }

  const updateGame = (index) => {
    if (playerHasLost || playerHasWon) return

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


    const isGameWon = newTableCells.every((cell, index) => {
      const isBomb = tableCellsInfo[index] === SYMBOLS.BOMB
      const isDiscovered = cell !== null
      return isBomb || isDiscovered
    })
    if (isGameWon) setPlayerHasWon(true)
    if (cellToDiscover === SYMBOLS.BOMB) setPlayerHasLost(true)
  }

  return (
    <main className='board'>
      <h1>Minesweeper</h1>
      <section className='game'>
        {
          tableCells.map((cell, index) => (
            <Square
              key={index}
              index={index}
              updateGame={updateGame}
            >
              {cell}
            </Square>
          ))
        }
      </section>
      {playerHasLost && <p>Game Over</p>}
      {playerHasWon && <p>You Won</p>}
    </main>
  )
}

export default App