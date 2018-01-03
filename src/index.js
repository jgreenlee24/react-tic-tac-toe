import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Functional Component: Square
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]} 
              key={"square"+i}
              onClick={() => this.props.onClick(i)}>
      </Square>
    );
  }
  
  // render: create 3x3 square grid
  render() {    
    return (
      <div>
        {[...Array(3)].map((x, i) => {
          return <div className="board-row" key={"row"+i}>
            {[...Array(3)].map((x, g) => {
              return this.renderSquare(i*3 + g)
            })}
          </div>
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  render() {
    const prevPlayer = (this.state.xIsNext ? 'O' : 'X');
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, prevPlayer);    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={()=> this.jumpTo(move)}>{desc}</button>
          </li>
        )
    });
    
    let status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    status = winner ? 'Winner: ' + (this.state.xIsNext ? 'O' : 'X') : status;
    
    return (
      <div className="game">
        <div className="game-board">
            <Board squares={current.squares}
                   onClick={(i) => this.handleClick(i)}>
            </Board>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length -1];
    const squares = current.squares.slice();

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
}

// helper functions
function calculateWinner(squares, currentPlayer) {
  let c = currentPlayer;
  let binaryWins = [7, 56, 448, 73, 146, 292, 273, 84];
  let bits = [].concat.apply([], squares);
  let score = parseInt(bits.map(item => item === c ? 1 : 0).join(''), 2);
  
  for (let i = 0; i < binaryWins.length; i++) {
    if ((score & binaryWins[i]) === binaryWins[i]) {
      console.log("we have a winner!");
      return true;
    }
  }
  return false;
}

ReactDOM.render(<Game />, document.getElementById('root'));
