## React Tic-Tac-Toe Game Tutorial + Challenges

An interactive tic-tac-toe game built with React

## Installation and Setup Instructions

Installation:

`npm install`

To Start Server:

`npm start`

To Visit App:

`localhost:3000`

## Challenges

1. Display the location for each move in the format (col, row) in the move history list.
    ```js
    const selectedIndex = getSelectedIndex(step.squares, move ? history[move - 1].squares : null);
    const col = selectedIndex > -1 ? (selectedIndex % 3) + 1 : null;
    const row = selectedIndex > -1 ? Math.floor(selectedIndex / 3) + 1: null;
    const location = col && row ?  `(${col}, ${row})` : null;

    const desc = move ? 
        'Go to move #' + move + (location ? `: ${location}` : ''):
        'Go to game start';
    ```

    ```js
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
    ```


2. Bold the currently selected item in the move list.
    ```js
    return (
        <li key={move} className={move===this.state.stepNumber ? 'active' : ''}>
            <button onClick={()=> this.jumpTo(move)}>{desc}</button>
        </li>
    );
    ```

    ```css
    ol > li.active > button {
        font-weight: bold;
    }
    ```

3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
    ```js
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
    ```

4. Add a toggle button that lets you sort the moves in either ascending or descending order.
    ```js
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
    ```
    ```js
    reverse() {
        this.setState({
            reverse: !this.state.reverse
        });
    }
    ```
    ```js
    return (
        //...
        <div className="game-info">
            <div>{status}</div>
            <div>
                <button onClick={()=>this.reverse()}>{this.state.reverse ? 'Ascending' : 'Descending'}</button>
            </div>
            <ol>{moves}</ol>
        </div>
        //...
    );

    ```
5. When someone wins, highlight the three squares that caused the win.
    ```js
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
    ```
    ```js
    let status;
    if (winner) {
        status = 'Winner: ' + winner.symbol;
    }
    ```
    ```js
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
        //...
        const winner = calculateWinner(this.props.squares);
        //...

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

        //...
    }
    ```
    ```js
    function Square(props) {
        return (
            <button
                className={`square ${props.highlight ? 'active' : ''}`}
                onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    ```
    ```css
    .square.active {
        background-color: yellow;
    }
    ```

6. When no one wins, display a message about the result being a draw.
    ```js
    const isGameOver = !current.squares.includes(null);

    let status;
    if (winner) {
        status = 'Winner: ' + winner.symbol;
    } else if (isGameOver) {
        status = 'Draw'
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    ```