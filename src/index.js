import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button
            className={`square ${props.highlight ? 'active' : ''}`}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

  
class Board extends React.Component {
    renderSquare(i, highlight) {
        return (
            <Square
                value={this.props.squares[i]}
                key={i}
                onClick={() => this.props.onClick(i)} 
                highlight={highlight}
                />
        );
    }
  
    render() {
        const SIZE = 3;
        const winner = calculateWinner(this.props.squares);
        let rows = Array(SIZE).fill(null);
        let cols = Array(SIZE).fill(null);

        const board = rows.map((value, rowIndex) => {
            return (
                <div className="board-row" key={rowIndex}>
                    { 
                        cols.map((value, colIndex) => {
                            const position = SIZE*rowIndex + colIndex;
                            const highlight = winner ? winner.line.includes(position) : null;
                            return this.renderSquare(position, highlight)
                        })
                    }
                </div>
            );
        });

        return (
            <div>
                {board}
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
            xIsNext: true,
            reverse: false
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    reverse() {
        this.setState({
            reverse: !this.state.reverse
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isGameOver = !current.squares.includes(null);

        const moves = history.map((step, move) => {
            const selectedIndex = getSelectedIndex(step.squares, move ? history[move - 1].squares : null);
            const col = selectedIndex > -1 ? (selectedIndex % 3) + 1 : null;
            const row = selectedIndex > -1 ? Math.floor(selectedIndex / 3) + 1: null;
            const location = col && row ?  `(${col}, ${row})` : null;

            const desc = move ? 
                'Go to move #' + move + (location ? `: ${location}` : ''):
                'Go to game start';
            return (
                <li key={move} className={move===this.state.stepNumber ? 'active' : ''}>
                    <button onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        if (this.state.reverse) moves.reverse();

        let status;
        if (winner) {
            status = 'Winner: ' + winner.symbol;
        } else if (isGameOver) {
            status = 'Draw'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>
                    <button onClick={()=>this.reverse()}>{this.state.reverse ? 'Ascending' : 'Descending'}</button>
                </div>
                <ol>{moves}</ol>
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {symbol: squares[a], line: lines[i]};
        }
    }
    return null;
}

function getSelectedIndex(squares, previousSquares) {
    let selectedIndex = -1;
    if (Array.isArray(squares)) {
        let square, previousSquare;
        const hasPrevious = Array.isArray(previousSquares) && squares.length === previousSquares.length;
        for (let i = 0; i < squares.length; i++) {
            square = squares[i];
            previousSquare = hasPrevious ? previousSquares[i] : null;
            
            if ((hasPrevious && square !== previousSquare) || (!hasPrevious && square)) {
                selectedIndex = i;
                break;
            }
        }
    }

    return selectedIndex;
}