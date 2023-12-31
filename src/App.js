import {useState} from "react";

function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{ value }</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
        return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
        nextSquares[i] = "X";
    } else {
        nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const displaySquares = squares.map((square, i) => {
    return (
      <Square key={'square' + i} value={square} onSquareClick={() => handleClick(i)}  />
    );
  });

  const boardRow = displaySquares.map((displaySquare, i) => {
    if ( i % 3 === 0 ) {
      return (
        <div key={'board'+i} className="board-row">
          {displaySquares[i]}
          {displaySquares[i+1]}
          {displaySquares[i+2]}
        </div>
      );
    }
  });

  return (
    <>
      <div className="status">{status}</div>
      {boardRow}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [moves, setMoves] = useState(addMoves());

  function addMoves() {
    return history.map((squares, move) => {
      let description;
      if ( currentMove === move ) {
        description = 'You are at move #' + move;
        return (
          <li key={move}>
            {description}
          </li>
        );
      }
      else if ( move > 0 ) {
        description = 'Go to move #' + move;
      } else {
        description = 'Go to game start';
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    })
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeHistoryOrder() {
    setMoves(addMoves().reverse());
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMoves(addMoves());
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={() => changeHistoryOrder()}>Change history order</button>
      </div>
    </div>
  );
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}