import { GenericEntryProps } from '../utils/types';
import { MatrixEntry } from './MatrixEntry';
import { TextEntry } from './TextEntry';

interface EntryProps extends GenericEntryProps {

}

/**
 * Wrapper entry to abstract away different types of entries.
 * @param props
 */
export default function Entry(props: EntryProps) {
  const { idx,
          variableMap,
          expressionItem,
          isFocused,
          setFocus,
          onExpressionChange,
          onEnterNewExpression,
          onDeleteExpression,
          onDeleteVariable } = props;
  return (
    expressionItem.isMatrixEntry ?
    <MatrixEntry
      idx={idx}
      variableMap={variableMap}
      expressionItem={expressionItem}
      isFocused={isFocused}
      setFocus={setFocus}
      onExpressionChange={onExpressionChange}
      onEnterNewExpression={onEnterNewExpression}
      onDeleteExpression={onDeleteExpression}
      onDeleteVariable={onDeleteVariable}
    />
    :
    <TextEntry
      idx={idx}
      variableMap={variableMap}
      expressionItem={expressionItem}
      isFocused={isFocused}
      setFocus={setFocus}
      onExpressionChange={onExpressionChange}
      onEnterNewExpression={onEnterNewExpression}
      onDeleteExpression={onDeleteExpression}
      onDeleteVariable={onDeleteVariable}
    />
  );
}
