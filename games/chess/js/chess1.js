document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("chess-board");
    const statusElement = document.getElementById("status");
    const checkmateElement = document.getElementById("checkmate");
    const homeButton = document.getElementById("home-btn");
    const playAgainButton = document.getElementById("play-again-btn");

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
                if (piece === 'K' && turn === 'white' && isInCheck('white')) {
                    img.classList.add("in-check");
                } else if (piece === 'k' && turn === 'black' && isInCheck('black')) {
                    img.classList.add("in-check");
                }
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
            if (isMoveValid(selectedPiece, selectedPiecePosition, index, initialBoard) && !wouldLeaveKingInCheck(selectedPiecePosition, index)) {
                movePiece(selectedPiecePosition, index);
                if (isInCheck(turn)) {
                    undoMove(selectedPiecePosition, index);
                    statusElement.textContent = 'Invalid move, you are in check!';
                } else {
                    selectedPiece = null;
                    selectedPiecePosition = null;
                    turn = turn === 'white' ? 'black' : 'white';
                    if (isInCheck(turn)) {
                        statusElement.textContent = turn.charAt(0).toUpperCase() + turn.slice(1) + ' is in check!';
                        if (isCheckmate(turn)) {
                            statusElement.textContent = '';
                            displayCheckmate();
                        }
                    } else {
                        statusElement.textContent = '';
                    }
                    createBoard();
                }
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

    const undoMove = (fromIndex, toIndex) => {
        initialBoard[fromIndex] = initialBoard[toIndex];
        initialBoard[toIndex] = '';
    };

    const isInCheck = (color) => {
        const kingPosition = initialBoard.findIndex(piece => piece === (color === 'white' ? 'K' : 'k'));
        return isSquareUnderAttack(kingPosition, color === 'white' ? 'black' : 'white');
    };

    const isSquareUnderAttack = (square, attackingColor) => {
        for (let i = 0; i < initialBoard.length; i++) {
            if (initialBoard[i] && ((attackingColor === 'white' && initialBoard[i] === initialBoard[i].toUpperCase()) || 
                (attackingColor === 'black' && initialBoard[i] === initialBoard[i].toLowerCase()))) {
                if (isMoveValid(initialBoard[i], i, square, initialBoard)) {
                    return true;
                }
            }
        }
        return false;
    };

    const isCheckmate = (color) => {
        for (let i = 0; i < initialBoard.length; i++) {
            if (initialBoard[i] && ((color === 'white' && initialBoard[i] === initialBoard[i].toUpperCase()) || 
                (color === 'black' && initialBoard[i] === initialBoard[i].toLowerCase()))) {
                for (let j = 0; j < initialBoard.length; j++) {
                    if (isMoveValid(initialBoard[i], i, j, initialBoard)) {
                        movePiece(i, j);
                        if (!isInCheck(color)) {
                            undoMove(i, j);
                            return false;
                        }
                        undoMove(i, j);
                    }
                }
            }
        }
        return true;
    };

    const wouldLeaveKingInCheck = (fromIndex, toIndex) => {
        movePiece(fromIndex, toIndex);
        const inCheck = isInCheck(turn);
        undoMove(fromIndex, toIndex);
        return inCheck;
    };

    const displayCheckmate = () => {
        checkmateElement.classList.remove("hidden");
    };

    homeButton.addEventListener("click", () => {
        window.location.href = "../../home/";
    });

    playAgainButton.addEventListener("click", () => {
        initialBoard = [
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
        ];
        turn = 'white';
        selectedPiece = null;
        selectedPiecePosition = null;
        checkmateElement.classList.add("hidden");
        createBoard();
        statusElement.textContent = '';
    });

    createBoard();
});
