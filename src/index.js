
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    //if (this.state.xIsNext){
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      /*
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });
      */
    //} 
    //if (!isFull(squares) && !calculateWinner(squares)){
      let aiPlays = opponentPlays(squares);
      console.assert(0 <= aiPlays);
      console.assert(aiPlays < 9);
      squares[aiPlays] = 'O';
      this.setState({
        squares: squares,
        //xIsNext: !this.state.xIsNext,
      });
    //}
    //console.assert(this.state.xIsNext);
    //*/
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (isFull(this.state.squares)){
      status = 'Draw!'; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function isFull(squares){
  let full = true;
  for (let i=0; i<9; i++){
    if (squares[i] === null){
      full = false;
    }
  }
  return full;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  console.assert(squares[0] === 'X' || squares[0] === 'O' || squares[0] === null);


  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function opponentPlays(squares){
  let possibleMoves = getPossibleMoves(squares);
  console.assert(possibleMoves.length < 10); 
  let minPossible = 2;
  let moveIA = -1;
  for (let i=0; i<possibleMoves.length; i++){
    let move = possibleMoves[i];
    let child = playThis(squares, move, false)
    let value = miniMax(child, true);
    if (value < minPossible){
      moveIA = move;
      minPossible = value;
    }
  }
  console.assert(moveIA !== -1)
  return moveIA;
}

function playThis(squares, i, xIsPlaying){
  if (calculateWinner(squares) || squares[i]) {
    throw new Error('there is a winner or the square is occupied');
  }
  
  const newSquares = squares.slice();
    
  newSquares[i] = xIsPlaying ? 'X' : 'O';
  return newSquares;
}

function miniMax(squares, maximizingPlayer){

  let w = calculateWinner(squares);
  if (w ==='X'){
    return 1;
  } else if (w ==='O'){
    return -1;
  } else if (isFull(squares)) {
    return 0;
  }

  let possibleMoves = getPossibleMoves(squares);
  let value;

  if (maximizingPlayer) {
    value = -2;
    for (let i=0; i<possibleMoves.length; i++){
      let move = possibleMoves[i];
      let child = playThis(squares, move, maximizingPlayer)
      value = Math.max(value, miniMax(child, false))
    }
  }
  else {
    value = 2;
    for (let i=0; i<possibleMoves.length; i++){
      let move = possibleMoves[i];
      let child = playThis(squares, move, maximizingPlayer)
      value = Math.min(value, miniMax(child, true))
    }
  }

  return value;
}

function getPossibleMoves(squares){
  let possibleMoves = []
  for (let i=0; i<9; i++){
    if (squares[i] === null){
      possibleMoves.push(i)
    }
  }
  return possibleMoves;
}
