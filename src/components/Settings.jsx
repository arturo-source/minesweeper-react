import { DIFFICULTIES, DEFAULT_RANDOM_SEED, DEFAULT_TABLE_SIZE, DEFAULT_TOTAL_BOMBS } from "../constants.js"
import { clampInt } from "../utils.js"

export function Settings({
    totalBombs, setTotalBombs,
    tableSize, setTableSize,
    randomSeed, setRandomSeed,
    isDebugMode, setIsDebugMode
}) {
    const handleDifficultyChange = (e) => {
        const difficulty = e.target.value
        if (isNaN(difficulty)) return

        const nCells = tableSize * tableSize
        const totalBombs = Math.floor(nCells * difficulty)
        setTotalBombs(totalBombs)
    }

    const setDefaultValues = () => {
        setTotalBombs(DEFAULT_TOTAL_BOMBS)
        setTableSize(DEFAULT_TABLE_SIZE)
        setRandomSeed(DEFAULT_RANDOM_SEED)
    }

    const handleBombsChange = (e) => {
        let bombs = e.target.value
        const maxBombs = tableSize * tableSize - 9
        bombs = clampInt(bombs, 1, maxBombs)

        setTotalBombs(bombs)
    }

    const handleTableSizeChange = (e) => {
        let tSize = e.target.value
        const maxBombs = tSize * tSize - 9
        if (totalBombs > maxBombs) setTotalBombs(maxBombs)

        tSize = clampInt(tSize, 4, 20)
        setTableSize(tSize)
    }

    return (
        <>
            <form>
                <div>
                    <label htmlFor='difficulty'>Difficulty</label>
                    <br />
                    <select id='difficulty' onChange={handleDifficultyChange}>
                        <option>Choose</option>
                        {
                            Object.entries(DIFFICULTIES).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor='nbombs'>Number of bombs</label>
                    <br />
                    <input
                        id='nbombs'
                        type='number'
                        value={totalBombs}
                        onChange={handleBombsChange}
                    />
                </div>
                <div>
                    <label htmlFor='tsize'>Table size</label>
                    <br />
                    <input
                        id='tsize'
                        type='number'
                        value={tableSize}
                        onChange={handleTableSizeChange}
                    />
                </div>
                <div>
                    <label htmlFor='rseed'>Seed</label>
                    <br />
                    <input
                        id='rseed'
                        type='number'
                        value={randomSeed}
                        onChange={(e) => setRandomSeed(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='isDebugMode'>Reveal board</label>
                    <br />
                    <input
                        id='isDebugMode'
                        type='checkbox'
                        checked={isDebugMode}
                        onChange={(e) => setIsDebugMode(e.target.checked)}
                    />
                </div>
            </form>
            <button onClick={() => setDefaultValues()} >
                Reset to default
            </button>
        </>
    )
}