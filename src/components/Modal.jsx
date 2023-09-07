export function Modal({ children, close, title }) {
    return (
        <section className='modal'>
            <div className='text'>
                <header className='header'>
                    <h2>{title}</h2>
                    <span
                        onClick={() => close()}
                        style={{ cursor: 'pointer' }}
                    >
                        ❌
                    </span>
                </header>
                {children}
            </div>
        </section>
    )
}