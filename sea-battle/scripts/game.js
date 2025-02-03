// import { Board } from './board.js';
// import { Ship } from './ship.js';
//
// export class Game {
//     constructor() {
//         this.playerBoard = new Board(document.getElementById('player-board'), true);
//         this.computerBoard = new Board(document.getElementById('computer-board'), false);
//         this.ships = [];
//         this.playerWins = 0;
//         this.computerWins = 0;
//         this.lastMove = '';
//         this.targetShip = []; // Клетки корабля, который компьютер пытается уничтожить
//         this.invalidComputerShots = new Set(); // Клетки, куда нельзя ходить
//         this.isPlayerTurn = true; // Флаг, указывающий, чей сейчас ход
//         this.messageBox = document.getElementById('message-box'); // Элемент для временных сообщений
//         this.playerTurnMessage = document.getElementById('player-turn-message'); // Элемент для "Ваш ход!"
//         this.setupShips();
//         this.setupEventListeners();
//         this.setupResetButton();
//     }
//
//     setupShips() {
//         const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
//         this.ships = shipSizes.map(size => new Ship(size));
//         this.placeShips(this.playerBoard);
//         this.placeShips(this.computerBoard);
//     }
//
//     placeShips(board) {
//         const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
//         shipSizes.forEach(size => {
//             let placed = false;
//             while (!placed) {
//                 const row = Math.floor(Math.random() * 10);
//                 const col = Math.floor(Math.random() * 10);
//                 const horizontal = Math.random() > 0.5;
//                 if (this.canPlaceShip(row, col, size, horizontal, board)) {
//                     this.placeShip(row, col, size, horizontal, board);
//                     placed = true;
//                 }
//             }
//         });
//     }
//
//     canPlaceShip(row, col, size, horizontal, board) {
//         if (horizontal) {
//             if (col + size > 10) return false;
//             for (let i = -1; i <= size; i++) {
//                 for (let j = -1; j <= 1; j++) {
//                     const newRow = row + j;
//                     const newCol = col + i;
//                     if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
//                         const cell = board.getCell(newRow, newCol);
//                         if (cell.classList.contains('ship')) return false;
//                     }
//                 }
//             }
//         } else {
//             if (row + size > 10) return false;
//             for (let i = -1; i <= size; i++) {
//                 for (let j = -1; j <= 1; j++) {
//                     const newRow = row + i;
//                     const newCol = col + j;
//                     if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
//                         const cell = board.getCell(newRow, newCol);
//                         if (cell.classList.contains('ship')) return false;
//                     }
//                 }
//             }
//         }
//         return true;
//     }
//
//     placeShip(row, col, size, horizontal, board) {
//         if (horizontal) {
//             for (let i = 0; i < size; i++) {
//                 board.markShip(row, col + i);
//             }
//         } else {
//             for (let i = 0; i < size; i++) {
//                 board.markShip(row + i, col);
//             }
//         }
//     }
//
//     setupEventListeners() {
//         this.computerBoard.container.addEventListener('click', (event) => {
//             if (!this.isPlayerTurn) {
//                 console.log('Игрок не может ходить, сейчас ход компьютера.');
//                 return;
//             }
//             const cell = event.target;
//             if (cell.classList.contains('cell')) {
//                 const row = parseInt(cell.dataset.row);
//                 const col = parseInt(cell.dataset.col);
//                 console.log(`Игрок атакует клетку: ${this.getCellName(row, col)}`);
//                 this.handlePlayerMove(row, col);
//             }
//         });
//     }
//
//     setupResetButton() {
//         const resetButton = document.getElementById('reset-button');
//         resetButton.addEventListener('click', () => {
//             console.log('Игра сброшена.');
//             this.resetGame();
//         });
//     }
//
//     handlePlayerMove(row, col) {
//         const cell = this.computerBoard.getCell(row, col);
//         if (!cell || !cell.classList.contains('cell')) {
//             console.error(`Ячейка (${row}, ${col}) не найдена.`);
//             return;
//         }
//
//         if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
//             console.log(`Игрок уже атаковал клетку: ${this.getCellName(row, col)}`);
//             this.showMessage('Вы уже атаковали эту клетку!');
//             return;
//         }
//
//         const hit = cell.classList.contains('ship');
//         this.computerBoard.markCell(row, col, hit);
//         this.lastMove = `Игрок: ${this.getCellName(row, col)}`;
//         document.getElementById('last-move').textContent = this.lastMove;
//
//         if (hit) {
//             console.log(`Игрок попал в корабль на клетке: ${this.getCellName(row, col)}`);
//             cell.classList.add('hit');
//             if (this.isShipDestroyed(row, col, this.computerBoard)) {
//                 console.log(`Корабль игрока уничтожен на клетке: ${this.getCellName(row, col)}`);
//                 this.markShipAsDestroyed(row, col, this.computerBoard);
//             }
//             if (this.checkForWin(this.computerBoard)) {
//                 console.log('Игрок победил!');
//                 this.playerWins++;
//                 document.getElementById('player-wins').textContent = this.playerWins;
//
//
//                 setTimeout(() => {
//                     this.showMessage('Вы победили!');
//                     this.resetGame();
//                 }, 5000);
//
//
//
//                 // this.showMessage('Вы победили!');
//                 // this.resetGame();
//                 return;
//             }
//             this.showMessage('Вы попали! Ваш следующий ход.');
//         } else {
//             console.log(`Игрок промахнулся по клетке: ${this.getCellName(row, col)}`);
//             this.isPlayerTurn = false;
//             this.showMessage('Вы промахнулись. Ход компьютера.');
//             setTimeout(() => {
//                 console.log('Ход компьютера.');
//                 this.computerMove();
//             }, 1000);
//         }
//     }
//
//     computerMove() {
//         let row, col;
//
//         // Проверяем, есть ли цель для уничтожения корабля
//         if (this.targetShip.length > 0) {
//             console.log('Компьютер пытается уничтожить корабль.');
//             this.targetShip = this.targetShip.filter(
//                 ([r, c]) => !this.playerBoard.getCell(r, c).classList.contains('hit') &&
//                     !this.playerBoard.getCell(r, c).classList.contains('miss')
//             );
//             if (this.targetShip.length === 0) {
//                 console.log('Все клетки корабля уже атакованы, targetShip очищен.');
//             } else {
//                 const nextCell = this.targetShip[0]; // Берём первую доступную клетку
//                 [row, col] = nextCell;
//                 console.log(`Компьютер атакует клетку корабля: ${this.getCellName(row, col)}`);
//             }
//         }
//
//         // Если нет целей, выбираем случайную клетку
//         if (row === undefined || col === undefined) {
//             console.log('Компьютер выбирает случайную клетку для атаки.');
//
//             // Собираем все доступные клетки
//             const availableCells = [];
//             for (let r = 0; r < 10; r++) {
//                 for (let c = 0; c < 10; c++) {
//                     const cell = this.playerBoard.getCell(r, c);
//                     if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
//                         availableCells.push([r, c]);
//                     }
//                 }
//             }
//
//             if (availableCells.length === 0) {
//                 console.log('Нет доступных клеток для атаки. Игра завершена.');
//                 this.showMessage('Ничья! Все клетки атакованы.');
//                 this.resetGame();
//                 return;
//             }
//
//             // Выбираем случайную клетку из доступных
//             const randomIndex = Math.floor(Math.random() * availableCells.length);
//             [row, col] = availableCells[randomIndex];
//             console.log(`Компьютер атакует случайную клетку: ${this.getCellName(row, col)}`);
//         }
//
//         const cell = this.playerBoard.getCell(row, col);
//         if (!cell || !cell.classList.contains('cell')) {
//             console.error(`Ячейка (${row}, ${col}) не найдена.`);
//             return;
//         }
//
//         if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
//             console.log(`Компьютер уже атаковал клетку: ${this.getCellName(row, col)}`);
//             return;
//         }
//
//         const hit = cell.classList.contains('ship');
//         this.playerBoard.markCell(row, col, hit);
//         this.lastMove = `Компьютер: ${this.getCellName(row, col)}`;
//         document.getElementById('last-move').textContent = this.lastMove;
//
//         if (hit) {
//             console.log(`Компьютер попал в корабль на клетке: ${this.getCellName(row, col)}`);
//             const directions = [
//                 [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
//             ];
//             for (const [r, c] of directions) {
//                 if (r >= 0 && r < 10 && c >= 0 && c < 10) {
//                     if (!this.playerBoard.getCell(r, c).classList.contains('hit') &&
//                         !this.playerBoard.getCell(r, c).classList.contains('miss')) {
//                         this.targetShip.push([r, c]);
//                         console.log(`Добавлена клетка для атаки: ${this.getCellName(r, c)}`);
//                     }
//                 }
//             }
//             if (this.isShipDestroyed(row, col, this.playerBoard)) {
//                 console.log(`Корабль игрока уничтожен на клетке: ${this.getCellName(row, col)}`);
//                 this.markShipAsDestroyed(row, col, this.playerBoard);
//                 this.targetShip = [];
//             }
//             if (this.checkForWin(this.playerBoard)) {
//                 console.log('Компьютер победил!');
//                 this.computerWins++;
//                 document.getElementById('computer-wins').textContent = this.computerWins;
//
//
//
//
//                 setTimeout(() => {
//                     this.showMessage('Компьютер победил!');
//                     this.resetGame();
//                 }, 5000);
//
//
//
//
//
//
//                 // this.showMessage('Компьютер победил!');
//                 // this.resetGame();
//             } else {
//                 setTimeout(() => {
//                     console.log('Компьютер снова ходит.');
//                     this.computerMove();
//                 }, 2000);
//             }
//         } else {
//             console.log(`Компьютер промахнулся по клетке: ${this.getCellName(row, col)}`);
//             this.isPlayerTurn = true;
//             this.showPlayerTurnMessage(); // Показываем сообщение "Ваш ход!"
//         }
//     }
//
//     isShipDestroyed(row, col, board) {
//         const shipCells = this.findShipCells(row, col, board);
//         return shipCells.every(([r, c]) => board.getCell(r, c).classList.contains('hit'));
//     }
//
//     findShipCells(row, col, board) {
//         const cells = [];
//         const visited = new Set();
//         const search = (r, c) => {
//             if (r < 0 || r >= 10 || c < 0 || c >= 10) return;
//             if (visited.has(`${r},${c}`)) return;
//             visited.add(`${r},${c}`);
//             const cell = board.getCell(r, c);
//             if (cell.classList.contains('ship')) {
//                 cells.push([r, c]);
//                 search(r - 1, c);
//                 search(r + 1, c);
//                 search(r, c - 1);
//                 search(r, c + 1);
//             }
//         };
//         search(row, col);
//         return cells;
//     }
//
//     markShipAsDestroyed(row, col, board) {
//         const shipCells = this.findShipCells(row, col, board);
//         shipCells.forEach(([r, c]) => {
//             board.markDestroyed(r, c);
//         });
//         const directions = [
//             [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
//             [row - 1, col - 1], [row - 1, col + 1], [row + 1, col - 1], [row + 1, col + 1],
//         ];
//         for (const [r, c] of directions) {
//             if (r >= 0 && r < 10 && c >= 0 && c < 10) {
//                 this.invalidComputerShots.add(`${r},${c}`);
//                 console.log(`Клетка добавлена в invalidComputerShots: ${this.getCellName(r, c)}`);
//             }
//         }
//     }
//
//     getCellName(row, col) {
//         const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
//         return letters[col] + (row + 1);
//     }
//
//     checkForWin(board) {
//         for (let i = 0; i < 10; i++) {
//             for (let j = 0; j < 10; j++) {
//                 const cell = board.getCell(i, j);
//                 if (cell.classList.contains('ship') && !cell.classList.contains('hit')) {
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }
//
//     resetGame() {
//         this.playerBoard.container.innerHTML = '';
//         this.computerBoard.container.innerHTML = '';
//         this.playerBoard = new Board(document.getElementById('player-board'), true);
//         this.computerBoard = new Board(document.getElementById('computer-board'), false);
//         this.setupShips();
//         this.lastMove = '';
//         this.targetShip = [];
//         this.invalidComputerShots.clear();
//         this.isPlayerTurn = true;
//         document.getElementById('last-move').textContent = '';
//         console.log('Игра сброшена.');
//     }
//
//     showMessage(message) {
//         this.messageBox.textContent = message;
//         this.messageBox.style.display = 'block';
//         setTimeout(() => {
//             this.messageBox.style.display = 'none';
//         }, 3000);
//     }
//
//     showPlayerTurnMessage() {
//         this.playerTurnMessage.style.display = 'block';
//     }
//
//     hidePlayerTurnMessage() {
//         this.playerTurnMessage.style.display = 'none';
//     }
//
//     start() {
//         console.log('Игра началась!');
//     }
// }

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
        this.messageBox = document.getElementById('message-box'); // Элемент для временных сообщений
        this.playerTurnMessage = document.getElementById('player-turn-message'); // Элемент для "Ваш ход!"
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
            if (!this.isPlayerTurn) {
                console.log('Игрок не может ходить, сейчас ход компьютера.');
                return;
            }
            const cell = event.target;
            if (cell.classList.contains('cell')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                console.log(`Игрок атакует клетку: ${this.getCellName(row, col)}`);
                this.handlePlayerMove(row, col);
            }
        });
    }

    setupResetButton() {
        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', () => {
            console.log('Игра сброшена.');
            this.resetGame();
        });
    }

    handlePlayerMove(row, col) {
        const cell = this.computerBoard.getCell(row, col);
        if (!cell || !cell.classList.contains('cell')) {
            console.error(`Ячейка (${row}, ${col}) не найдена.`);
            return;
        }
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
            console.log(`Игрок уже атаковал клетку: ${this.getCellName(row, col)}`);
            this.showMessage('Вы уже атаковали эту клетку!');
            return;
        }
        const hit = cell.classList.contains('ship');
        this.computerBoard.markCell(row, col, hit);
        this.lastMove = `Игрок: ${this.getCellName(row, col)}`;
        document.getElementById('last-move').textContent = this.lastMove;

        if (hit) {
            console.log(`Игрок попал в корабль на клетке: ${this.getCellName(row, col)}`);
            cell.classList.add('hit');
            if (this.isShipDestroyed(row, col, this.computerBoard)) {
                console.log(`Корабль игрока уничтожен на клетке: ${this.getCellName(row, col)}`);
                this.markShipAsDestroyed(row, col, this.computerBoard);
            }
            if (this.checkForWin(this.computerBoard)) {
                console.log('Игрок победил!');
                this.playerWins++;
                document.getElementById('player-wins').textContent = this.playerWins;
                setTimeout(() => {
                    this.showMessage('Вы победили!');
                    this.resetGame();
                }, 5000);
                return;
            }
            this.showMessage('Вы попали! Ваш следующий ход.');
        } else {
            console.log(`Игрок промахнулся по клетке: ${this.getCellName(row, col)}`);
            this.isPlayerTurn = false;
            this.showMessage('Вы промахнулись. Ход компьютера.');
            setTimeout(() => {
                console.log('Ход компьютера.');
                this.computerMove();
            }, 1000);
        }
    }

    computerMove() {
        let row, col;

        // Проверяем, есть ли цель для уничтожения корабля
        if (this.targetShip.length > 0) {
            console.log('Компьютер пытается уничтожить корабль.');
            this.targetShip = this.targetShip.filter(
                ([r, c]) => !this.playerBoard.getCell(r, c).classList.contains('hit') &&
                    !this.playerBoard.getCell(r, c).classList.contains('miss')
            );
            if (this.targetShip.length === 0) {
                console.log('Все клетки корабля уже атакованы, targetShip очищен.');
            } else {
                const nextCell = this.targetShip[0]; // Берём первую доступную клетку
                [row, col] = nextCell;
                console.log(`Компьютер атакует клетку корабля: ${this.getCellName(row, col)}`);
            }
        }

        // Если нет целей, выбираем случайную клетку
        if (row === undefined || col === undefined) {
            console.log('Компьютер выбирает случайную клетку для атаки.');

            // Собираем все доступные клетки, исключая недопустимые
            const availableCells = [];
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    const cellKey = `${r},${c}`;
                    const cell = this.playerBoard.getCell(r, c);
                    if (
                        !cell.classList.contains('hit') &&
                        !cell.classList.contains('miss') &&
                        !this.invalidComputerShots.has(cellKey)
                    ) {
                        availableCells.push([r, c]);
                    }
                }
            }

            if (availableCells.length === 0) {
                console.log('Нет доступных клеток для атаки. Игра завершена.');
                this.showMessage('Ничья! Все клетки атакованы.');
                this.resetGame();
                return;
            }

            // Выбираем случайную клетку из доступных
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            [row, col] = availableCells[randomIndex];
            console.log(`Компьютер атакует случайную клетку: ${this.getCellName(row, col)}`);
        }

        const cell = this.playerBoard.getCell(row, col);
        if (!cell || !cell.classList.contains('cell')) {
            console.error(`Ячейка (${row}, ${col}) не найдена.`);
            return;
        }
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
            console.log(`Компьютер уже атаковал клетку: ${this.getCellName(row, col)}`);
            return;
        }

        const hit = cell.classList.contains('ship');
        this.playerBoard.markCell(row, col, hit);
        this.lastMove = `Компьютер: ${this.getCellName(row, col)}`;
        document.getElementById('last-move').textContent = this.lastMove;

        if (hit) {
            console.log(`Компьютер попал в корабль на клетке: ${this.getCellName(row, col)}`);
            const directions = [
                [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
            ];
            for (const [r, c] of directions) {
                if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                    if (!this.playerBoard.getCell(r, c).classList.contains('hit') &&
                        !this.playerBoard.getCell(r, c).classList.contains('miss')) {
                        this.targetShip.push([r, c]);
                        console.log(`Добавлена клетка для атаки: ${this.getCellName(r, c)}`);
                    }
                }
            }
            if (this.isShipDestroyed(row, col, this.playerBoard)) {
                console.log(`Корабль игрока уничтожен на клетке: ${this.getCellName(row, col)}`);
                this.markShipAsDestroyed(row, col, this.playerBoard);
                this.targetShip = [];
            }
            if (this.checkForWin(this.playerBoard)) {
                console.log('Компьютер победил!');
                this.computerWins++;
                document.getElementById('computer-wins').textContent = this.computerWins;
                setTimeout(() => {
                    this.showMessage('Компьютер победил!');
                    this.resetGame();
                }, 5000);
            } else {
                setTimeout(() => {
                    console.log('Компьютер снова ходит.');
                    this.computerMove();
                }, 2000);
            }
        } else {
            console.log(`Компьютер промахнулся по клетке: ${this.getCellName(row, col)}`);
            this.isPlayerTurn = true;
            this.showPlayerTurnMessage(); // Показываем сообщение "Ваш ход!"
        }
    }

    isShipDestroyed(row, col, board) {
        const shipCells = this.findShipCells(row, col, board);
        return shipCells.every(([r, c]) => board.getCell(r, c).classList.contains('hit'));
    }

    findShipCells(row, col, board) {
        const cells = [];
        const visited = new Set();
        const search = (r, c) => {
            if (r < 0 || r >= 10 || c < 0 || c >= 10) return;
            if (visited.has(`${r},${c}`)) return;
            visited.add(`${r},${c}`);
            const cell = board.getCell(r, c);
            if (cell.classList.contains('ship')) {
                cells.push([r, c]);
                search(r - 1, c);
                search(r + 1, c);
                search(r, c - 1);
                search(r, c + 1);
            }
        };
        search(row, col);
        return cells;
    }

    markShipAsDestroyed(row, col, board) {
        const shipCells = this.findShipCells(row, col, board);
        shipCells.forEach(([r, c]) => {
            board.markDestroyed(r, c);
        });

        // Добавляем все клетки вокруг корабля в invalidComputerShots
        shipCells.forEach(([r, c]) => {
            const directions = [
                [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
                [r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1],
            ];

            for (const [dr, dc] of directions) {
                if (dr >= 0 && dr < 10 && dc >= 0 && dc < 10) {
                    const cellKey = `${dr},${dc}`;
                    const cell = board.getCell(dr, dc);

                    // Добавляем клетку только если она еще не была атакована
                    if (
                        !cell.classList.contains('hit') &&
                        !cell.classList.contains('miss') &&
                        !this.invalidComputerShots.has(cellKey)
                    ) {
                        this.invalidComputerShots.add(cellKey);
                        console.log(`Клетка добавлена в invalidComputerShots: ${this.getCellName(dr, dc)}`);
                    }
                }
            }
        });
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
        this.isPlayerTurn = true;
        document.getElementById('last-move').textContent = '';
        console.log('Игра сброшена.');
    }

    showMessage(message) {
        this.messageBox.textContent = message;
        this.messageBox.style.display = 'block';
        setTimeout(() => {
            this.messageBox.style.display = 'none';
        }, 3000);
    }

    showPlayerTurnMessage() {
        this.playerTurnMessage.style.display = 'block';
    }

    hidePlayerTurnMessage() {
        this.playerTurnMessage.style.display = 'none';
    }

    start() {
        console.log('Игра началась!');
    }
}