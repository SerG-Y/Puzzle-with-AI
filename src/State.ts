export default class State {
    private field: Array<number>;
    private hash: string;
    private g: number;
    private h: number;
    private parent: State;
    private size: number;

    constructor(parent: State, size: number){
        this.parent = parent;
        this.size = size;
    }

    public getField(): Array<number> {
        return this.field;
    }

    public setField(field: Array<number>): void {
        this.field = field;
        this.hash = this.getHashCode();
    }

    public equals(obj: Object): boolean {
        if (obj == null || !(obj instanceof State))
            return false;

        return this.hash == obj.hashCode();
    }

    public hashCode(): string {
        return this.hash;
    }

    public getF(): number {
        return this.g + this.h;
    }

    public getG(): number {
        return this.g;
    }

    public setG(g: number): void {
        this.g = g;
    }

    public getH(): number {
        return this.h;
    }

    public setH(h: number): void {
        this.h = h;
    }

    public getParent(): State {
        return this.parent;
    }

    public setParent(parent: State): void {
        this.parent = parent;
    }

    private getHashCode(): string {
        if (this.field == null)
            return "0";

        return this.field.join("");
    }
}