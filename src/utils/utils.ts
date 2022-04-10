import { equal, evaluate, Matrix, sparse, typeOf } from 'mathjs';
import { MathFieldConfig } from 'react-mathquill';
import { ExpressionItem, Result, VariableMap } from './types';

/**
 * Returns a new empty expression object. Use this to create a copy of the
 * empty expression object, which avoids mutating a static instance.
 */
export function EMPTY_EXPRESSION(): ExpressionItem {
  return {
    expression: '',
    value: null,
    isVariable: false,
    text: '',
    isMatrix: false,
  };
}

export function expressionsAreEqual(e1: ExpressionItem, e2: ExpressionItem): boolean {
  if (e1.expression !== e2.expression) return false;
  if (e1.value === null || e2.value === null) {
    if (e1.value !== e2.value) return false;
  } else {
    const [type1, type2] = [typeOf(e1.value), typeOf(e2.value)];
    if (type1 !== type2) return false;
    if (type1 === 'Unit')
      if (!equal(e1.value, e2.value)) return false;
  }
  if (e1.text !== e2.text) return false;
  if (e1.isVariable !== e2.isVariable) return false;
  return true;
}

export const str = (o: any) => '' + o;

/**
 * Wrapper function for `math.evaluate()` that returns null iff the expression
 * couldn't be evaluated.
 * @param {string} expression Expression to be evaluated by `math.evaluate()`
 * @param {VariableMap} scope Map of variable names to values, used as `scope` arg
 * @returns Either a scalar or matrix if expression is valid, else null
 */
export function safeEvaluate(expression: string, scope: VariableMap): Result | null {
  if (!expression) return null;
  let val: Result | null = null;
  try {
    val = evaluate(expression, scope);
    if (typeOf(val) === 'Matrix') {
      if (containsNull(val)) return null;
    } else if (typeOf(val) !== 'number') {
      return null;
    }
  } catch (error) {
    return null;
  }
  return val;
}

/**
 * Check if any elements are null.
 * @param val The value in which to check for null elements.
 * @returns True iff val is array-like and contains any null elements.
 */
export function containsNull(val: any): boolean {
  let hasNull = false;
  if (isMatrix(val)) {
    (val as Matrix).forEach(x => hasNull = (x === null) || hasNull);
  } else if (Array.isArray(val)) {
    hasNull = val.some(r => Array.isArray(r) ? r.some(x => x === null) : r === null);
  }
  return hasNull;
}

export function matrixToString(m: Matrix | number[][] | number[]): string {
  if (isMatrix(m)) m = (m as Matrix).toArray();
  m = m as number[][] | number[];
  if (m.length === 0) return '[[]]';
  if (!Array.isArray(m[0])) m = [m as number[]]; // convert to 2D if needed
  m = m as number[][];
  return '[' 
    + m.map(row => `[${row.map(x => str(x)).join(',')}]`).join(',')
    + ']';
}

export function getMatrixTex(m: Matrix) {
  let res = '\\left[\\begin{array}';
  if (m.size().length === 1) {
    res += '{' + 'c'.repeat(m.size()[0]) + '}';
    res += m.toArray().map(x => str(x)).join('&')
  } else {
    res += '{' + 'c'.repeat(m.size()[1]) + '}';
    res += m.toArray().map(
      r => (r as number[]).map(x => str(x)).join('&')
    ).join('\\\\');
  }
  res += '\\end{array}\\right]';
  return res;
}

export const defaultMathFieldConfig: MathFieldConfig = {
  charsThatBreakOutOfSupSub: "+-",
  autoCommands: 'sqrt',
};

export function isMatrix(val: any): boolean {
  return typeOf(val) === 'Matrix';
}

// Default when creating new matrix
export const FALLBACK_MATRIX = () => sparse([[0,0],[0,0]]);
