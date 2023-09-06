import { useEffect, useState } from "react"
import { RECORDS_KEY } from "../constants"

export function RecordModal({ close }) {
    const [minesweeperRecords, setMinesweeperRecords] = useState([])
    const [sizeFilter, setSizeFilter] = useState(0)
    const [bombsFilter, setBombsFilter] = useState(0)

    useEffect(() => {
        let records = JSON.parse(localStorage.getItem(RECORDS_KEY)) || []

        if (sizeFilter != 0)
            records = records.filter(record => record.tableSize === sizeFilter)

        if (bombsFilter != 0)
            records = records.filter(record => record.totalBombs === bombsFilter)

        records.sort((a, b) => a.timePlaying - b.timePlaying)
        records = records.slice(0, 10)

        setMinesweeperRecords(records)
    }, [sizeFilter, bombsFilter])

    return (
        <section className='modal'>
            <div className='text'>
                <header className='header'>
                    <h2>Records</h2>
                    <span
                        onClick={() => close()}
                        style={{ cursor: 'pointer' }}
                    >
                        ❌
                    </span>
                </header>
                <div>
                    <label htmlFor='tableSize'>Size</label>
                    <br />
                    <input
                        id="tableSize"
                        type="number"
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='totalBombs'>Bombs</label>
                    <br />
                    <input
                        id="totalBombs"
                        type="number"
                        value={bombsFilter}
                        onChange={(e) => setBombsFilter(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Bombs</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            minesweeperRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.tableSize}</td>
                                    <td>{record.totalBombs}</td>
                                    <td>{record.timePlaying}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )
}