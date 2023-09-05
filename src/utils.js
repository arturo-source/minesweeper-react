export const randomNumberGenerator = (seed) => {
    return () => {
        const x = Math.sin(seed++) * 10000
        return x - Math.floor(x)
    }
}
