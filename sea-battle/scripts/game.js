import { Board } from './board.js';
import { Ship } from './ship.js';

export class Game {
    constructor() {
        this.playerBoard = new Board(document.getElementById('player-board'), true);
        this.computerBoard = new Board(document.getElementById('computer-board'), false);
        this.ships = [];
        this.playerWins = 0;
        this.computerWins = 0;
        this.lastMove = '';
        this.targetShip = []; // Клетки корабля, который компьютер пытается уничтожить
        this.invalidComputerShots = new Set(); // Клетки, куда нельзя ходить
        this.isPlayerTurn = true; // Флаг, указывающий, чей сейчас ход
        this.messageBox = document.getElementById('message-box'); // Элемент для сообщений
        this.setupShips();
        this.setupEventListeners();
        this.setupResetButton();
    }

    setupShips() {
        const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        this.ships = shipSizes.map(size => new Ship(size));
        this.placeShips(this.playerBoard);
        this.placeShips(this.computerBoard);
    }

    placeShips(board) {
        const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        shipSizes.forEach(size => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const horizontal = Math.random() > 0.5;
                if (this.canPlaceShip(row, col, size, horizontal, board)) {
                    this.placeShip(row, col, size, horizontal, board);
                    placed = true;
                }
            }
        });
    }

    canPlaceShip(row, col, size, horizontal, board) {
        if (horizontal) {
            if (col + size > 10) return false;
            for (let i = -1; i <= size; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + j;
                    const newCol = col + i;
                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                        const cell = board.getCell(newRow, newCol);
                        if (cell.classList.contains('ship')) return false;
                    }
                }
            }
        } else {
            if (row + size > 10) return false;
            for (let i = -1; i <= size; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                        const cell = board.getCell(newRow, newCol);
                        if (cell.classList.contains('ship')) return false;
                    }
                }
            }
        }
        return true;
    }

    placeShip(row, col, size, horizontal, board) {
        if (horizontal) {
            for (let i = 0; i < size; i++) {
                board.markShip(row, col + i);
            }
        } else {
            for (let i = 0; i < size; i++) {
                board.markShip(row + i, col);
            }
        }
    }

    setupEventListeners() {
        this.computerBoard.container.addEventListener('click', (event) => {
            if (!this.isPlayerTurn) return; // Игрок не может ходить, если ход компьютера

            const cell = event.target;
            if (cell.classList.contains('cell')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.handlePlayerMove(row, col);
            }
        });
    }

    setupResetButton() {
        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    }

    handlePlayerMove(row, col) {
        const cell = this.computerBoard.getCell(row, col);

        // Проверяем, была ли клетка уже атакована
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
            this.showMessage('Вы уже атаковали эту клетку!');
            return; // Не завершаем ход игрока, он должен выбрать другую клетку
        }

        const hit = cell.classList.contains('ship');
        this.computerBoard.markCell(row, col, hit);
        this.lastMove = `Игрок: ${this.getCellName(row, col)}`;
        document.getElementById('last-move').textContent = this.lastMove;

        if (hit) {
            if (this.isShipDestroyed(row, col, this.computerBoard)) {
                this.markShipAsDestroyed(row, col, this.computerBoard); // Корабль компьютера уничтожен
            }

            if (this.checkForWin(this.computerBoard)) {
                this.playerWins++;
                document.getElementById('player-wins').textContent = this.playerWins;
                this.showMessage('Вы победили!');
                this.resetGame();
                return;
            }

            // Ход остаётся у игрока, если он попал
            this.showMessage('Вы попали! Ваш следующий ход.');
        } else {
            // Если игрок промахнулся, передаём ход компьютеру
            this.isPlayerTurn = false; // Блокируем ход игрока
            this.showMessage('Вы промахнулись. Ход компьютера.');
            setTimeout(() => {
                this.computerMove();
            }, 1000); // Задержка 2 секунды перед ходом компьютера
        }
    }

    computerMove() {
        let row, col;

        // Если есть корабль, который компьютер пытается уничтожить
        if (this.targetShip.length > 0) {
            const nextCell = this.targetShip.find(
                ([r, c]) => !this.playerBoard.getCell(r, c).classList.contains('hit')
            );

            if (nextCell) {
                [row, col] = nextCell;
            } else {
                this.targetShip = [];
            }
        }

        // Если не нашли клетку корабля, выбираем случайную
        if (row === undefined || col === undefined) {
            do {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
            } while (
                this.playerBoard.getCell(row, col).classList.contains('hit') ||
                this.playerBoard.getCell(row, col).classList.contains('miss') ||
                this.invalidComputerShots.has(`${row},${col}`)
                );
        }

        const cell = this.playerBoard.getCell(row, col);

        // Проверяем, была ли клетка уже атакована
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
            return; // Пропускаем ход, если клетка уже атакована
        }

        const hit = cell.classList.contains('ship');
        this.playerBoard.markCell(row, col, hit);
        this.lastMove = `Компьютер: ${this.getCellName(row, col)}`;
        document.getElementById('last-move').textContent = this.lastMove;

        if (hit) {
            // Если компьютер попал, добавляем соседние клетки в targetShip
            const directions = [
                [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
            ];

            for (const [r, c] of directions) {
                if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                    if (!this.playerBoard.getCell(r, c).classList.contains('hit') &&
                        !this.playerBoard.getCell(r, c).classList.contains('miss')) {
                        this.targetShip.push([r, c]);
                    }
                }
            }

            if (this.isShipDestroyed(row, col, this.playerBoard)) {
                this.markShipAsDestroyed(row, col, this.playerBoard); // Корабль игрока уничтожен
                this.targetShip = []; // Очищаем targetShip, так как корабль уничтожен
            }

            if (this.checkForWin(this.playerBoard)) {
                this.computerWins++;
                document.getElementById('computer-wins').textContent = this.computerWins;
                this.showMessage('Компьютер победил!');
                this.resetGame();
            } else {
                // Если компьютер попал, он ходит снова
                setTimeout(() => {
                    this.computerMove();
                }, 2000); // Задержка 2 секунды перед следующим ходом компьютера
            }
        } else {
            // Если компьютер промахнулся, передаём ход игроку
            this.isPlayerTurn = true; // Разблокируем ход игрока
        }
    }

    isShipDestroyed(row, col, board) {
        const shipCells = this.findShipCells(row, col, board);
        return shipCells.every(([r, c]) => board.getCell(r, c).classList.contains('hit'));
    }

    findShipCells(row, col, board) {
        const cells = [];
        const visited = new Set(); // Чтобы избежать повторного посещения клеток

        const search = (r, c) => {
            if (r < 0 || r >= 10 || c < 0 || c >= 10) return; // Выход за пределы поля
            if (visited.has(`${r},${c}`)) return; // Уже посещали эту клетку

            visited.add(`${r},${c}`); // Помечаем клетку как посещённую

            const cell = board.getCell(r, c);
            if (cell.classList.contains('ship')) {
                cells.push([r, c]); // Добавляем клетку корабля

                // Рекурсивно ищем соседние клетки корабля
                search(r - 1, c); // Вверх
                search(r + 1, c); // Вниз
                search(r, c - 1); // Влево
                search(r, c + 1); // Вправо
            }
        };

        search(row, col); // Начинаем поиск с заданной клетки
        return cells;
    }

    markShipAsDestroyed(row, col, board) {
        const shipCells = this.findShipCells(row, col, board);
        shipCells.forEach(([r, c]) => {
            board.markDestroyed(r, c); // Меняем цвет фона на серый при уничтожении корабля
        });

        // Добавляем соседние клетки в список "непригодных для хода"
        const directions = [
            [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1], // По горизонтали и вертикали
            [row - 1, col - 1], [row - 1, col + 1], [row + 1, col - 1], [row + 1, col + 1], // По диагонали
        ];

        for (const [r, c] of directions) {
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                this.invalidComputerShots.add(`${r},${c}`);
            }
        }
    }

    getCellName(row, col) {
        const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
        return letters[col] + (row + 1);
    }

    checkForWin(board) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = board.getCell(i, j);
                if (cell.classList.contains('ship') && !cell.classList.contains('hit')) {
                    return false;
                }
            }
        }
        return true;
    }

    resetGame() {
        this.playerBoard.container.innerHTML = '';
        this.computerBoard.container.innerHTML = '';
        this.playerBoard = new Board(document.getElementById('player-board'), true);
        this.computerBoard = new Board(document.getElementById('computer-board'), false);
        this.setupShips();
        this.lastMove = '';
        this.targetShip = [];
        this.invalidComputerShots.clear();
        this.isPlayerTurn = true; // Сбрасываем флаг хода
        document.getElementById('last-move').textContent = '';
    }

    showMessage(message) {
        this.messageBox.textContent = message; // Отображаем сообщение
        this.messageBox.style.display = 'block'; // Показываем элемент

        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            this.messageBox.style.display = 'none'; // Скрываем сообщение
        }, 3000);
    }

    start() {
        console.log('Игра началась!');
    }
}