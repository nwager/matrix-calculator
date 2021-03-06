# Matrix Calculator

This project was heavily inspired by the [Desmos Matrix Calculator](https://www.desmos.com/matrix). That site has been invaluable for my linear algebra tasks, but it only supports variables that are matrices. I added support for scalar variables that can work as elements in a matrix, or coefficients for an entire matrix.

## Todo

- Matrix entries don't update when variable map is changed
- Deleting entry still causes operation to run for the deleted index, which either deletes the next expression or causes errors at the end of the list
- Support functions

## Attributions

- [Desmos Matrix Calculator](https://www.desmos.com/matrix) for inspiration and guidance
- [math.js](https://mathjs.org/) for calculating mathematical expressions
- [react-mathquill](https://www.npmjs.com/package/react-mathquill/v/0.2.6) (which is a React wrapper for [MathQuill](http://mathquill.com/)) for LaTeX input
