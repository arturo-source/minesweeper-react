import { useState } from 'react'
import { SYMBOLS, TABLE_SIZE } from './constants'
import { Square } from './components/Square.jsx'

function App() {
  const [tableCells, setTableCells] = useState(Array(TABLE_SIZE * TABLE_SIZE).fill(null))

  const isFirstPlay = tableCells.every(cell => cell === null)
  const updateGame = (index) => {
    const newTableCells = [...tableCells]
    newTableCells[index] = SYMBOLS.FLAG
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