import './MatrixEntry.scss';
import { EditableMathField, StaticMathField } from 'react-mathquill';
import { GenericEntryProps } from '../../utils/types';
import MatrixEditor from '../MatrixEditor';
import { defaultMathFieldConfig, matrixToString } from '../../utils/utils';
import { Matrix } from 'mathjs';
import MatrixRenderer from '../MatrixRenderer';

interface MatrixEntryProps extends GenericEntryProps {

}

/**
 * Matrix variable definition with a matrix editor.
 * @param props 
 */
export function MatrixEntry(props: MatrixEntryProps) {
  const { idx, variableMap, expressionItem, onExpressionChange } = props;
  const value = expressionItem.value as Matrix | null;
  const valueRender = value
    ? <MatrixRenderer matrix={value} />
    : <StaticMathField>{'[null]'}</StaticMathField>;
  
  return (
    <div className='entry matrix-entry'>
      <EditableMathField
        latex={expressionItem.expression}
        config={defaultMathFieldConfig}
      />
      <StaticMathField>{'='}</StaticMathField>
      <MatrixEditor
        variableMap={variableMap}
        onChange={(matrix) => onExpressionChange(
            expressionItem.expression + '=' + (matrix ? matrixToString(matrix) : 'null'),
            idx
          )
        }
      />
      {valueRender}
    </div>
  );
}
