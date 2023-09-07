import { useState } from "react"
import { RECORDS_KEY } from "../constants"

export function RecordSaver({ restartGame, gameStats }) {
    const [username, setUsername] = useState("")

    const handleSaveRecord = (e) => {
        e.preventDefault()

        const minesweeperRecord = JSON.parse(localStorage.getItem(RECORDS_KEY)) || []
        const newMinesweeperRecord = [
            ...minesweeperRecord,
            {
                ...gameStats,
                name: username
            }
        ]

        localStorage.setItem(RECORDS_KEY, JSON.stringify(newMinesweeperRecord))
        restartGame()
    }

    return (
        <>
            <div>
                <label htmlFor='username'>Your name:</label>
                <br />
                <input
                    id='username'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={4}
                />
            </div>
            <button onClick={handleSaveRecord}>
                Save
            </button>
        </>
    )
}