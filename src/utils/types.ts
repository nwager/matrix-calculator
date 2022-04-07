import { Matrix } from 'mathjs';

export type Result = number | Matrix;
export type VariableMap = Map<string, Result | null>;

/**
 * A representation of one calculator entry. Holds the expression OR
 * variable name, the value of the expression/variable, the raw text,
 * and flags for whether it is a variable and/or matrix.
 */
export interface ExpressionItem {
  expression: string;
  value: Result | null;
  isVariable: boolean;
  text: string;
  isMatrixEntry?: boolean;
}

/** Common props needed by all entry types. */
export interface GenericEntryProps {
  idx: number;
  variableMap: VariableMap;
  expressionItem: ExpressionItem;
  isFocused: boolean;
  setFocus: (idx: number) => void;
  onExpressionChange: (text: string, idx: number,
                       isMatrixEntry?: boolean) => void;
  onEnterNewExpression: (idx: number) => void;
  onDeleteVariable: (deleteVar: string) => void;
  onDeleteExpression: (idx: number) => void;
}

export default {};
