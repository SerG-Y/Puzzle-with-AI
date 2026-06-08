/**
 * A node in the search: an immutable board layout plus its search costs.
 * `g`/`h` are mutable because the same layout is re-scored on each visit
 * during iterative deepening.
 */
export default class State {
    /** Stable key for the layout. Comma-separated so multi-digit tiles
     *  (10..15 on a 4x4) can't collide, e.g. [1,12] vs [11,2]. */
    readonly hash: string;

    /** Cost from the start node. */
    g = 0;
    /** Heuristic estimate to the goal. */
    h = 0;

    constructor(
        readonly field: readonly number[],
        readonly parent: State | null = null,
    ) {
        this.hash = field.join(',');
    }

    /** Estimated total cost of a path through this node. */
    get f(): number {
        return this.g + this.h;
    }
}
