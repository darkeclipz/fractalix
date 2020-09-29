export interface Formula {
    uniforms: any;
    build(): string;
}

export class FloatRange {
    constructor(public min: number, public max: number, public step: number) { }
}

export class IntegerRange {
    step = 1;
    constructor(public min: number, public max: number) { }
}