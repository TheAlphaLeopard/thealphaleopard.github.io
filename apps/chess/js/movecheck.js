const isMoveValid = (piece, fromIndex, toIndex, board) => {
    const [fromX, fromY] = [fromIndex % 8, Math.floor(fromIndex / 8)];
    const [toX, toY] = [toIndex % 8, Math.floor(toIndex / 8)];
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const targetPiece = board[toIndex];
    const isWhite = piece === piece.toUpperCase();

    const isPathClear = (fromIndex, toIndex, direction) => {
        let step;
        switch (direction) {
            case 'horizontal':
                step = fromX < toX ? 1 : -1;
                for (let i = fromX + step; i !== toX; i += step) {
                    if (board[fromY * 8 + i]) return false;
                }
                break;
            case 'vertical':
                step = fromY < toY ? 8 : -8;
                for (let i = fromIndex + step; i !== toIndex; i += step) {
                    if (board[i]) return false;
                }
                break;
            case 'diagonal':
                step = (toIndex - fromIndex) / Math.abs(toIndex - fromIndex) * 9;
                for (let i = fromIndex + step; i !== toIndex; i += step) {
                    if (board[i]) return false;
                }
                break;
        }
        return true;
    };

    switch (piece.toLowerCase()) {
        case 'p': // Pawn
            if (isWhite) {
                if (fromY === 6 && deltaY === -2 && deltaX === 0 && !targetPiece && !board[toIndex + 8]) {
                    return true;
                }
                if (deltaY === -1 && deltaX === 0 && !targetPiece) {
                    return true;
                }
                if (deltaY === -1 && Math.abs(deltaX) === 1 && targetPiece && targetPiece.toLowerCase() === targetPiece) {
                    return true;
                }
            } else {
                if (fromY === 1 && deltaY === 2 && deltaX === 0 && !targetPiece && !board[toIndex - 8]) {
                    return true;
                }
                if (deltaY === 1 && deltaX === 0 && !targetPiece) {
                    return true;
                }
                if (deltaY === 1 && Math.abs(deltaX) === 1 && targetPiece && targetPiece.toUpperCase() === targetPiece) {
                    return true;
                }
            }
            break;
        case 'r': // Rook
            if ((deltaX === 0 || deltaY === 0) && isPathClear(fromIndex, toIndex, deltaX === 0 ? 'vertical' : 'horizontal')) {
                return true;
            }
            break;
        case 'n': // Knight
            if ((Math.abs(deltaX) === 2 && Math.abs(deltaY) === 1) || (Math.abs(deltaX) === 1 && Math.abs(deltaY) === 2)) {
                return true;
            }
            break;
        case 'b': // Bishop
            if (Math.abs(deltaX) === Math.abs(deltaY) && isPathClear(fromIndex, toIndex, 'diagonal')) {
                return true;
            }
            break;
        case 'q': // Queen
            if ((deltaX === 0 || deltaY === 0 || Math.abs(deltaX) === Math.abs(deltaY)) &&
                isPathClear(fromIndex, toIndex, deltaX === 0 ? 'vertical' : deltaY === 0 ? 'horizontal' : 'diagonal')) {
                return true;
            }
            break;
        case 'k': // King
            if (Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1) {
                return true;
            }
            break;
        default:
            return false;
    }
    return false;
};
