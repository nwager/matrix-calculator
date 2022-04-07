import { equal, evaluate, Matrix, typeOf } from 'mathjs';
import { ExpressionItem, Result, VariableMap } from './types';

/**
 * Returns a new empty expression object. Use this to create a copy of the
 * empty expression object, which avoids mutating a static instance.
 */
export function EMPTY_EXPRESSION(): ExpressionItem {
  return Object.assign({
    expression: '',
    value: null,
    isVariable: false,
    text: '',
  }) as ExpressionItem;
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
    const valType = typeOf(val);
    if (valType === 'Matrix') {
      let containsNull = false;
      (val as Matrix).forEach(x => containsNull = x === null);
      if (containsNull) return null;
    } else if (valType !== 'number') {
      return null;
    }
  } catch (error) {
    // console.error(error);
    return null;
  }
  return val;
}

export function matrixToString(m: Matrix | number[][] | number[]): string {
  if (typeOf(m) === 'Matrix') m = (m as Matrix).toArray();
  m = m as number[][] | number[];
  if (m.length === 0) return '[[]]';
  if (!Array.isArray(m[0])) m = [m as number[]]; // convert to 2D if needed
  m = m as number[][];
  return '[' 
    + m.map(row => `[${row.map(x => x.toString()).join(',')}]`).join(',')
    + ']';
}

export function getMatrixTex(m: Matrix) {
  let res = '\\left[\\begin{array}';
  if (m.size().length === 1) {
    res += '{' + 'c'.repeat(m.size()[0]) + '}';
    res += m.toArray().map(x => x.toString()).join('&')
  } else {
    res += '{' + 'c'.repeat(m.size()[1]) + '}';
    res += m.toArray().map(
      r => (r as number[]).map(x => x.toString()).join('&')
    ).join('\\\\');
  }
  res += '\\end{array}\\right]';
  return res;
}
