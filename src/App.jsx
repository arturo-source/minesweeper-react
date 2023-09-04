import { useState } from 'react'
import { SYMBOLS, TABLE_SIZE, BOMB_COUNT } from './constants'
import { Square } from './components/Square.jsx'

function App() {
  const [tableCells, setTableCells] = useState(Array(TABLE_SIZE * TABLE_SIZE).fill(null))
  const [tableCellsInfo, setTableCellsInfo] = useState(Array(TABLE_SIZE * TABLE_SIZE).fill(null))

  const isFirstPlay = tableCells.every(cell => cell === null)

  const minesAround = (table, index) => {
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

  const generateTable = () => {
    const newTableCellsInfo = Array(TABLE_SIZE * TABLE_SIZE)
    for (let i = 0; i < BOMB_COUNT; i++) {
      const randomIndex = Math.floor(Math.random() * TABLE_SIZE * TABLE_SIZE)
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
      let numberSymbol = SYMBOLS[numberOfMines]
      if (numberSymbol === SYMBOLS[0]) {
        numberSymbol = ''
      }

      newTableCellsInfo[i] = numberSymbol
    }

    setTableCellsInfo(newTableCellsInfo)
    return newTableCellsInfo
  }

  const updateGame = (index) => {
    const alreadyDiscovered = tableCells[index] !== null
    if (alreadyDiscovered) {
      return
    }

    let newCellValue = ""
    if (isFirstPlay) {
      const table = generateTable()
      newCellValue = table[index]
    } else {
      newCellValue = tableCellsInfo[index]
    }

    const newTableCells = [...tableCells]
    newTableCells[index] = newCellValue
    setTableCells(newTableCells)
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
    </main>
  )
}

export default App