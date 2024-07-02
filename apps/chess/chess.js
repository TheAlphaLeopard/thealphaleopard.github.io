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
        'P': 'white_pawn.png',
        'R': 'white_rook.png',
        'N': 'white_knight.png',
        'B': 'white_bishop.png',
        'Q': 'white_queen.png',
        'K': 'white_king.png',
        'p': 'black_pawn.png',
        'r': 'black_rook.png',
        'n': 'black_knight.png',
        'b': 'black_bishop.png',
        'q': 'black_queen.png',
        'k': 'black_king.png'
    };

    const createBoard = () => {
        boardElement.innerHTML = '';
        initialBoard.forEach((piece, index) => {
            const square = document.createElement("div");
            square.classList.add((Math.floor(index / 8) + index % 8) % 2 === 0 ? "white" : "black");
            square.dataset.index = index;

            if (piece) {
                const img = document.createElement("img");
                img.src = `/imgs/${pieceImages[piece]}`;
                img.alt = piece;
                img.classList.add("chess-piece");
                square.appendChild(img);
            }

            square.addEventListener("click", () => handleSquareClick(index));
            boardElement.appendChild(square);
        });
    };

    const handleSquareClick = (index) => {
        const piece = initialBoard[index];
        const isWhitePiece = piece.toUpperCase() === piece;

        if (selectedPiece) {
            if (isMoveValid(selectedPiece, selectedPiecePosition, index)) {
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

    const isMoveValid = (piece, fromIndex, toIndex) => {
        // Add logic for validating chess moves based on piece type
        // For now, we'll just allow any move to an empty square or capture
        const targetPiece = initialBoard[toIndex];
        return !targetPiece || (turn === 'white' && targetPiece.toLowerCase() === targetPiece) || (turn === 'black' && targetPiece.toUpperCase() === targetPiece);
    };

    const movePiece = (fromIndex, toIndex) => {
        initialBoard[toIndex] = initialBoard[fromIndex];
        initialBoard[fromIndex] = '';
    };

    createBoard();
});
