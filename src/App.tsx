import React from 'react';
import './App.scss';
import ExpressionRenderer from './components/ExpressionRenderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
