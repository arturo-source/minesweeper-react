export function Square({ children, updateGame, index }) {
    const isDiscovered = children !== null
    const className = `square ${isDiscovered ? 'is-discovered' : ''}`

    return (
        <div onClick={() => updateGame(index)} className={className}>
            {children}
        </div>
    )
}