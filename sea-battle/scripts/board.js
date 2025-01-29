export class Board {
    constructor(container, isPlayer) {
        this.container = container;
        this.isPlayer = isPlayer;
        this.cells = [];
        this.createBoard();
        this.addCoordinates(); // Добавляем координаты
    }

    createBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.cells.push(cell);
                this.container.appendChild(cell);
            }
        }
    }

    // Добавляем координаты на поле
    addCoordinates() {
        const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

        // Добавляем буквы для столбцов (сверху)
        for (let i = 0; i < 10; i++) {
            const colLabel = document.createElement('div');
            colLabel.className = 'coordinate-label col-label';
            colLabel.textContent = letters[i];
            colLabel.style.gridColumn = i + 2; // Буквы начинаются со второго столбца
            colLabel.style.gridRow = 1; // Буквы в первой строке
            this.container.appendChild(colLabel);
        }

        // Добавляем цифры для строк (слева)
        for (let i = 0; i < 11; i++) {
            const rowLabel = document.createElement('div');
            rowLabel.className = 'coordinate-label row-label';
            rowLabel.textContent = numbers[i];
            rowLabel.style.gridColumn = 1; // Цифры в первом столбце
            rowLabel.style.gridRow = i + 1;
            this.container.appendChild(rowLabel);
        }
    }

    getCell(row, col) {
        return this.cells.find(cell => cell.dataset.row == row && cell.dataset.col == col);
    }

    markCell(row, col, hit) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.classList.add(hit ? 'hit' : 'miss');
        }
    }

    markShip(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.classList.add('ship');
            if (this.isPlayer) {
                cell.classList.add('player');
            }
        }
    }

    markDestroyed(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.classList.add('destroyed');
            cell.style.backgroundColor = 'gray'; // Меняем цвет фона на серый при уничтожении корабля
        }
    }
}