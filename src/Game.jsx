import { useEffect, useState } from 'react'
import { SYMBOLS, DEFAULT_TABLE_SIZE, DEFAULT_TOTAL_BOMBS, DEFAULT_RANDOM_SEED } from './constants'
import { SettingsModal } from './components/SettingsModal.jsx'
import { Board } from './components/Board'

function Game() {
    const [playerHasLost, setPlayerHasLost] = useState(false)
    const [playerHasWon, setPlayerHasWon] = useState(false)

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

    const [totalBombs, setTotalBombs] = useState(DEFAULT_TOTAL_BOMBS)
    const [tableSize, setTableSize] = useState(DEFAULT_TABLE_SIZE)
    const [randomSeed, setRandomSeed] = useState(DEFAULT_RANDOM_SEED)
    const [isDebugMode, setIsDebugMode] = useState(false)

    const [tableCells, setTableCells] = useState(Array(tableSize * tableSize).fill(null))
    const [tableCellsInfo, setTableCellsInfo] = useState(Array(tableSize * tableSize).fill(null))

    useEffect(() => {
        const isGameWon = tableCells.every((cell, index) => {
            const isBomb = tableCellsInfo[index] === SYMBOLS.BOMB
            const isDiscovered = cell !== null
            return isBomb || isDiscovered
        })
        if (isGameWon) setPlayerHasWon(true)

        const isGameOver = tableCells.some(cell => cell === SYMBOLS.BOMB)
        if (isGameOver) setPlayerHasLost(true)
    }, [tableCells, tableCellsInfo])

    const restartGame = () => {
        setPlayerHasLost(false)
        setPlayerHasWon(false)
        setTableCells(Array(tableSize * tableSize).fill(null))
        setTableCellsInfo(Array(tableSize * tableSize).fill(null))
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

            <Board
                totalBombs={totalBombs}
                tableSize={tableSize}
                randomSeed={randomSeed}
                isDebugMode={isDebugMode}
                playerHasLost={playerHasLost}
                playerHasWon={playerHasWon}
                tableCells={tableCells}
                setTableCells={setTableCells}
                tableCellsInfo={tableCellsInfo}
                setTableCellsInfo={setTableCellsInfo}
                restartGame={restartGame}
            />

            <button onClick={restartGame}>
                Restart Game
            </button>

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
                    isDebugMode={isDebugMode}
                    setIsDebugMode={setIsDebugMode}
                />
            }
        </main>
    )
}

export default Game