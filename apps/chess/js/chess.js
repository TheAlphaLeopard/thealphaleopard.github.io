document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("chess-board");
    let selectedPiece = null;
    let selectedPiecePosition = null;
    let turn = 'white';

    const initialBoard = [
        'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
        'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
        'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
    ];

    const pieceImages = {
        'P': 'imgs/white_pawn.png',
        'R': 'imgs/white_rook.png',
        'N': 'imgs/white_knight.png',
        'B': 'imgs/white_bishop.png',
        'Q': 'imgs/white_queen.png',
        'K': 'imgs/white_king.png',
        'p': 'imgs/black_pawn.png',
        'r': 'imgs/black_rook.png',
        'n': 'imgs/black_knight.png',
        'b': 'imgs/black_bishop.png',
        'q': 'imgs/black_queen.png',
        'k': 'imgs/black_king.png',
    };

    const createBoard = () => {
        boardElement.innerHTML = '';
        let board = initialBoard;
        if (turn === 'black') {
            board = board.slice().reverse();
        }
        board.forEach((piece, index) => {
            const square = document.createElement("div");
            square.classList.add((Math.floor(index / 8) + index % 8) % 2 === 0 ? "white" : "black");
            square.dataset.index = turn === 'white' ? index : 63 - index;

            if (piece) {
                const img = document.createElement("img");
                img.src = pieceImages[piece];
                img.alt = piece;
                img.classList.add("chess-piece");
                square.appendChild(img);
            }

            square.addEventListener("click", () => handleSquareClick(square.dataset.index));
            boardElement.appendChild(square);
        });
    };

    const handleSquareClick = (index) => {
        const piece = initialBoard[index];
        const isWhitePiece = piece.toUpperCase() === piece;

        if (selectedPiece) {
            if (isMoveValid(selectedPiece, selectedPiecePosition, index, initialBoard)) {
                movePiece(selectedPiecePosition, index);
                selectedPiece = null;
                selectedPiecePosition = null;
                turn = turn === 'white' ? 'black' : 'white';
                createBoard();
            } else {
                selectedPiece = null;
                selectedPiecePosition = null;
            }
        } else if ((turn === 'white' && isWhitePiece) || (turn === 'black' && !isWhitePiece)) {
            selectedPiece = piece;
            selectedPiecePosition = index;
        }
    };

    const movePiece = (fromIndex, toIndex) => {
        initialBoard[toIndex] = initialBoard[fromIndex];
        initialBoard[fromIndex] = '';
    };

    createBoard();
});
