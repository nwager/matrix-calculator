import './MatrixRenderer.scss';
import { StaticMathField } from 'react-mathquill';
import { Matrix } from 'mathjs';
import { str } from '../utils/utils';

interface MatrixRendererProps {
  matrix: Matrix;
}

export default function MatrixRenderer(props: MatrixRendererProps) {
  return (
    <div className='matrix-renderer-container'>
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

function renderRows(matrix: Matrix) {
  return (matrix.toArray() as number[][]).map((r, i) => {
    return <tr key={i}>{r.map((c, j) => {
      return <td key={j}>
        <StaticMathField>{str(c)}</StaticMathField>
      </td>
    })}</tr>
  });
}
