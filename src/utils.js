export const randomNumberGenerator = (seed) => {
    return () => {
        const x = Math.sin(seed++) * 10000
        return x - Math.floor(x)
    }
}

export const clampInt = (val, min, max) => {
    if (val < min) return min
    if (val > max) return max
    return val
}