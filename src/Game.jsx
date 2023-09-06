import { useEffect, useState } from 'react'
import { SYMBOLS, DEFAULT_TABLE_SIZE, DEFAULT_TOTAL_BOMBS, DEFAULT_RANDOM_SEED, RECORDS_KEY } from './constants'
import { SettingsModal } from './components/SettingsModal.jsx'
import { Board } from './components/Board'
import { GameStats } from './components/GameStats'
import { RecordModal } from './components/RecordModal'

function Game() {
    const [playerHasLost, setPlayerHasLost] = useState(false)
    const [playerHasWon, setPlayerHasWon] = useState(false)

    const [timePlaying, setTimePlaying] = useState(0)

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

    const [totalBombs, setTotalBombs] = useState(DEFAULT_TOTAL_BOMBS)
    const [tableSize, setTableSize] = useState(DEFAULT_TABLE_SIZE)
    const [randomSeed, setRandomSeed] = useState(DEFAULT_RANDOM_SEED)
    const [isDebugMode, setIsDebugMode] = useState(false)

    const [tableCells, setTableCells] = useState(Array(tableSize * tableSize).fill(null))
    const [tableCellsInfo, setTableCellsInfo] = useState(Array(tableSize * tableSize).fill(null))

    useEffect(() => {
        const isGameWon = tableCells.every((cell, index) => {
            const isBomb = tableCellsInfo[index] === SYMBOLS.BOMB
            const isDiscovered = cell !== null && cell !== SYMBOLS.FLAG
            return isBomb || isDiscovered
        })
        if (isGameWon) setPlayerHasWon(true)

        const isGameOver = tableCells.some(cell => cell === SYMBOLS.BOMB)
        if (isGameOver) setPlayerHasLost(true)
    }, [tableCells, tableCellsInfo])

    useEffect(() => {
        if (!playerHasWon) return

        const minesweeperRecord = JSON.parse(localStorage.getItem(RECORDS_KEY)) || []
        const newMinesweeperRecord = [
            ...minesweeperRecord,
            { tableSize, totalBombs, timePlaying }
        ]

        localStorage.setItem(RECORDS_KEY, JSON.stringify(newMinesweeperRecord))
    }, [playerHasWon])

    const restartGame = () => {
        setPlayerHasLost(false)
        setPlayerHasWon(false)
        setTableCells(Array(tableSize * tableSize).fill(null))
        setTableCellsInfo(Array(tableSize * tableSize).fill(null))
        setTimePlaying(0)
    }

    return (
        <main className='board'>
            <header className='spaced-elements'>
                <h1>Minesweeper</h1>
                <button
                    onClick={() => setIsSettingsModalOpen(true)}
                >
                    ⚙️
                </button>
            </header>

            <GameStats
                tableCells={tableCells}
                tableCellsInfo={tableCellsInfo}
                timePlaying={timePlaying}
                setTimePlaying={setTimePlaying}
            />

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

            <button onClick={() => setIsRecordModalOpen(true)}>
                See Records
            </button>
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
            {isRecordModalOpen &&
                <RecordModal
                    close={() => setIsRecordModalOpen(false)}
                />
            }
        </main>
    )
}

export default Game