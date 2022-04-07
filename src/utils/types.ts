import { Matrix } from 'mathjs';

export type Result = number | Matrix;
export type VariableMap = Map<string, Result | null>;

export interface ExpressionItem {
  expression: string;
  value: Result | null;
  isVariable: boolean;
  text: string;
  isMatrixEntry?: boolean;
}

/** Common props needed by all entry types. */
export interface EntryProps {
  variableMap: VariableMap;
  onEnterNewExpression: () => void;
  onDeleteVariable: (deleteVar: string) => void;
  onDeleteExpression: () => void;
}

export default {};
