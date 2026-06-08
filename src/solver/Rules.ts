import State from './State'

/**
 * Board mechanics for an n x n sliding puzzle: legal moves, neighbour
 * generation, the goal test, and a solvability check. The heuristic that
 * estimates distance-to-goal is left to subclasses.
 */
export default abstract class Rules {
    protected readonly arraySize: number;

    /** Index offsets of the four blank moves: up, down, left, right. */
    private readonly moves: readonly number[];

    constructor(
        protected readonly size: number,
        protected readonly terminateState: readonly number[],
    ) {
        if (size < 2) {
            throw new Error('Invalid field size.');
        }

        this.arraySize = size * size;

        if (terminateState.length !== this.arraySize) {
            throw new Error('Size of terminate state is incorrect.');
        }

        this.moves = [-size, size, -1, 1];
    }

    /** Heuristic estimate of the distance from `state` to the goal. */
    public abstract getH(state: State): number;

    /** All layouts reachable from `state` in one legal move. */
    public getNeighbors(state: State): State[] {
        const result: State[] = [];

        for (const move of this.moves) {
            const field = this.slide(state.field, move);
            if (field !== null) {
                result.push(new State(field, state));
            }
        }

        return result;
    }

    /**
     * Slide the tile adjacent to the blank by `move` (an index offset) into the
     * blank, returning the new layout, or `null` if the move runs off the board.
     */
    public slide(field: readonly number[], move: number): number[] | null {
        const blank = field.indexOf(0);
        const target = blank + move;

        if (target < 0 || target >= field.length) {
            return null;
        }
        // Horizontal moves must not wrap across a row edge.
        if (move === 1 && blank % this.size === this.size - 1) {
            return null;
        }
        if (move === -1 && blank % this.size === 0) {
            return null;
        }

        const next = [...field];
        next[blank] = next[target];
        next[target] = 0;
        return next;
    }

    public isTerminate(state: State): boolean {
        const field = state.field;
        for (let i = 0; i < this.arraySize; i++) {
            if (field[i] !== this.terminateState[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Whether `state` can actually reach the goal. Each legal move is a single
     * transposition (blank with a neighbour) that also shifts the blank one
     * taxicab step, so after any sequence of moves the permutation parity and
     * the blank's displacement parity stay locked together. A layout is thus
     * reachable iff those two parities agree. An O(n^2) check that avoids
     * hanging on impossible boards.
     */
    public isSolvable(state: State): boolean {
        const field = state.field;

        // Goal rank of every value -- blank included -- so this works for any
        // goal and counts inversions of the *full* permutation.
        const rank: number[] = [];
        for (let i = 0; i < this.arraySize; i++) {
            rank[this.terminateState[i]] = i;
        }
        const order = field.map((value) => rank[value]);

        let inversions = 0;
        for (let i = 0; i < order.length; i++) {
            for (let j = i + 1; j < order.length; j++) {
                if (order[i] > order[j]) {
                    inversions++;
                }
            }
        }

        const blankStart = field.indexOf(0);
        const blankGoal = this.terminateState.indexOf(0);
        const blankDist =
            Math.abs(Math.floor(blankStart / this.size) - Math.floor(blankGoal / this.size)) +
            Math.abs((blankStart % this.size) - (blankGoal % this.size));

        return inversions % 2 === blankDist % 2;
    }
}
