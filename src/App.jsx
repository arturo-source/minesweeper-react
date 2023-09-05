import { useState } from 'react'
import { SYMBOLS, DEFAULT_TABLE_SIZE, DEFAULT_TOTAL_BOMBS, DEFAULT_RANDOM_SEED } from './constants'
import { minesAround, areClose, isOutOfBound, isInSameRow, randomNumberGenerator } from './logic.js'
import { Square } from './components/Square.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'

function App() {
  const [playerHasLost, setPlayerHasLost] = useState(false)
  const [playerHasWon, setPlayerHasWon] = useState(false)

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const [totalBombs, setTotalBombs] = useState(DEFAULT_TOTAL_BOMBS)
  const [tableSize, setTableSize] = useState(DEFAULT_TABLE_SIZE)
  const [randomSeed, setRandomSeed] = useState(DEFAULT_RANDOM_SEED)

  const [tableCells, setTableCells] = useState(Array(tableSize * tableSize).fill(null))
  const [tableCellsInfo, setTableCellsInfo] = useState(Array(tableSize * tableSize).fill(null))

  const isFirstPlay = tableCells.every(cell => cell === null)

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


    const topAndDown = [index - tableSize, index + tableSize]
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
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Minesweeper</h1>
        <button
          onClick={() => setIsSettingsModalOpen(true)}
        >
          ⚙️
        </button>
      </header>
      {/* TODO: count discovered cells - bombs missin - time playing (secs) */}
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

      {isSettingsModalOpen &&
        <SettingsModal
          close={() => setIsSettingsModalOpen(false)}
          totalBombs={totalBombs}
          setTotalBombs={setTotalBombs}
          tableSize={tableSize}
          setTableSize={setTableSize}
          randomSeed={randomSeed}
          setRandomSeed={setRandomSeed}
        />
      }
    </main>
  )
}

export default App