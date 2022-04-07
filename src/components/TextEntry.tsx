import { EditableMathField, StaticMathField } from 'react-mathquill';
import { GenericEntryProps } from '../utils/types';

interface TextEntryProps extends GenericEntryProps {
  
}

/**
 * Entry with single-line text expressions and variable definitions.
 * @param props 
 */
export function TextEntry(props: TextEntryProps) {
  const valueRender = '';
  return (
    <div className='text-entry'>
      <EditableMathField />
      <StaticMathField>{valueRender}</StaticMathField>
    </div>
  );
}
