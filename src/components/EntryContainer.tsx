import { Matrix, round, string, typeOf } from 'mathjs';
import { Component } from 'react';
import './EntryContainer.scss';
import { ExpressionItem, VariableMap } from '../utils/types';
import { EditableMathField, MathField, MathFieldConfig, StaticMathField } from 'react-mathquill';
import classNames from 'classnames';
import { getMatrixTex } from '../utils/utils';

export interface EntryContainerProps {
  variableMap: VariableMap;
  expressionItem: ExpressionItem;
  idx: number;
  isFocused: boolean;
  setFocus: (idx: number) => void;
  onExpressionChange: (text: string, idx: number, deleteVar?: string) => void;
  expressionEntered: (idx: number) => void;
  expressionDeleted: (idx: number) => void;
}

interface EntryContainerState {
  latex: string;
  entryIsFocused: boolean;
}

export default class EntryContainer extends Component<EntryContainerProps, EntryContainerState> {
  private previousText: string = '';
  private mathFieldRef: MathField | null = null;

  private mathConfig: MathFieldConfig = {
    autoCommands: 'sqrt',
    charsThatBreakOutOfSupSub: '+-',
    handlers: {
      deleteOutOf: (_dir: any, _mathField: MathField) => {
        this.props.expressionDeleted(this.props.idx);
      },
      enter: (_mathField: MathField) => {
        this.props.expressionEntered(this.props.idx);
      }
    },
  };

  constructor(props: any) {
    super(props);
    this.state = {
      latex: '',
      entryIsFocused: this.props.isFocused,
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

  /** If `this.props.isFocused` is true, focuses input. */
  private tryFocus = () => {
    let entryIsFocused = false;
    if (this.props.isFocused) {
      this.mathFieldRef?.focus();
      entryIsFocused = true;
    }
    if (entryIsFocused !== this.state.entryIsFocused)
      this.setState({entryIsFocused});
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

  private onMathChange = (mathField: MathField) => {
    const { idx, onExpressionChange, expressionItem } = this.props;
    const text = mathField.text();
    onExpressionChange(text, idx, this.shouldDeleteVar(text));
    this.previousText = expressionItem.text;
    this.setState({ latex: mathField.latex() });
  }

  private onFocus = () => {
    this.props.setFocus(this.props.idx);
  }

  private setMathFieldRef = (mathField: MathField) => {
    this.mathFieldRef = mathField;
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
      valueRender = typeOf(value) === 'Matrix'
        ? getMatrixTex(round(value, 5) as Matrix)
        : string(round(value, 5));
    }

    return (
      <div
        className={classNames(
          'entry',
          {'focused': this.state.entryIsFocused}
        )}
        onFocus={this.onFocus}
        onClick={this.onFocus}
      >
        <EditableMathField
          latex={this.state.latex} // latex value for the input field
          onChange={this.onMathChange}
          mathquillDidMount={this.setMathFieldRef}
          config={this.mathConfig}
        />
        <div className='expression-value'>
          <StaticMathField>
            {valueRender}
          </StaticMathField>
        </div>
      </div>
    );
  }
}

