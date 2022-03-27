import { MathJaxContext } from 'better-react-mathjax';
import { evaluate, log } from 'mathjs';
import React, { useState } from 'react';
import { addStyles, EditableMathField, MathField, MathFieldConfig } from 'react-mathquill';
import './App.scss';
import ExpressionRenderer from './components/ExpressionRenderer';

addStyles();

const config: MathFieldConfig = {
  autoCommands: ['sqrt'].join(' '),
  handlers: {
    deleteOutOf: (direction: any, mathField: MathField) => {
      console.log("DELETE");
      console.log(direction, mathField);
    },
    enter: (mathField) => {
      console.log("ENTER");
      console.log(mathField);
    },
    edit: (mathField) => console.log(mathField?.text()),
  }
};

function App() {
  const [latex, setLatex] = useState('');
  const [mathRef, setMathRef] = useState<MathField | null>(null);
  return (
    <MathJaxContext version={3} src={`${process.env.PUBLIC_URL}/mathjax/tex-chtml.js`}>
      <div className="App">
        {/* <ExpressionRenderer /> */}
        <div
          id="mathfield-wrapper"
          onKeyDown={e => console.log(e.key)}
        >
          <EditableMathField
            latex={latex} // latex value for the input field
            onChange={(mathField) => {
              // called everytime the input changes
              setLatex(mathField.latex());
            }}
            mathquillDidMount={mathField => setMathRef(mathField)}
            config={config}
          />
        </div>
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
    </MathJaxContext>
  );
}

export default App;
