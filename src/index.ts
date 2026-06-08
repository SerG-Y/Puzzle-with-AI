import '../style.css'
import State from './State'
import IDAStar from './IDAStar/IDAStar'
import RulesManhattanDistance from './RulesManhattanDistance'
import Puzzle, { Direction } from './Puzzle'

/** Goal layout for an n x n board: 1, 2, ... n^2 - 1, blank. */
function goalFor(size: number): number[] {
    const total = size * size;
    return Array.from({ length: total }, (_, i) => (i + 1) % total);
}

function blankRowCol(field: readonly number[], size: number): [number, number] {
    const i = field.indexOf(0);
    return [Math.floor(i / size), i % size];
}

/** The direction the blank moves going from layout `a` to layout `b`. */
function moveBetween(a: readonly number[], b: readonly number[], size: number): Direction {
    const [aRow, aCol] = blankRowCol(a, size);
    const [bRow, bCol] = blankRowCol(b, size);
    if (bRow < aRow) return 'Top';
    if (bRow > aRow) return 'Bottom';
    if (bCol > aCol) return 'Right';
    return 'Left';
}

/** Turn a solution path into the sequence of moves that walks it. */
function solutionToMoves(path: State[], size: number): Direction[] {
    const moves: Direction[] = [];
    for (let i = 0; i < path.length - 1; i++) {
        moves.push(moveBetween(path[i].field, path[i + 1].field, size));
    }
    return moves;
}

window.onload = () => {
    const canvas = document.getElementById('puzzle') as HTMLCanvasElement | null;
    const solveButton = document.getElementById('solve');
    const resetButton = document.getElementById('reset');
    const radios = document.querySelectorAll<HTMLInputElement>('input[name=group1]');

    if (!canvas || !solveButton || !resetButton) {
        throw new Error('Puzzle DOM elements are missing.');
    }

    let size = 3;
    let puzzle = new Puzzle(canvas, size);
    let animation: number | undefined;

    const stopAnimation = (): void => {
        if (animation !== undefined) {
            clearInterval(animation);
            animation = undefined;
        }
    };

    const animate = (moves: Direction[]): void => {
        stopAnimation();
        let i = 0;
        animation = window.setInterval(() => {
            if (i >= moves.length) {
                stopAnimation();
                return;
            }
            puzzle.doAction(moves[i++]);
        }, 500);
    };

    solveButton.onclick = () => {
        const rules = new RulesManhattanDistance(size, goalFor(size));
        const start = new State(puzzle.getField());

        console.time('Time IDA*');
        const solution = new IDAStar(rules).search(start);
        console.timeEnd('Time IDA*');

        if (solution === null) {
            console.log('Solution not found');
            return;
        }
        animate(solutionToMoves(solution, size));
    };

    resetButton.onclick = () => {
        stopAnimation();
        puzzle.resetPuzzle();
    };

    const selectSize = (newSize: number): void => {
        stopAnimation();
        size = newSize;
        puzzle = new Puzzle(canvas, size);
    };
    radios[0]?.addEventListener('change', () => selectSize(3));
    radios[1]?.addEventListener('change', () => selectSize(4));
};
