export type Direction = 'Top' | 'Bottom' | 'Left' | 'Right';

interface Cell {
    row: number;
    col: number;
}

/** For each move, the neighbour of the blank that slides into it. */
const SLIDE: Record<Direction, Cell> = {
    Top: { row: -1, col: 0 },
    Bottom: { row: 1, col: 0 },
    Left: { row: 0, col: -1 },
    Right: { row: 0, col: 1 },
};

const CANVAS_SIZE = 530;
const SHUFFLE_MOVES = 50;

/** Renders the sliding puzzle on a canvas and handles user moves. */
export default class Puzzle {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly cellSize: number;
    private readonly goal: number[][];
    private board: number[][];
    private clicks = 0;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly size: number,
    ) {
        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('Could not get a 2D context for the puzzle canvas.');
        }
        this.ctx = ctx;

        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        this.cellSize = CANVAS_SIZE / size;

        this.goal = Puzzle.solvedBoard(size);
        this.board = Puzzle.solvedBoard(size);

        this.shuffle();
        this.render();

        canvas.onclick = (e) => this.onPointer(e.pageX, e.pageY);
        canvas.ontouchend = (e) => {
            const touch = e.changedTouches[0];
            if (touch) {
                this.onPointer(touch.pageX, touch.pageY);
            }
        };
    }

    /** The board flattened row-major, as the solver expects it. */
    public getField(): number[] {
        return this.board.flat();
    }

    /** Slide a tile in the given direction (used to animate a solution). */
    public doAction(direction: Direction): void {
        const blank = this.blank();
        const delta = SLIDE[direction];
        this.move({ row: blank.row + delta.row, col: blank.col + delta.col });
        this.render();
    }

    public resetPuzzle(): void {
        this.shuffle();
        this.render();
    }

    private static solvedBoard(size: number): number[][] {
        const total = size * size;
        const board: number[][] = [];
        for (let row = 0; row < size; row++) {
            const cells: number[] = [];
            for (let col = 0; col < size; col++) {
                // 1, 2, ... total - 1, then 0 (the blank) in the last cell.
                cells.push((row * size + col + 1) % total);
            }
            board.push(cells);
        }
        return board;
    }

    private blank(): Cell {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    return { row, col };
                }
            }
        }
        throw new Error('Board has no blank cell.');
    }

    private inBounds(cell: Cell): boolean {
        return cell.row >= 0 && cell.row < this.size && cell.col >= 0 && cell.col < this.size;
    }

    /** Swap the tile at `cell` into the blank, if they are adjacent. */
    private move(cell: Cell): boolean {
        if (!this.inBounds(cell)) {
            return false;
        }
        const blank = this.blank();
        const adjacent = Math.abs(cell.row - blank.row) + Math.abs(cell.col - blank.col) === 1;
        if (!adjacent) {
            return false;
        }
        this.board[blank.row][blank.col] = this.board[cell.row][cell.col];
        this.board[cell.row][cell.col] = 0;
        this.clicks++;
        return true;
    }

    private shuffle(): void {
        for (let i = 0; i < SHUFFLE_MOVES; i++) {
            const blank = this.blank();
            const candidates = (Object.keys(SLIDE) as Direction[])
                .map((dir) => ({ row: blank.row + SLIDE[dir].row, col: blank.col + SLIDE[dir].col }))
                .filter((cell) => this.inBounds(cell));
            this.move(candidates[Math.floor(Math.random() * candidates.length)]);
        }
        this.clicks = 0;
    }

    private isWin(): boolean {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] !== this.goal[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    private onPointer(pageX: number, pageY: number): void {
        const col = Math.floor((pageX - this.canvas.offsetLeft) / this.cellSize);
        const row = Math.floor((pageY - this.canvas.offsetTop) / this.cellSize);
        if (this.move({ row, col })) {
            this.render();
            if (this.isWin()) {
                console.log(`You win for ${this.clicks} clicks`);
            }
        }
    }

    private render(): void {
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = this.board[row][col];
                if (value > 0) {
                    this.drawTile(value, row, col);
                }
            }
        }
    }

    private drawTile(value: number, row: number, col: number): void {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const ctx = this.ctx;

        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.117647)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);

        ctx.font = `${this.cellSize / 4}px Roboto`;
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#222';
        ctx.fillText(String(value), x + this.cellSize / 2, y + this.cellSize / 2);
    }
}
