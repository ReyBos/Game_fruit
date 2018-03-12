// Одна ячейка игрового поля 
function Cell(startX1, startY1) {
	this.position = {x1: startX1, // текущее положение, левый верхний угол
					 y1: startY1, 
					 x2: -1,      // для предыдущего положения, левый верхний угол
					 y2: -1}
}

function CellContent(startX1, startY1, mayExplode, canBeMoved) {
	Cell.apply(this, arguments),
	this.mayExplode = mayExplode,
	this.canBeMoved = canBeMoved
}

function Fruit(startX1, startY1, mayExplode, canBeMoved, typeFruit) {
	CellContent.apply(this, arguments),
	this.typeFruit = typeFruit	
}

// Игровое поле
function Model(numberRows, numberCols, widthCell, heigthCell) {	
	this.field = [],       // Содержит объекты игрового поля
	this.rows = numberRows; // Число строк 
	this.cols = numberCols; // Число столбцов
	this.widthCell = widthCell; // ширина ячейки
	this.heigthCell = heigthCell; // высота ячейки

	// заполняет игровое поле случайными фруктами
	var startX1 = 0; // левый верхний угол игрового поля
	var startY1 = 0; // левый верхний угол игрового поля
	this.fillField = function() {
		for (var i = 0; i < this.rows; i++) {
			this.field[i] = [];
			for (var j = 0; j < this.cols; j++) {
				do {
					var typeFruit; // Название фрукта				
					var number = Math.floor(Math.random()*5); // определяем случайный фрукт
					switch(number) {
						case 0:
							typeFruit = "apple"; // яблоко
							break;
							case 1:
							typeFruit = "plum"; // слива
							break;
							case 2:
							typeFruit = "pear"; // груша
							break;
							case 3:
							typeFruit = "orange"; // апельсин
							break;
							case 4:
							typeFruit = "tomato"; // томат
							break;
					}				
					this.field[i][j] = new Fruit(startX1, startY1, true, true, typeFruit);
					var check = this.checkCell(i, j);
				} while (check[0] || check[2])
				startX1 += this.widthCell; // левый верхний угол каждой клетки
			}			
			startY1 += this.heigthCell; // левый верхний угол каждой клетки
			startX1 = 0;
		}
	},

	// метод для проверки не образует ли текущая ячейка горизонтальный или вертикальный ряд
	// из трех и более одинаковых объектов
	this.checkCell = function(coordRow, coordCol) {
		var horisontalCount = 1; // для подсчёта горизонтальных совпадений
		var verticalalCount = 1; // для подсчёта вертикальных совпадений
		var checkFruit = this.field[coordRow][coordCol].typeFruit; // какой фрукт в ячейке

		// проверяем соседние ячейки по горизонтали слева 
		for (var i = coordCol - 1; i >= 0; i--) {
			// Если соседняя ячейка не пустая, выполняется проверка
			if (this.field[coordRow][i]) {
				if (checkFruit === this.field[coordRow][i].typeFruit) {
					horisontalCount++;
				} else {
					break;
				}
			}
		}
		// проверяем соседние ячейки по горизонтали справа
		for (var i = coordCol + 1; i < this.field[0].length; i++) {
			if (this.field[coordRow][i]) {
				if (checkFruit === this.field[coordRow][i].typeFruit) {
					horisontalCount++;
				} else {
					break;
				}
			}
		}

		// проверяем соседние ячейки по вертикали вверх
		for (var j = coordRow - 1; j >= 0; j--) {
			// Если соседняя ячейка не пустая, выполняется проверка
			if (this.field[j][coordCol]) {
				if (checkFruit === this.field[j][coordCol].typeFruit) {
					verticalalCount++;
				} else {
					break;
				}
			}
		}
		// проверяем соседние ячейки по вертикали вниз
		for (var j = coordRow + 1; j < this.field.length; j++) {			
			if (this.field[j][coordCol]) {
				if (checkFruit === this.field[j][coordCol].typeFruit) {
					verticalalCount++;
				} else {
					break;
				}
			}
		}

		var result = [false, 1, false, 1];
		/* 
			result[0] = true - по горизонтали три или более одинаковых объекта подряд
			result[1] - количество одинаковых объектов по горизонтали
			result[2] = true - по вертикали три или более одинаковых объекта подряд
			result[3] - количество одинаковых объектов по вертикали
		*/

		if (horisontalCount >= 3) {
			result[0] = true;
			result[1] = horisontalCount;
		}
		if (verticalalCount >= 3) {
			result[2] = true;
			result[3] = verticalalCount;
		}

		return result;
	}
}

// Отображение игрового процесса
var view = {
	displayField: function(field) {
		var myCanvas = document.getElementById("c1");
		var ctx = myCanvas.getContext("2d");
		for (var i = 0; i < field.length; i++) {
			for (var j = 0; j < field[i].length; j++) {	
				var id = field[i][j].typeFruit;
				var pic = document.getElementById(id);			
				ctx.drawImage(pic, field[i][j].position.x1, field[i][j].position.y1);
			}
		}
	},
}