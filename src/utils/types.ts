import { Matrix } from 'mathjs';

export type Result = number | Matrix;
export type VariableMap = Map<string, Result | null>;

export interface ExpressionItem {
  expression: string;
  value: Result | null;
  isVariable: boolean;
  text: string;
}

export default {};