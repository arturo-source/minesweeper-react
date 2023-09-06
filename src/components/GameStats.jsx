import { useEffect } from 'react'
import { SYMBOLS } from '../constants.js'

export function GameStats({
    tableCells, tableCellsInfo,
    timePlaying, setTimePlaying
}) {
    useEffect(() => {
        const interval = setInterval(() => {
            setTimePlaying((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const revealedCells = tableCells.reduce((acc, cell) => cell === null ? acc : acc + 1, 0)
    const totalCells = tableCells.length

    const markedCells = tableCells.reduce((acc, cell) => cell === SYMBOLS.FLAG ? acc + 1 : acc, 0)
    const totalBombs = tableCellsInfo.reduce((acc, cell) => cell === SYMBOLS.BOMB ? acc + 1 : acc, 0)

    return (
        <div className='spaced-elements' style={{ marginBottom: '16px' }}>
            <div>
                Cells: {revealedCells}/{totalCells}
            </div>
            <div>
                Bombs: {markedCells}/{totalBombs}
            </div>
            <div>
                Time: {timePlaying}
            </div>
        </div>
    )
}