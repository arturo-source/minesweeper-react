import { SYMBOLS } from "../constants"

export function Square({ children, updateGame, squareSize, addFlag, index }) {
    const isDiscovered = children !== null && children !== SYMBOLS.FLAG
    const className = `square ${isDiscovered ? 'is-discovered' : ''}`

    const rightClick = (e) => {
        e.preventDefault()
        addFlag(index)
    }

    return (
        <div
            onClick={() => updateGame(index)}
            onContextMenu={rightClick}
            className={className}
            style={{ width: `${squareSize}px`, height: `${squareSize}px` }}
        >
            {children !== SYMBOLS[0] && children}
        </div>
    )
}