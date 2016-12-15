import Rules from './Rules'
import State from './State'

export default class Astar {
    private rules: Rules;
    private closedState: number = 0;

    constructor(rules: Rules){
        this.rules = rules;
    }

    public search(startState: State){
        let close: Array<string> = [];
        let open: Array<State> = [];

        open.push(startState);
        startState.setG(0);
        startState.setH(this.rules.getH(startState));
        let count = 0;

        while (open.length > 0) {
            /*if (count == 100)
                return null;
            count++;

            for (let i of open) {
                let s = "";
                let g = 0;
                for(let j = 0; j < 4; j++) {
                    for (let k = 0; k < 4; k++) {
                        s += i.getField()[g++].toString() + " "
                    }
                    s += "\n"
                }
                console.log(s);
                console.log(i.getF());
                console.log("--------------------------------------------------------------------------")
            }
            console.log("----------------------EEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDD-----------------")*/
            let x: State = this.getStateWithMinF(open);
            if (this.rules.isTerminate(x)) {
                this.closedState = close.length;
                return this.completeSolution(x);
            }

            //console.log(open.length, close.length);

            //console.time("Search hash");

            let removeIndex: number = open.map(item => item.hashCode() )
                .indexOf(x.hashCode());
            open.splice(removeIndex, 1); //must test
            //console.timeEnd("Search hash");

            close.push(x.hashCode());
            let neighbors: Array<State> = this.rules.getNeighbors(x);

            for (let neighbor of neighbors) {
                if (close.indexOf(neighbor.hashCode()) > -1) {
                    continue;
                }

                let g: number = x.getG() + this.rules.getDistance(x, neighbor);
                let isGBetter: boolean;

                //console.time("Consist neigh");
                let isContainNeighbor: number = open.map(item => item.hashCode())
                    .indexOf(neighbor.hashCode());
                //console.timeEnd("Consist neigh");

                if (isContainNeighbor == -1){
                    neighbor.setH(this.rules.getH(neighbor));
                    open.push(neighbor);
                    isGBetter = true;
                } else {
                    isGBetter = g < neighbor.getG();
                }

                if (isGBetter) {
                    neighbor.setParent(x);
                    neighbor.setG(g)
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
        //console.time("Time MinF");
        for(let state of open) {
            if(state.getF() < min) {
                min = state.getF();
                result = state;
            }
        }
        //console.timeEnd("Time MinF");
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