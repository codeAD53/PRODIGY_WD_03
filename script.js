const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] //diagonals
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedIndex] !== null || !gameActive) return;

    makeMove(clickedIndex, currentPlayer);

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.style.animation = 'pop 0.2s ease';

    setTimeout(() => {
        clickedCell.style.animation = '';
    }, 200);

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins`;
        gameActive = false;
        return;
    }

    if (!gameState.includes(null)) {
        statusText.textContent = `It's a Draw! `;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
}

function checkWin() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function makeAIMove() {
    if (!gameActive) return;

    const availableMoves = gameState
        .map((val, idx) => val === null ? idx : null)
        .filter(val => val != null);

    const aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(aiMove, currentPlayer);

    if (checkWin()) {
        statusText.textContent = 'Player ${currentPlayer} wins';
        gameActive = false;
        return;
    }
    if (!gameState.includes(null)) {
        statusText.textContent = `It's a Draw`;
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    currentPlayer = 'X';
    gameState.fill(null);
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.animation = '';
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

