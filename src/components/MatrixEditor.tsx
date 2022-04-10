import { useState } from 'react';
import './MatrixEditor.scss';
import { EditableMathField, MathField } from 'react-mathquill';
import { Matrix } from 'mathjs';
import { VariableMap } from '../utils/types';
import { defaultMathFieldConfig, FALLBACK_MATRIX, safeEvaluate, str } from '../utils/utils';

interface MatrixEditorProps {
  variableMap: VariableMap;
  onChange?: (m: Matrix | null) => void;
  defaultMatrix?: Matrix;
}

interface MatrixState {
  value: Matrix;
  latex: string[][];
  nullElts: boolean[][];
}

function matrixToStrArray(m: Matrix): string[][] {
  return (m.toArray() as number[][]).map(row => row.map(elt => str(elt)));
}

export default function MatrixEditor(props: MatrixEditorProps) {
  const { variableMap, onChange, defaultMatrix } = props;
  const startingMatrix = defaultMatrix ? defaultMatrix : FALLBACK_MATRIX();
  const strArray = matrixToStrArray(startingMatrix);
  const [matrixState, setMatrixState] = useState<MatrixState>({
    value: startingMatrix,
    latex: strArray,
    nullElts: strArray.map(r => r.map(() => false)),
  });
  return (
    <div className='matrix-editor-container'>
      <table className='matrix-table'>
        <tbody>
          {renderRows(matrixState, setMatrixState, variableMap, onChange)}
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
                        onChange?: (m: Matrix | null) => void): ((mathField: MathField) => void) {
  return (mathField: MathField) => {
    const { value, latex, nullElts } = matrixState;
    const newValue = safeEvaluate(mathField.text(), scope);

    nullElts[row][col] = newValue === null;
    value.set([row, col], newValue === null ? 0 : newValue);
    latex[row][col] = mathField.latex();

    const hasNull = nullElts.some(r => r.some(x => x))
    onChange?.(hasNull ? null : value);
  
    setMatrixState({ value, latex, nullElts });
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
                    onChange?: (m: Matrix | null) => void) {
  return (matrixState.value.toArray() as number[][]).map((r, i) => {
    return <tr key={i}>{r.map((_c, j) => {
      return <td key={j}>
        <EditableMathField
          latex={matrixState.latex[i][j]}
          onChange={onMatrixChange(i, j, matrixState, setMatrixState, scope, onChange)}
          config={defaultMathFieldConfig}
        />
      </td>
    })}</tr>
  });
}
