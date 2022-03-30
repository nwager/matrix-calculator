import React, { Component } from 'react';
import './ExpressionRenderer.scss';
import { ExpressionItem, Result, VariableMap } from '../utils/types';
import { EMPTY_EXPRESSION, expressionsAreEqual, safeEvaluate } from '../utils/utils';
import Entry from './Entry';
import MatrixEditor from './MatrixEditor';

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
      variableMap: new Map<string, Result>(),
      expressionList: [EMPTY_EXPRESSION()],
      focusedExpression: 0,
    };
  }

  /**
   * Update the expression item at the given index. Optionally, delete a
   * variable from the variable map.
   * @param update The new expression item to replace the current one,
   *               or an array of updates for every expression.
   * @param idx The index of expression item(s) to update. If updating
   *            all expressions, this value is ignored.
   * @param deleteVar Optional: variable name to delete.
   */
  private updateExpressionItem = (update: ExpressionItem | ExpressionItem[],
                                  idx: number,
                                  deleteVar?: string) => {

    const updatedMap = new Map<string, Result | null>(this.state.variableMap);
    let varsHaveChanged = false;

    // create a copy of the expression list with the given index/indices updated
    const updatedList = this.state.expressionList.map((exp, i) => {
      let currUpdate: ExpressionItem;
      if (Array.isArray(update)) {
        currUpdate = update[i];
      } else {
        if (idx !== i) return exp;
        currUpdate = update;
      }
      // if updated variable assignment, update map
      const currExp = this.state.expressionList[i];
      if (currUpdate.isVariable && !expressionsAreEqual(currExp, currUpdate)) {
        updatedMap.set(currUpdate.expression, currUpdate.value)
        varsHaveChanged = true;
      }
      return currUpdate;
    });
    // if needed, delete the passed-in variable
    if (deleteVar) {
      updatedMap.delete(deleteVar);
      varsHaveChanged = true;
    }
    // if variableMap has changed, reeval everything after update 
    this.setState({
      expressionList: updatedList,
      variableMap: updatedMap,
    }, () => {
      if (varsHaveChanged) {
        this.reevaluateAll();
      }
    });
  }

  /**
   * Evaluates the given mathematical expression `text` and updates the
   * expression item at the given index.
   * @param text Mathematical expression to evaluate. Ignored if idx == -1.
   * @param idx Index of expression item being evaluated. If == -1, update all.
   * @param deleteVar Optional: variable name to delete
   */
  private reevaluate = (text: string, idx: number, deleteVar?: string) => {
    const { expressionList } = this.state;
    // update one
    if (idx !== -1) {
      const expressionUpdate = this.getUpdatedExpression(text);
      this.updateExpressionItem(expressionUpdate, idx, deleteVar);
      return;
    }
    // update all
    const updates = expressionList.map(e => this.getUpdatedExpression(e.text))
    this.updateExpressionItem(updates, -1, deleteVar);
  }

  private reevaluateAll = () => {
    this.reevaluate('', -1);
  }

  private getUpdatedExpression = (text: string): ExpressionItem => {
    const { variableMap } = this.state;
    let expressionUpdate: ExpressionItem;
    const [exp, val] = text.split('=').map(s => s.trim());
    if (val) {
      // variable assignment
      expressionUpdate = {
        expression: exp,
        // null if variable is defined in terms of itself
        value: val.includes(exp) ? null : safeEvaluate(val, variableMap),
        isVariable: true,
        text,
      };
    } else {
      // expression
      expressionUpdate = {
        expression: exp,
        value: safeEvaluate(exp, variableMap),
        isVariable: false,
        text,
      };
    }
    return expressionUpdate;
  }

  private onExpressionChange = (text: string, idx: number, deleteVar?: string) => {
    this.reevaluate(text, idx, deleteVar);
  }

  private expressionEntered = (idx: number) => {
    const updatedList = [...this.state.expressionList];
    updatedList.splice(idx + 1, 0, EMPTY_EXPRESSION());
    this.setState({
      expressionList: updatedList,
      focusedExpression: idx + 1,
    });
  }

  private expressionDeleted = (idx: number) => {
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
          variableMap={variableMap}
          expressionItem={exp}
          onExpressionChange={this.onExpressionChange}
          idx={i}
          isFocused={focusedExpression === i}
          setFocus={this.setFocus}
          expressionEntered={this.expressionEntered}
          expressionDeleted={this.expressionDeleted}
          key={i}
        />
      );
    });
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
      </div>
    );
  }
}
