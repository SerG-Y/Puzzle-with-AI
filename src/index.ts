import Astar from './Astar'
import State from './State'
import IDAStar from './IDAStar/IDAStar'
import Rules from './Rules'
import RulesPenalty from './RulesPenalty'
import RulesManhattanDistance from './RulesManhattanDistance'
import Puzzle from './Puzzle'

// const startField: Array<number> = [2,6,4,8,1,13,7,3,5,11,12,15,0,10,9,14];
let terminateField: Array<number> = [1,2,3,4,5,6,7,8,0];
const startField: Array<number> = [11,10,6,2,13,7,4,0,9,14,15,5,1,12,8,3];
/*const startField: Array<number> = [1,0,2,3,5,6,7,4,9,10,11,8,13,14,15,12];
*/
/*const terminateField: Array<number> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];*/
let puzzle: Puzzle;
window.onload = () => {





    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("puzzle");
    puzzle = new Puzzle(canvas, 3);
    let solveButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("solve");
    let resetButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("reset");

    let size: number = 3;
    let actions: Array<string> = [];

    /*let arraySize = size * size;*/
    let interval: number;
    solveButton.onclick = e => {
        let rules: RulesManhattanDistance = new RulesManhattanDistance(size, terminateField);
        let startState: State = new State(null, size);
        //console.log(puzzle.getField());
        startState.setField(puzzle.getField()/*startField*/);
        console.time("Time A-Star");
        let astar: Astar = new Astar(rules);
        let result: Array<State> = astar.search(startState);
        console.timeEnd("Time A-Star");

        if (result == null)
            console.log("Solution not found");
        else
            console.log(result);

        actions = [];
        iter = 0;
        for (let i = 0; i < result.length - 1; i++) {
            actions.push(getAction(result[i].getField(), result[i + 1].getField(), size))
        }

        interval = setInterval(doAction, 500);

    };

    resetButton.onclick = e => {
        puzzle.resetPuzzle();
    };

    let radioButton: NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>> document.querySelectorAll("input[name=group1]");
    radioButton[0].onchange = e => {
        size = 3;
        terminateField = [1,2,3,4,5,6,7,8,0];
        puzzle = new Puzzle(canvas, 3);
    };

    radioButton[1].onchange = e => {
        size = 4;
        terminateField = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
        puzzle = new Puzzle(canvas, 4);

    };
    let iter;
    function doAction(): void {
        if (iter == actions.length) {
            clearInterval(interval);
            return;
        }

        puzzle.doAction(actions[iter++]);


    }

    function getNullPos(field: Array<number>, size: number): {x: number, y: number} {
        let currIndex: number;

        for (let i = 0; i < field.length; i++) {
            if (field[i] == 0) {
                currIndex = i + 1;
                break;
            }
        }

        let currLine: number = Math.ceil(currIndex / size) - 1;
        let currCol: number = currIndex - (currLine * size);

        return {x: currLine, y: currCol};
    }

    function getAction(a: Array<number>, b: Array<number>, size: number): string {
        let coordsA: {x: number, y: number} = getNullPos(a, size);
        let coordsB: {x: number, y: number} = getNullPos(b, size);

        let action: string = (coordsA.x - coordsB.x) > 0 ? 'Top' : (coordsA.x - coordsB.x) < 0 ? 'Bottom' : null;

        if(action == null)
            action = (coordsA.y - coordsB.y) < 0 ? 'Right' : (coordsA.y - coordsB.y) > 0 ? 'Left' : null;

        return action;
    }
};
