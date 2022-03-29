import React from 'react';
import './MatrixEditor.scss';
import { EditableMathField } from 'react-mathquill';

export default function MatrixEditor() {
  return (
    <div className='matrix-container'>
      <table className='matrix-table'>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
      <div className='bracket left-bracket' />
      <div className='bracket right-bracket' />
    </div>
  );
}

 function renderRows() {
  const [rows, cols] = [3, 3];
  return Array(rows).fill(0).map((_, i) => {
    return <tr key={i}>{Array(cols).fill(0).map((_, j) => {
      return <td key={j}><EditableMathField /></td>
    })}</tr>
  });
}
