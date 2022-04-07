import { EditableMathField, StaticMathField } from 'react-mathquill';
import { EntryProps } from '../utils/types';

interface TextEntryProps extends EntryProps {
  
}

export function TextEntry(props: TextEntryProps) {
  const valueRender = '';
  return (
    <div className='text-entry'>
      <EditableMathField />
      <StaticMathField></StaticMathField>
    </div>
  );
}
