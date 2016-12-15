import Rules from '../Rules'
import State from '../State'

export default class IDAstar {
    private rules: Rules;
    private closedState: number = 0;

    constructor(rules: Rules){
        this.rules = rules;
    }

    public search(startState: State) {
        startState.setG(0);
        startState.setH(this.rules.getH(startState));
        let nextCostBound: number = this.rules.getH(startState);
        let solution: State = null;

        while (solution == null) {
            let currentCostBound: number = nextCostBound;
            solution = this.depthFirstSearch(startState, currentCostBound);
            nextCostBound += 2;
        }

        return this.completeSolution(solution);
    }

    private depthFirstSearch(current: State, currentCostBound): State {
        if (this.rules.isTerminate(current)) {
            return current;
        }

        let children: Array<State> = this.rules.getNeighbors(current);

        for (let next of children) {
            next.setH(this.rules.getH(next));
            next.setG(current.getG() + 1);
            let value: number = next.getH() + next.getG();

            if (value <= currentCostBound) {
                let result: State = this.depthFirstSearch(next, currentCostBound);

                if (result != null) {
                    return result;
                }
            }
        }
        return null;
    }

    public getClosedStatesCount(): number {
        return this.closedState;
    }

    private getStateWithMinF(open: Array<State>): State {
        let result: State = null;
        let min: number = Number.MAX_VALUE;
        for(let state of open) {
            if(state.getF() < min) {
                min = state.getF();
                result = state;
            }
        }

        return result;
    }

    private completeSolution(terminate: State) {
        let path: Array<State> = [];
        let temp: State = terminate;
        while (temp != null) {
            path.unshift(temp);
            temp = temp.getParent();
        }

        return path;
    }
}