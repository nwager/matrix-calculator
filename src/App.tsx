import { addStyles } from 'react-mathquill';
import './App.scss';
import ExpressionRenderer from './components/ExpressionRenderer';

addStyles(); // add styles for MathQuill

function App() {
  return (
    <div className="App">
      <ExpressionRenderer />
      <p>
        Copy of Desmos Matrix Calculator with scalar variable support.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </div>
  );
}

export default App;
