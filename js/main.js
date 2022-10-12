'use strict';
console.log('hey');

const ROWS = 10;
const COLS = 10;
const LIFE = '🐇';
const SUPER_LIFE = '😇';

// Model
var gBoard;
var gIsGameOn = false;
var gIntervalId;

function onInit() {
    gBoard = createBoard();
    renderBoard(gBoard);
}

function blowLifeAround(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[i][j];
            if (currCell === LIFE) {
                // update Model
                gBoard[i][j] = '';
                // update Dom
                var elCell = document.querySelector(
                    `[data-i="${i}"][data-j="${j}"]`
                );
                elCell.innerText = gBoard[i][j];
                elCell.classList.remove('taken');
            }
        }
    }
}

function onCellClicked(elCell, cellI, cellJ) {
    if (elCell.innerText) {
        // update Model
        gBoard[cellI][cellJ] = SUPER_LIFE;
        // update Dom
        elCell.innerText = gBoard[cellI][cellJ];
        blowLifeAround(cellI, cellJ);
    }
}

function nextGeneration(board) {
    var nextBoard = getCopiedBoard(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var numOfLifeAround = countLifeAround(i, j, board);
            if (numOfLifeAround > 2 && numOfLifeAround < 6) {
                if (!currCell) nextBoard[i][j] = LIFE;
            } else if (currCell === LIFE) nextBoard[i][j] = '';
        }
    }
    return nextBoard;
}

function countLifeAround(cellI, cellJ, board) {
    var lifeAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j]) lifeAroundCount++;
        }
    }
    return lifeAroundCount;
}

function playGame() {
    gBoard = nextGeneration(gBoard);
    renderBoard(gBoard);
}

function onSwitchGame(elBtn) {
    if (gIsGameOn) {
        clearInterval(gIntervalId);
        gIsGameOn = false;
        elBtn.innerText = 'Start';
        elBtn.style.background = 'rgba(45, 220, 18, 0.4)';
    } else {
        gIntervalId = setInterval(playGame, 1000);
        gIsGameOn = true;
        elBtn.innerText = 'Pause';
        elBtn.style.background = 'rgba(245, 25, 25, 0.4)';
    }
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = currCell ? 'taken' : '';
            strHTML += `<td class="${className}" 
                data-i="${i}" data-j="${j}"
                onclick="onCellClicked(this,${i},${j})">
                <span>${currCell}</span>
                </td>`;
        }
        strHTML += `</tr>`;
    }
    document.querySelector('table').innerHTML = strHTML;
}

function createBoard() {
    var board = [];
    for (var i = 0; i < ROWS; i++) {
        board.push([]);
        for (var j = 0; j < COLS; j++) {
            board[i][j] = Math.random() > 0.5 ? LIFE : '';
        }
    }
    return board;
}

function getCopiedBoard(board) {
    var copiedBoard = [];
    for (var i = 0; i < board.length; i++) {
        copiedBoard[i] = [];
        for (var j = 0; j < board[0].length; j++) {
            copiedBoard[i][j] = board[i][j];
        }
    }

    return copiedBoard;
}
