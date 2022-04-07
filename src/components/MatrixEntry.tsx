import { EditableMathField, StaticMathField } from 'react-mathquill';
import { EntryProps } from '../utils/types';
import MatrixEditor from './MatrixEditor';

interface MatrixEntryProps extends EntryProps {

}

export function MatrixEntry(props: MatrixEntryProps) {
  const { variableMap } = props;
  const valueRender = '';
  return (
    <div className='matrix-entry'>
      <EditableMathField />
      <StaticMathField>{'='}</StaticMathField>
      <MatrixEditor
        variableMap={variableMap}
      />
      <StaticMathField>{valueRender}</StaticMathField>
    </div>
  );
}
