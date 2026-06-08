import Rules from './Rules'
import State from './State'

/**
 * Manhattan distance strengthened with linear conflict -- an admissible
 * (never-overestimating) heuristic, so IDA* using it still finds optimal
 * solutions while pruning far more aggressively than plain Manhattan.
 */
export default class RulesManhattanDistance extends Rules {
    // Goal row/column for every tile value, indexed by the value itself.
    // Precomputed once so the heuristic is a couple of array reads per tile.
    private readonly goalRow: readonly number[];
    private readonly goalCol: readonly number[];

    constructor(size: number, terminateState: readonly number[]) {
        super(size, terminateState);

        const goalRow: number[] = new Array(this.arraySize);
        const goalCol: number[] = new Array(this.arraySize);
        for (let i = 0; i < this.arraySize; i++) {
            const value = terminateState[i];
            goalRow[value] = Math.floor(i / size);
            goalCol[value] = i % size;
        }
        this.goalRow = goalRow;
        this.goalCol = goalCol;
    }

    public getH(state: State): number {
        const { field } = state;
        const size = this.size;
        let h = 0;

        // Manhattan distance: how far each tile is from its goal cell.
        for (let i = 0; i < this.arraySize; i++) {
            const value = field[i];
            if (value === 0) continue; // the blank is not a tile

            const row = Math.floor(i / size);
            const col = i % size;
            h += Math.abs(row - this.goalRow[value]) + Math.abs(col - this.goalCol[value]);
        }

        // Linear conflict: tiles already in their goal row (or column) but in the
        // wrong order must step around each other -> +2 moves per conflict.
        for (let row = 0; row < size; row++) {
            const goalOrder: number[] = new Array(size);
            for (let col = 0; col < size; col++) {
                const value = field[row * size + col];
                goalOrder[col] = value !== 0 && this.goalRow[value] === row ? this.goalCol[value] : -1;
            }
            h += this.lineConflict(goalOrder);
        }

        for (let col = 0; col < size; col++) {
            const goalOrder: number[] = new Array(size);
            for (let row = 0; row < size; row++) {
                const value = field[row * size + col];
                goalOrder[row] = value !== 0 && this.goalCol[value] === col ? this.goalRow[value] : -1;
            }
            h += this.lineConflict(goalOrder);
        }

        return h;
    }

    /**
     * Extra moves forced by tiles that belong to this line but sit in the wrong
     * order. `goalOrder[i]` is the goal position within the line of the tile at
     * line position `i`, or -1 if that tile does not belong to this line.
     *
     * Counting every reversed pair as +2 would overestimate (and break
     * optimality) when 3+ tiles are tangled, so we repeatedly remove the most
     * conflicted tile and add 2 for it -- the standard admissible formulation.
     */
    private lineConflict(goalOrder: readonly number[]): number {
        const n = goalOrder.length;
        const conflicts: boolean[][] = [];
        const counts: number[] = new Array(n).fill(0);

        for (let i = 0; i < n; i++) {
            conflicts.push(new Array(n).fill(false));
        }

        for (let i = 0; i < n; i++) {
            if (goalOrder[i] < 0) continue;
            for (let j = i + 1; j < n; j++) {
                if (goalOrder[j] < 0) continue;
                // i is left of j in the line; reversed if its goal is to the right.
                if (goalOrder[i] > goalOrder[j]) {
                    conflicts[i][j] = true;
                    conflicts[j][i] = true;
                    counts[i]++;
                    counts[j]++;
                }
            }
        }

        let result = 0;
        for (;;) {
            let maxIdx = -1;
            let maxCount = 0;
            for (let i = 0; i < n; i++) {
                if (counts[i] > maxCount) {
                    maxCount = counts[i];
                    maxIdx = i;
                }
            }
            if (maxIdx === -1) break;

            // "Move" this tile out of the line: drop all conflicts involving it.
            counts[maxIdx] = 0;
            for (let j = 0; j < n; j++) {
                if (conflicts[maxIdx][j]) {
                    conflicts[maxIdx][j] = false;
                    conflicts[j][maxIdx] = false;
                    counts[j]--;
                }
            }
            result += 2;
        }

        return result;
    }
}
