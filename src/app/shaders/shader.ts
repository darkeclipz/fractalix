import { Formula } from './formulas/formula';

export interface Shader {
    fragmentShader: string;
    build(formula: Formula): string;
}