import { Component } from 'react';
import './ExpressionRenderer.scss';
import { ExpressionItem, Result, VariableMap } from '../utils/types';
import { EMPTY_EXPRESSION, expressionsAreEqual, matrixToString, safeEvaluate } from '../utils/utils';
import MatrixEditor, { FALLBACK_MATRIX } from './MatrixEditor';
import Entry from './Entry';

interface ExpressionRendererState {
  expressionList: ExpressionItem[];
  variableMap: VariableMap;
  focusedExpression: number | null;
  matrix?: any;
}

export default class ExpressionRenderer extends Component<{}, ExpressionRendererState> {
  constructor(props: any) {
    super(props);
    this.state = {
      variableMap: new Map<string, Result | null>(),
      expressionList: [EMPTY_EXPRESSION()],
      focusedExpression: 0,
    };
  }

  /**
   * Evaluates the given mathematical expression and updates the
   * expression item at the given index.
   * @param text Mathematical expression to evaluate.
   * @param idx Index of expression item being evaluated.
   */
  private reevaluate = (text: string, idx: number, isMatrixEntry?: boolean) => {
    const expressionUpdate = this.getExpressionFromText(text, isMatrixEntry);
    this.updateExpressionItem({ item: expressionUpdate, idx});
  }

  /**
   * Updates every expression item.
   */
  private reevaluateAll = () => {
    const updates = this.state.expressionList.map(
      e => this.getExpressionFromText(e.text)
    );
    this.updateExpressionItem(updates);
  }

  /**
   * Return a new ExpressionItem from the passed in string
   * @param text The expression to evaluate.
   * @param isMatrixEntry Optional.
   */
  private getExpressionFromText = (
    text: string, isMatrixEntry?: boolean
  ): ExpressionItem => {

    const { variableMap } = this.state;
    let value: Result | null;
    let isVariable = false;
    const [exp, val] = text.split('=', 2).map(s => s.trim());
    if (exp && val) {
      // variable assignment
      value = val.includes(exp) ? null : safeEvaluate(val, variableMap);
      isVariable = true;
    } else {
      // expression
      value = safeEvaluate(exp, variableMap);
    }
    return {
      expression: exp, value, isVariable, text, isMatrixEntry
    };
  }

  /**
   * Update the expression item at the given index, or all items.
   * @param update An expression item and the index it should replace,
   *               or an array of updates for every expression.
   */
   private updateExpressionItem = (
    update: { item: ExpressionItem, idx: number } | ExpressionItem[]
  ) => {

    const updatedMap = new Map<string, Result | null>(this.state.variableMap);
    let varsHaveChanged = false;

    // create a copy of the expression list with the given index/indices updated
    const updatedList = this.state.expressionList.map((exp, i) => {
      let newExp: ExpressionItem;
      if (Array.isArray(update)) {
        newExp = update[i];
      } else {
        if (i !== update.idx) return exp;
        newExp = update.item;
      }
      // if updated variable assignment, update map
      const currExp = this.state.expressionList[i];
      if (newExp.isVariable && !expressionsAreEqual(currExp, newExp)) {
        if (newExp.expression !== currExp.expression)
          updatedMap.delete(currExp.expression)
        updatedMap.set(newExp.expression, newExp.value)
        varsHaveChanged = true;
      }
      return newExp;
    });

    this.setState({
      expressionList: updatedList,
      variableMap: updatedMap,
    }, () => {
      // if variableMap has changed, reeval everything after update 
      if (varsHaveChanged) {
        this.reevaluateAll();
      }
    });
  }

  private onExpressionChange = (text: string,
                                idx: number,
                                isMatrixEntry?: boolean) => {
    this.reevaluate(text, idx, isMatrixEntry);
  }

  private onEnterNewExpression = (idx: number) => {
    const updatedList = [...this.state.expressionList];
    updatedList.splice(idx + 1, 0, EMPTY_EXPRESSION());
    this.setState({
      expressionList: updatedList,
      focusedExpression: idx + 1,
    });
  }

  /**
   * Called the moment a variable assignment becomes a normal expression.
   * @param deleteVar The variable to delete.
   */
  private onDeleteVariable = (deleteVar: string) => {
    const updatedMap = new Map<string, Result | null>(this.state.variableMap);
    updatedMap.delete(deleteVar);
    // reeval everything after variable is deleted
    this.setState({
      variableMap: updatedMap
    }, this.reevaluateAll);
  }

  /**
   * Called when a deleting key is hit while in an empty expression.
   * @param idx The index of the expression to delete.
   */
  private onDeleteExpression = (idx: number) => {
    if (this.state.expressionList.length < 2) return;
    const updatedList = [...this.state.expressionList];
    updatedList.splice(idx, 1);
    this.setState({
      expressionList: updatedList,
      focusedExpression: idx === 0 ? 0 : idx - 1,
    });
  }

  private setFocus = (idx: number) => {
    this.setState({
      focusedExpression: idx,
    });
  }

  private renderEntries = () => {
    const { expressionList, variableMap, focusedExpression } = this.state;
    return expressionList.map((exp, i) => {
      return (
        <Entry
          idx={i}
          variableMap={variableMap}
          expressionItem={exp}
          isFocused={focusedExpression === i}
          setFocus={this.setFocus}
          onExpressionChange={this.onExpressionChange}
          onEnterNewExpression={this.onEnterNewExpression}
          onDeleteVariable={this.onDeleteVariable}
          onDeleteExpression={this.onDeleteExpression}
          key={i}
        />
      );
    });
  }

  /**
   * Create a new zero-matrix variable.
   */
  private addMatrix = () => {
    const { expressionList, variableMap } = this.state;
    // generate a new variable name "M_#" for the matrix
    let varNum = 0;
    while (variableMap.has(`M_(${varNum})`)) varNum++;
    expressionList.push({
      expression: `M_(${varNum})`,
      value: FALLBACK_MATRIX,
      isVariable: true,
      text: `M_(${varNum})=${matrixToString(FALLBACK_MATRIX)}`,
      isMatrixEntry: true,
    });
    this.setState({ expressionList });
  }

  public render() {
    return (
      <div className='entries-container'>
        {this.renderEntries()}
        <MatrixEditor
          variableMap={this.state.variableMap}
          updateValue={(matrix) => this.setState({ matrix })}
        />
        <button type='button' onClick={() => console.log(this.state)}>Log State</button>
        <button type='button' onClick={this.addMatrix}>Add Matrix</button>
      </div>
    );
  }
}
