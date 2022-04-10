import './TextEntry.scss';
import { Matrix } from 'mathjs';
import { useRef, useState } from 'react';
import { EditableMathField, MathField, StaticMathField } from 'react-mathquill';
import { ExpressionItem, GenericEntryProps } from '../../utils/types';
import { defaultMathFieldConfig, getMatrixTex, isMatrix, str } from '../../utils/utils';

interface TextEntryProps extends GenericEntryProps {
  
}

/**
 * Entry with single-line text expressions and variable definitions.
 * @param props 
 */
export function TextEntry(props: TextEntryProps) {
  const { idx, expressionItem,
          onEnterNewExpression, onDeleteExpression } = props;
  const { value } = expressionItem;

  const mf = useRef<MathField>();
  const [currTex, setCurrTex] = useState('');

  let valueRender = '[null]';
  if (value !== null) {
    valueRender = isMatrix(value)
      ? getMatrixTex(value as Matrix)
      : str(value);
  }

  const onChangeCb = function(mathField: MathField) {
    onChange(expressionItem, mathField, setCurrTex, props);
  }

  return (
    <div className='entry text-entry'>
      <EditableMathField
        latex={currTex}
        onChange={onChangeCb}
        mathquillDidMount={mathField => mf.current = mathField}
        config={{
          ...defaultMathFieldConfig,
          handlers: {
            deleteOutOf: (_, mathField) => {
              if (!mathField.text()) onDeleteExpression(idx)
            },
            enter: () => onEnterNewExpression(idx)
          }
        }}
      />
      <StaticMathField>{valueRender}</StaticMathField>
    </div>
  );
}

function onChange(oldItem: ExpressionItem, mathField: MathField,
                  setCurrTex: (s: string) => void, props: TextEntryProps) {
  setCurrTex(mathField.latex());
  const text = mathField.text();
  const splitText = text.split('=');
  // if item goes from var assignment to not var assignment, delete var
  if (oldItem.isVariable &&
      (splitText.length === 1 || splitText[0].trim() === '')) {
    props.onDeleteVariable(oldItem.expression);
  }
  props.onExpressionChange(text, props.idx);
}

