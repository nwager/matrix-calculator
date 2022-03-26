import { Matrix } from 'mathjs';
import React from 'react';
import './MatrixRenderer.scss';

interface MatrixRendererProps {
  matrix: Matrix;
}

export default function MatrixRenderer(props: MatrixRendererProps) {
  return (
    <div className='matrix-container'>
      <table className='matrix-table'>
        <tbody>
          {renderRows(props.matrix)}
        </tbody>
      </table>
      <div className='bracket left-bracket' />
      <div className='bracket right-bracket' />
    </div>
  );
}

/**
 * @param {number[][]} m A 2D array of numbers representing a matrix
 * @returns The matrix as a `<table>` element
 */
function renderRows(m: Matrix) {
  if (m.size().length === 1) {
    return (
      <tr>{m.toArray().map((x, i) => <td key={i}>{x}</td>)}</tr>
    )
  }
  return m.toArray().map(
    (r, i) => <tr key={i}>{(r as number[]).map((x, j) => <td key={j}>{x}</td>)}</tr>
  );
}
