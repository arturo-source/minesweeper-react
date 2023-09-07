import { useEffect, useState } from "react"
import { RECORDS_KEY } from "../constants"

export function Record({ }) {
    const ALL_KEY = 'All'

    const [minesweeperRecords, setMinesweeperRecords] = useState([])

    const [sizeFilter, setSizeFilter] = useState(ALL_KEY)
    const [bombsFilter, setBombsFilter] = useState(ALL_KEY)

    const [sizeFilterValues, setSizeFilterValues] = useState([])
    const [bombsFilterValues, setBombsFilterValues] = useState([])

    useEffect(() => {
        let records = JSON.parse(localStorage.getItem(RECORDS_KEY)) || []

        if (sizeFilter != ALL_KEY)
            records = records.filter(record => record.tableSize == sizeFilter)

        if (bombsFilter != ALL_KEY)
            records = records.filter(record => record.totalBombs == bombsFilter)

        records.sort((a, b) => a.timePlaying - b.timePlaying)
        records = records.slice(0, 10)

        setMinesweeperRecords(records)
    }, [sizeFilter, bombsFilter])

    useEffect(() => {
        const records = JSON.parse(localStorage.getItem(RECORDS_KEY)) || []

        let sizeValues = records.map(record => parseInt(record.tableSize))
        sizeValues = [...new Set(sizeValues)]
        sizeValues.sort((a, b) => b - a)

        let bombsValues = records.map(record => parseInt(record.totalBombs))
        bombsValues = [...new Set(bombsValues)]
        bombsValues.sort((a, b) => b - a)

        setSizeFilterValues(sizeValues)
        setBombsFilterValues(bombsValues)
    }, [])

    return (
        <>
            <div>
                <label htmlFor='tableSize'>Size</label>
                <br />
                <select
                    name="tableSize"
                    id="tableSize"
                    onChange={e => setSizeFilter(e.target.value)}
                    style={{ width: '100%' }}
                >
                    <option value={ALL_KEY}>All</option>
                    {
                        sizeFilterValues.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <label htmlFor='totalBombs'>Bombs</label>
                <br />
                <select
                    name="totalBombs"
                    id="totalBombs"
                    onChange={e => setBombsFilter(e.target.value)}
                    style={{ width: '100%' }}
                >
                    <option value={ALL_KEY}>All</option>
                    {
                        bombsFilterValues.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))
                    }
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Bombs</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        minesweeperRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{index + 1}.</td>
                                <td>{record.name}</td>
                                <td>{record.tableSize}</td>
                                <td>{record.totalBombs}</td>
                                <td>{record.timePlaying}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}