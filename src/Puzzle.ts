export default class Puzzle {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private puzzle: Array<Array<number>> = [[1,2,3], [4,5,6], [7,8,0]];
    private terminateState: Array<Array<number>> = [[1,2,3], [4,5,6], [7,8,0]];
    private clicks: number = 0;
    private countMix: number = 50;
    private puzzleSize: number;
    private size: number;

    constructor(canvas: HTMLCanvasElement, size: number) {
        canvas.width  = 530;
        canvas.height = 530;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;

        if (size == 3) {
            this.puzzle = [[1,2,3], [4,5,6], [7,8,0]];
            this.terminateState = [[1,2,3], [4,5,6], [7,8,0]];
        } else if (size == 4) {
            this.puzzle = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
            this.terminateState = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
        }

        this.puzzleSize = canvas.width / size;

        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.mix(this.countMix);
        this.draw();

        canvas.onclick = e => {
            let x = (e.pageX - canvas.offsetLeft) / this.puzzleSize | 0;
            let y = (e.pageY - canvas.offsetTop)  / this.puzzleSize | 0;
            this.processEvent(x, y);
        };

        canvas.ontouchend = e => {
            let x = (e.touches[0].pageX - canvas.offsetLeft) / this.puzzleSize | 0;
            let y = (e.touches[0].pageY - canvas.offsetTop)  / this.puzzleSize | 0;
            this.processEvent(x, y);
        };
    }

    public getField(): Array<number> {
        let result: Array<number> = [];

        for (let row of this.puzzle)
            for(let el of row)
                result.push(el)

        return result;
    }

    public setPuzzleView(x: number, y:number): void {
        this.ctx.fillStyle = "#fff";
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.117647)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillRect(x + 1, y + 1, this.puzzleSize - 2, this.puzzleSize - 2);
    }

    public setFontPuzzle(): void {
        this.ctx.font = (this.puzzleSize / 4) +"px Roboto";
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#222";
    }

    public getClicks(): number {
        return this.clicks;
    }

    public doAction(action: string): void {
        switch (action) {
            case 'Top': {
                let coords: {x: number, y: number};
                let nullCoords: {x: number, y: number} = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x,
                    y: nullCoords.y - 1
                };

                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();

                break;
            }
            case 'Bottom': {
                let coords: {x: number, y: number};
                let nullCoords: {x: number, y: number} = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x,
                    y: nullCoords.y + 1
                };

                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();

                break;
            }
            case 'Right': {
                let coords: {x: number, y: number};
                let nullCoords: {x: number, y: number} = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x + 1,
                    y: nullCoords.y
                };

                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();

                break;
            }
            case 'Left': {
                let coords: {x: number, y: number};
                let nullCoords: {x: number, y: number} = this.getNullPuzzle();
                coords = {
                    x: nullCoords.x - 1,
                    y: nullCoords.y
                };

                this.move(coords.x, coords.y);
                this.ctx.fillStyle = "#fafafa";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();

                break;
            }

        }
    }

    public resetPuzzle(): void {
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.mix(this.countMix);
        this.draw();
    }

    private getNullPuzzle(): {x: number, y: number} {
        for (let i = 0; i < this.puzzle.length; i++) {
            for (let j = 0; j < this.puzzle[0].length; j++)
                if (this.puzzle[i][j] === 0)
                    return {x: j, y: i}
        }
    }

    private isWin(): boolean {
        for (let i = 0; i < this.puzzle.length; i++) {
            for (let j = 0; j < this.puzzle[0].length; j++)
                if (this.puzzle[i][j] != this.terminateState[i][j])
                    return false;
        }

        return true;
    }

    private processEvent(x: number, y: number): void {
        this.move(x, y);
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        if (this.isWin()) { // если головоломка сложена, то пятнашки заново перемешиваются
            console.log(`You win for ${this.clicks} clicks`);
            /*field.mix(300);
            context.fillStyle = "#222";
            context.fillRect(0, 0, canvas.width, canvas.height);
            field.draw(context, cellSize);*/
        }
    }

    private move(x: number, y: number): void {
        let nullCoords: {x: number, y: number} = this.getNullPuzzle();

        if (((x - 1 == nullCoords.x || x + 1 == nullCoords.x) && y == nullCoords.y) ||
            ((y - 1 == nullCoords.y || y + 1 == nullCoords.y) && x == nullCoords.x)) {
            this.puzzle[nullCoords.y][nullCoords.x] = this.puzzle[y][x];
            this.puzzle[y][x] = 0;
            this.clicks++;
        }
    }

    private draw(): void {
        for (let i = 0; i < this.puzzle.length; i++) {
            for (let j = 0; j < this.puzzle[0].length; j++) {
                if (this.puzzle[i][j] > 0) {
                    if (this.setPuzzleView !== null)
                        this.setPuzzleView(j * this.puzzleSize, i * this.puzzleSize);

                    if (this.setFontPuzzle !== null) {
                        this.setFontPuzzle();
                        this.ctx.fillText(this.puzzle[i][j].toString(), j * this.puzzleSize + this.puzzleSize / 2,
                            i * this.puzzleSize + this.puzzleSize / 2);
                    }
                }
            }
        }
    }

    private mix(stepCount: number): void {
        for (let i = 0; i < stepCount; i++) {
            let coords: {x: number, y: number} = {x: null, y: null};
            let nullCoords: {x: number, y: number} = this.getNullPuzzle();
            let hMove = Math.random() >= 0.5;
            let upLeft = Math.random() >= 0.5;

            if (!hMove && !upLeft) {
                coords.y = nullCoords.y;
                coords.x = nullCoords.x - 1;
            }

            if (hMove && !upLeft) {
                coords.x = nullCoords.x;
                coords.y = nullCoords.y + 1;
            }

            if (!hMove && upLeft) {
                coords.y = nullCoords.y;
                coords.x = nullCoords.x + 1;
            }
            if (hMove && upLeft) {
                coords.x = nullCoords.x;
                coords.y = nullCoords.y - 1;
            }
            if (0 <= coords.x && coords.x <= (this.size - 1) && 0 <= coords.y && coords.y <= (this.size - 1)) {
                this.move(coords.x, coords.y);
            }
        }

        this.clicks = 0;
    };
}