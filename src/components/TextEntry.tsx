import { Matrix, typeOf } from 'mathjs';
import { useRef, useState } from 'react';
import { EditableMathField, MathField, StaticMathField } from 'react-mathquill';
import { ExpressionItem, GenericEntryProps } from '../utils/types';
import { getMatrixTex } from '../utils/utils';

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
    valueRender = typeOf(value) === 'Matrix'
      ? getMatrixTex(value as Matrix)
      : value?.toString();
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
          handlers: {
            deleteOutOf: (_, mathField) => {
              if (mathField.text()) onDeleteExpression(idx)
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
  // FIXME
  if (oldItem.isVariable &&
      (splitText.length === 1 || splitText[0].trim() === '')) {
    console.log(oldItem.expression);
    props.onDeleteVariable(oldItem.expression);
  }
  props.onExpressionChange(text, props.idx, false);
}

