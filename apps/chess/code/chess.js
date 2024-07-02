document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("chess-board");

    const pieces = {
        '0': '',
        '1': 'black_rook.png',
        '2': 'black_knight.png',
        '3': 'black_bishop.png',
        '4': 'black_queen.png',
        '5': 'black_king.png',
        '6': 'black_bishop.png',
        '7': 'black_knight.png',
        '8': 'black_rook.png',
        '9': 'black_pawn.png',
        '10': 'black_pawn.png',
        '11': 'black_pawn.png',
        '12': 'black_pawn.png',
        '13': 'black_pawn.png',
        '14': 'black_pawn.png',
        '15': 'black_pawn.png',
        '16': 'black_pawn.png',
        '48': 'white_pawn.png',
        '49': 'white_pawn.png',
        '50': 'white_pawn.png',
        '51': 'white_pawn.png',
        '52': 'white_pawn.png',
        '53': 'white_pawn.png',
        '54': 'white_pawn.png',
        '55': 'white_pawn.png',
        '56': 'white_rook.png',
        '57': 'white_knight.png',
        '58': 'white_bishop.png',
        '59': 'white_queen.png',
        '60': 'white_king.png',
        '61': 'white_bishop.png',
        '62': 'white_knight.png',
        '63': 'white_rook.png',
    };

    const createBoard = () => {
        for (let i = 0; i < 64; i++) {
            const square = document.createElement("div");
            square.classList.add((Math.floor(i / 8) + i % 8) % 2 === 0 ? "white" : "black");

            if (pieces[i]) {
                const img = document.createElement("img");
                img.src = `../../home/imgs/${pieces[i]}`;
                img.alt = pieces[i];
                square.appendChild(img);
            }

            board.appendChild(square);
        }
    };

    createBoard();
});
