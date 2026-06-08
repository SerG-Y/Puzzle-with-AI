/** Solved layout for an n x n board: 1, 2, ... n^2 - 1, blank (0). */
export function solved(size: number): number[] {
    const n = size * size
    return Array.from({ length: n }, (_, i) => (i + 1) % n)
}
