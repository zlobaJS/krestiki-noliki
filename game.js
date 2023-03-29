const X_CLASS = 'x';
const O_CLASS = 'o';
const cellElements = document.querySelectorAll('.cell');

const board = document.getElementById('board');

const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById('winningMessage');

const restartButton = document.getElementById('restartButton');

const playerXName = document.getElementById('player-x-name');
const playerOName = document.getElementById('player-o-name');
const playerX = X_CLASS;
const playerO = O_CLASS;

let scoreX = 0;
let scoreO = 0;

const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO')


// Делаем игру до 3 побед
const MAX_SCORE = 3;

let circleTurn;
// на каждый ход будет даваться 3 сек, если время истекло, сделаем переход хода другому игроку.
let timeOut;
let resetTimeOut;


// Делаем возможные выигрышные комбинации

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Запускаем нашу игрульку.
startGame();

// повесим обработчик событий. Долго тупил))
restartButton.addEventListener('click', startGame);



function startGame() {
    circleTurn = false // устанавливаем флаг;
    clearTimeout(timeOut);
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
        cell.textContent = '';
    })

    winningMessageElement.classList.remove('show');

    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);

}

// Даем возможность игроку думать 3 секунды :) Фишку такую придумал))))
// Теперь как бы ее реализовать......
function startTimer() {
    timeOut = setTimeout(() => {
        if (!checkWin(X_CLASS) && !checkWin(O_CLASS)) {
            changeCircleTurn();
            setBoardHoverClass();
            if(circleTurn) {
                startTimer(O_CLASS)
            } else {
                startTimer(O_CLASS)
            }
        }
    }, 3000)
}


// Добавим функцию обработчик, которая срабаьтывает при клике на ячейку в доске.
function handleClick(event) {
    const cell = event.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;

    // Запускаем функцию placeMark
    placeMark(cell, currentClass)

    // если true
    if(checkWin(currentClass)) {
        endGame(false, currentClass)
    } else if(isDraw()) {
        endGame(true)
    } else {
        changeCircleTurn();
        setBoardHoverClass();
    }
}

function changeCircleTurn() {
    circleTurn = !circleTurn;
}

// Пишем функцию, которая ставит символ в ячейку выбранную X || O
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
    currentClass === O_CLASS
        ? cell.textContent = O_CLASS
        : cell.textContent = X_CLASS;

    clearTimeout(timeOut);
    startTimer(currentClass)
}

// Функция проверяет является ли текущая доска выигрышной.
function checkWin(currentClass) {
   return WINNING_COMBINATIONS.some((combination) => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

// Функция которая определяет закончилась игра в ничью или нет.
function isDraw() {
    return [...cellElements]
        .every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
        })
}

// Функция, которая завершает игру
function endGame(isDraw, currentClass) {
    if (isDraw) {
        winningMessageTextElement.innerText = 'Ничья';
    } else {
        if (currentClass === X_CLASS) {
            scoreX++;
            scoreXElement.innerText = scoreX;
            if (scoreX >= MAX_SCORE) {
                winningMessageTextElement.innerText = `${currentClass} выиграл! Игра закончена`
                restartButton.textContent = 'Игра закончена'
                clearTimeout(timeOut)
                resetScore();
            } else {
                winningMessageTextElement.innerText = `${currentClass} выиграл! Следующая игра`
                restartButton.style.backgroundColor = '#ff1a81'
            }
        } else {
            scoreO++;
            scoreOElement.innerText = scoreO;
            if (scoreO >= MAX_SCORE) {
                winningMessageTextElement.innerText = `${currentClass} выиграл! Игра закончена!`
                clearTimeout(timeOut)
                resetScore();

            } else {
                winningMessageTextElement.innerText = `${currentClass} выиграл! Следующая игра`
                restartButton.style.backgroundColor = '#1a8fff'
            }
        }
    }
    winningMessageElement.classList.add('show');
}

// Функция с помощью мы будем устанавливать класс=hover для доски.
function setBoardHoverClass() {
    // board.classList.remove(X_CLASS);
    // board.classList.remove(O_CLASS);
    if (circleTurn) {
        board.classList.add(O_CLASS);
        board.classList.remove(X_CLASS)
    } else {
        board.classList.add(X_CLASS);
        board.classList.remove(O_CLASS);
    }
}

function resetScore() {
    resetTimeOut = setTimeout(() => {
        scoreO = 0
        scoreX = 0
        scoreXElement.innerText = scoreX
        scoreOElement.innerText = scoreO
    }, 1200)
}


function showModal(playerName, callback) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const title = document.createElement('h2');
    title.textContent = `Изменить имя`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите ваше имя';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';

    saveButton.addEventListener('click', () => {
        const newName = input.value;
        if (newName.trim() !== '') {
            modal.classList.remove('fadeIn');
            content.classList.remove('slideIn')
            modal.classList.add('fadeOut');
            content.classList.add('slideOut')
            setTimeout(() => {
                modal.remove();
                callback(newName);
            }, 350);
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Отменить';
    cancelButton.addEventListener('click', () => {
        modal.classList.remove('fadeIn');
        content.classList.remove('slideIn')
        modal.classList.add('fadeOut');
        content.classList.add('slideOut')
        setTimeout(() => {
            modal.remove();
        }, 350);
    });

    content.appendChild(title);
    content.appendChild(input);
    content.appendChild(saveButton);
    content.appendChild(cancelButton);

    modal.appendChild(content);

    requestAnimationFrame(() => {
        modal.classList.add('fadeIn');
        content.classList.add('slideIn')
    });
}

playerXName.addEventListener('click', () => {
    showModal(playerX, (newName) => {
        playerXName.textContent = newName;
    });
});

playerOName.addEventListener('click', () => {
    showModal(playerO, (newName) => {
        playerOName.textContent = newName;
    });
});





