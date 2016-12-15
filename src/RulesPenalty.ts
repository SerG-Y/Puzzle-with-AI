import Rules from './Rules'
import State from './State'

export default class RulesPenalty extends Rules {
    constructor(size: number, terminateState: Array<number>) {
        super(size, terminateState)
    }

    public getH(state: State): number {
        let result: number = 0;
        let penalty: number = this.size;

        for (let i = 0; i < this.arraySize; i++) {
            if ((i + 1) % this.size == 0)
                penalty--;

            if (state.getField()[i] != this.terminateState[i])
                result += penalty;
        }

        return result;
    }
}