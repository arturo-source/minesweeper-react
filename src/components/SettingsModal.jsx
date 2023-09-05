import { DIFFICULTIES, DEFAULT_RANDOM_SEED, DEFAULT_TABLE_SIZE, DEFAULT_TOTAL_BOMBS } from "../constants.js"

export function SettingsModal({ close, totalBombs, tableSize, randomSeed, isDebugMode, setTotalBombs, setTableSize, setRandomSeed, setIsDebugMode }) {
    const handleDifficultyChange = (e) => {
        const difficulty = e.target.value
        const nCells = tableSize * tableSize
        const totalBombs = Math.floor(nCells * difficulty)
        setTotalBombs(totalBombs)
    }

    const setDefaultValues = () => {
        setTotalBombs(DEFAULT_TOTAL_BOMBS)
        setTableSize(DEFAULT_TABLE_SIZE)
        setRandomSeed(DEFAULT_RANDOM_SEED)
    }

    return (
        <section className='modal'>
            <div className='text'>
                <header className='header'>
                    <h2>Settings</h2>
                    <span
                        onClick={() => close()}
                        style={{ cursor: 'pointer' }}
                    >
                        ❌
                    </span>
                </header>
                <form>
                    <div>
                        <label htmlFor='difficulty'>Difficulty</label>
                        <br />
                        <select id='difficulty' onChange={handleDifficultyChange}>
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
                            onChange={(e) => setTotalBombs(e.target.value)}
                            min={1}
                            max={tableSize * tableSize - 9}
                        />
                    </div>
                    <div>
                        <label htmlFor='tsize'>Table size</label>
                        <br />
                        <input
                            id='tsize'
                            type='number'
                            value={tableSize}
                            onChange={(e) => setTableSize(e.target.value)}
                            min={3}
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
            </div>
        </section>
    )
}