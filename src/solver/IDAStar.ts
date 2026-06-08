import Rules from './Rules'
import State from './State'

/**
 * Iterative Deepening A*. Uses memory proportional to the solution length
 * (just the current path on the stack) instead of A*'s exponential frontier,
 * which is what lets it solve 15-puzzles without freezing. With an admissible
 * heuristic the first solution found is optimal.
 */
export default class IDAStar {
    constructor(private readonly rules: Rules) {}

    public search(start: State): State[] | null {
        // Half of all layouts can't reach the goal. Without this guard the search
        // below would raise the bound forever and hang on such a board.
        if (!this.rules.isSolvable(start)) {
            return null;
        }

        start.g = 0;
        start.h = this.rules.getH(start);

        // The first bound is the heuristic of the start; f = g + h and g = 0.
        let bound = start.h;

        for (;;) {
            const result = this.dfs(start, bound);

            if (result instanceof State) {
                return this.reconstruct(result);
            }
            // No node exceeded the bound -> the whole tree is searched, no goal.
            if (result === Infinity) {
                return null;
            }
            // Raise the bound to the cheapest node we had to prune and retry.
            bound = result;
        }
    }

    /**
     * Bounded depth-first search. Returns the goal `State` once found, otherwise
     * the smallest f-value that exceeded `bound` (the next bound to try).
     */
    private dfs(node: State, bound: number): State | number {
        if (node.f > bound) {
            return node.f;
        }
        if (this.rules.isTerminate(node)) {
            return node;
        }

        let nextBound = Infinity;
        for (const next of this.rules.getNeighbors(node)) {
            // Reverse-move pruning: never undo the move we just made. Without
            // this the search oscillates and the tree explodes.
            if (node.parent !== null && next.hash === node.parent.hash) {
                continue;
            }

            next.g = node.g + 1;
            next.h = this.rules.getH(next);

            const result = this.dfs(next, bound);
            if (result instanceof State) {
                return result; // unwind straight to search() with the solution
            }
            if (result < nextBound) {
                nextBound = result;
            }
        }

        return nextBound;
    }

    private reconstruct(goal: State): State[] {
        const path: State[] = [];
        for (let node: State | null = goal; node !== null; node = node.parent) {
            path.unshift(node);
        }
        return path;
    }
}
