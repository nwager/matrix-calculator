import { useState } from 'react';
import './MatrixEditor.scss';
import { EditableMathField, MathField } from 'react-mathquill';
import { evaluate, Matrix, sparse } from 'mathjs';
import { VariableMap } from '../utils/types';

interface MatrixEditorProps {
  variableMap: VariableMap;
  updateValue?: (m: Matrix) => void;
  defaultMatrix?: Matrix;
}

interface MatrixState {
  value: Matrix;
  latex: string[][];
}

export const FALLBACK_MATRIX = sparse([[0,0],[0,0]]);
function matrixToStrArray(m: Matrix): string[][] {
  return (m.toArray() as number[][]).map(row => row.map(elt => elt.toString()));
}

export default function MatrixEditor(props: MatrixEditorProps) {
  const { variableMap, updateValue, defaultMatrix } = props;
  const startingMatrix = defaultMatrix ? defaultMatrix : FALLBACK_MATRIX;
  const [matrixState, setMatrixState] = useState<MatrixState>({
    value: startingMatrix,
    latex: matrixToStrArray(startingMatrix),
  });
  return (
    <div className='matrix-container'>
      <table className='matrix-table'>
        <tbody>
          {renderRows(matrixState, setMatrixState, variableMap, updateValue)}
        </tbody>
      </table>
      <div className='bracket left-bracket' />
      <div className='bracket right-bracket' />
    </div>
  );
}

/**
 * Called when a field of the matrix is changed. Updates that element in matrix state.
 * @param row Row of element to update.
 * @param col Column of element to update.
 * @param matrixState The current matrix value and latex strings.
 * @param setMatrixState Callback function to set the new matrix state.
 * @param scope The current variables held by the calculator.
 * @param updateValue Callback to update the parent matrix value.
 */
function onMatrixChange(row: number,
                        col: number,
                        matrixState: MatrixState,
                        setMatrixState: (matrixState: MatrixState) => void,
                        scope: VariableMap,
                        updateValue?: (m: Matrix) => void): ((mathField: MathField) => void) {
  return (mathField: MathField) => {
    const { value, latex } = matrixState;
    value.set([row, col], evaluate(mathField.text(), scope));
    latex[row][col] = mathField.latex();
    updateValue?.(value);
    setMatrixState({ value, latex });
  };
}

/**
 * Renders a 2x2 table of editable math fields to represent a matrix.
 * @param matrixState The current matrix value and latex strings.
 * @param setMatrixState Callback function to set the new matrix state.
 * @param scope The current variables held by the calculator.
 * @param updateValue Callback to update the parent matrix value.
 */
function renderRows(matrixState: MatrixState,
                    setMatrixState: (matrixState: MatrixState) => void,
                    scope: VariableMap,
                    updateValue?: (m: Matrix) => void) {
  return (matrixState.value.toArray() as number[][]).map((r, i) => {
    return <tr key={i}>{r.map((_c, j) => {
      return <td key={j}>
        <EditableMathField
          latex={matrixState.latex[i][j]}
          onChange={onMatrixChange(i, j, matrixState, setMatrixState, scope, updateValue)}
        />
      </td>
    })}</tr>
  });
}
