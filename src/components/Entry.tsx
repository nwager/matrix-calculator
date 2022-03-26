import { Matrix, string, typeOf } from 'mathjs';
import React, { ChangeEvent, Component, createRef, KeyboardEvent, RefObject } from 'react';
import './Entry.scss';
import { ExpressionItem, VariableMap } from '../utils/types';
import MatrixRenderer from './MatrixRenderer';

interface EntryProps {
  variableMap: VariableMap;
  expressionItem: ExpressionItem;
  idx: number;
  isFocused: boolean;
  setFocus: (idx: number) => void;
  onExpressionChange: (text: string, idx: number, deleteVar?: string) => void;
  expressionEntered: (idx: number) => void;
  expressionDeleted: (idx: number) => void;
}

export default class Entry extends Component<EntryProps, {}> {
  private previousText: string = '';
  private inputRef: RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.inputRef = createRef<HTMLInputElement>();
    this.state = {
      currentText: this.props.expressionItem.text,
    };
  }

  // apply focusing logic on creation
  public componentDidMount = () => {
    this.tryFocus();
  }

  // apply focusing logic on each update
  public componentDidUpdate = () => {
    this.tryFocus();
  }

  /** If `this.props.isFocused` is true, focuses input element. */
  private tryFocus = () => {
    const input = this.inputRef.current;
    if (input && this.props.isFocused) {
      input.focus();
    }
  }

  /**
   * Check whether or not an expression includes a variable being assigned
   * a value (i.e. an expression of the form "`varName = ...`").
   * @param varName Name of variable to match
   * @param expression Expression in which `varName` is matched
   * @returns Whether `varName` is variable-assigned in `expression`
   */
  private containsVar(expression: string, varName: string): boolean {
    const re = new RegExp(/^\s*/.source + varName + /\s*=/.source);
    return !!expression.match(re);
  }

  private shouldDeleteVar = (currText: string): string | undefined => {
    if (!this.previousText.includes('=')) return;
    const oldVar = this.previousText.split('=')[0].trim();
    if (!this.containsVar(currText, oldVar)) return oldVar;
  }

  private onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { idx, onExpressionChange, expressionItem } = this.props;
    const text = e.currentTarget.value;
    onExpressionChange(text, idx, this.shouldDeleteVar(text));
    this.previousText = expressionItem.text;
  }

  private onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { expressionItem,
            idx,
            expressionEntered,
            expressionDeleted, } = this.props;

    switch (e.key) {
      case 'Enter':
        expressionEntered(idx);
        break;
      case 'Delete':
      case 'Backspace':
        if (!expressionItem.text) {
          e.preventDefault(); // don't delete anything else
          expressionDeleted(idx);
        }
        break;
    }
  }

  private onFocus = () => {
    this.props.setFocus(this.props.idx);
  }

  public render() {
    const { expressionItem } = this.props;
    const { value, expression } = expressionItem;

    let valueRender: any;
    if (expression === '') {
      valueRender = '[empty]';
    } else if (value === null) {
      valueRender = '[oops]';
    } else {
      valueRender = typeOf(expressionItem.value) === 'Matrix'
        ? <MatrixRenderer matrix={value as Matrix} />
        : string(expressionItem.value);
    }

    return (
      <div className='entry'>
        <input
          type='text'
          value={expressionItem.text}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          ref={this.inputRef}
        />
        <div className='expression-value'>{valueRender}</div>
      </div>
    );
  }
}

