import Rules from './Rules'
import State from './State'

export default class RulesManhattanDistance extends Rules {
    constructor(size: number, terminateState: Array<number>) {
        super(size, terminateState)
    }

    public getH(state: State): number {
        let result: number = 0;
        let currentLine: number = 0;
        let currPos: [number, number];
        let goalPos: [number, number];

        for (let i = 0; i < this.arraySize; i++) {
            currentLine = Math.ceil((i + 1) / this.size);

            if (state.getField()[i] != this.terminateState[i]) {
                currPos = [currentLine, (i + 1) - (currentLine - 1) * this.size];
                let indexInTerminate: number = this.terminateState.indexOf(state.getField()[i]) + 1;
                goalPos = [Math.ceil(indexInTerminate / this.size), indexInTerminate - (Math.ceil(indexInTerminate / this.size) - 1) * this.size];

                result += Math.abs(currPos[0] - goalPos[0]) + Math.abs(currPos[1] - goalPos[1]);
            }
        }

        return result;
    }
}