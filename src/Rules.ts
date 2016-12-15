import State from './State'

export default class Rules {
    protected size: number;
    protected arraySize: number;

    protected terminateState: Array<number>;

    private left = -1;
    private top;
    private right = 1;
    private bottom;
    protected actions: Array<number>;

    constructor(size: number, terminateState: Array<number>) {
        if (size < 2)
            throw Error("Invalid field size.");

        if (terminateState == null)
            throw Error("Terminate state can't be null");

        this.size = size;
        this.arraySize = size * size;

        if(terminateState.length != this.arraySize)
            throw Error("Size of terminate state is incorrect.");

        this.terminateState = terminateState;

        this.top = -size;
        this.bottom = size;

        this.actions = [this.top, this.bottom, this.left, this.right];
    }

    public getNeighbors(currentState: State): Array<State> {
        let result: Array<State> = [];

        for(let action of this.actions) {
            let field: Array<number> = this.doAction(currentState.getField(), action);
            if (field == null){
                continue;
            }

            let state:State = new State(currentState, this.size);
            state.setField(field);
            result.push(state);
        }

        return result;
    }

    public doAction(field: Array<number>, action: number): Array<number> {
        let indexZero:number;
        for(indexZero = 0; indexZero < field.length; indexZero++){
            if(field[indexZero] == 0){
                break;
            }

            if(indexZero >= field.length){
                return null;
            }
        }

        let indexTransferPuzz: number = indexZero + action;

        if(indexTransferPuzz < 0 || indexTransferPuzz >= field.length){
            return null;
        }

        if((action == 1) && ((indexZero + 1) % this.size == 0)){
            return null;
        }

        if((action == -1) && ((indexZero + 1) % this.size == 1)){
            return null;
        }

        let newField: Array<number> = [...field];
        let temp: number = newField[indexZero];
        newField[indexZero] = newField[indexTransferPuzz];
        newField[indexTransferPuzz] = temp;

        return newField;
    }

    public getDistance(a: State, b: State): number {
        let temp: State = b;
        let result: number = 0;

        while((temp != null) && (!temp.equals(a))){
            temp = temp.getParent();
            result++;
        }
        return result;
    }

    public getH(state: State): number {
        let result: number = 0;

        for(let i = 0; i < this.arraySize; i++) {
            if (state.getField()[i] != this.terminateState[i])
                result++;
        }

        return result;
    }

    public isTerminate(state: State): boolean {
        return JSON.stringify(state.getField()) == JSON.stringify(this.terminateState);
    }

    public getTerminateState(): Array<number> {
        return this.terminateState;
    }

    public getActions(): Array<number> {
        return this.actions;
    }
}