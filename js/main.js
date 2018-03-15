// Одна ячейка игрового поля 
function Cell(startX1, startY1) {
	this.position = {x1: startX1, // текущее положение, левый верхний угол
					 y1: startY1}
}

function CellContent(startX1, startY1, mayExplode, canBeMoved) {
	Cell.apply(this, arguments),
	this.mayExplode = mayExplode, // может объединятся в ряд
	this.canBeMoved = canBeMoved  // можно передвигать 
}

function Fruit(startX1, startY1, mayExplode, canBeMoved, typeFruit) {
	CellContent.apply(this, arguments),
	this.typeFruit = typeFruit	
}

// Игровое поле
function Model(numberRows, numberCols, widthCell, heightCell) {	
	this.field = [],       // Содержит объекты игрового поля
	this.rows = numberRows, // Число строк 
	this.cols = numberCols, // Число столбцов
	this.widthCell = widthCell, // ширина ячейки !!! widthCell === heightCell !!!
	this.heightCell = heightCell, // высота ячейки
	this.canGoOn = true; // разрешает выполнение хода игрока

	// заполняет игровое поле случайными фруктами
	this.fillField = function() {
		var startX1 = 0; // левый верхний угол игрового поля
		var startY1 = 0; // левый верхний угол игрового поля
		for (var i = 0; i < this.rows; i++) {
			this.field[i] = [];
			for (var j = 0; j < this.cols; j++) {
				do {
					var typeFruit = this.randomFruit(); // Генерируем случайный фрукт
					this.field[i][j] = new Fruit(startX1, startY1, true, true, typeFruit);
					var check = this.checkCell(i, j);
				} while (check[0] || check[2])
				startX1 += this.widthCell; // левый верхний угол каждой клетки
			}			
			startY1 += this.heightCell; // левый верхний угол каждой клетки
			startX1 = 0;
		}
	},

	// генерирует случайный фрукт
	this.randomFruit = function() {
		var typeFruit; // Название фрукта				
		var number = Math.floor(Math.random()*5); 
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
		return typeFruit;
	},

	// метод для проверки не образует ли текущая ячейка горизонтальный или вертикальный ряд
	// из трех и более одинаковых объектов
	this.checkCell = function(coordRow, coordCol) {
		var horisontalCount = 1; // для подсчёта горизонтальных совпадений
		var fruitRow = coordRow;
		var FruitCol = coordCol;
		// первый в горизонтальной комбинации фрукт		
		var leftFruitCol; // номер столбца
		// последний в горизонтальной комбинации фрукт	
		var rightFruitCol; // номер столбца
		var verticalalCount = 1; // для подсчёта вертикальных совпадений
		// первый в вертикальной комбинации фрукт
		var topFruitRow; // номер строки		
		// последний в вертикальной комбинации фрукт
		var bottomFruitRow; // номер строки		


		var checkFruit = this.field[coordRow][coordCol].typeFruit; // какой фрукт в ячейке		
		// проверяем соседние ячейки по горизонтали слева 
		if (coordCol !== 0) {
			for (var i = coordCol - 1; i >= 0; i--) {
				// Если соседняя ячейка не пустая, выполняется проверка
				if (this.field[coordRow][i]) {
					if (checkFruit === this.field[coordRow][i].typeFruit) {
						horisontalCount++;
						leftFruitCol = i;					
					} else {
						leftFruitCol = i + 1;					
						break;
					}
				}
			}
		} else {
			leftFruitCol = 0;
		}
		// проверяем соседние ячейки по горизонтали справа
		if (coordCol !== (this.field[0].length - 1)) {
			for (var i = coordCol + 1; i < this.field[0].length; i++) {
				if (this.field[coordRow][i]) {
					if (checkFruit === this.field[coordRow][i].typeFruit) {
						horisontalCount++;
						rightFruitCol = i;						
					} else {
						rightFruitCol = i - 1;
						break;
					}
				}
			}
		} else {
			rightFruitCol = this.field[0].length - 1;
		}
		// проверяем соседние ячейки по вертикали вверх
		if (coordRow !== 0) {
			for (var j = coordRow - 1; j >= 0; j--) {
				// Если соседняя ячейка не пустая, выполняется проверка
				if (this.field[j][coordCol]) {
					if (checkFruit === this.field[j][coordCol].typeFruit) {
						verticalalCount++;
						topFruitRow = j;
					} else {
						topFruitRow = j + 1;
						break;
					}
				}
			}
		} else {
			topFruitRow = 0;
		}
		// проверяем соседние ячейки по вертикали вниз
		if (coordRow !== (this.field.length - 1)) {
			for (var j = coordRow + 1; j < this.field.length; j++) {			
				if (this.field[j][coordCol]) {
					if (checkFruit === this.field[j][coordCol].typeFruit) {
						verticalalCount++;
						bottomFruitRow = j;
					} else {
						bottomFruitRow = j - 1;
						break;
					}
				}
			} 
		} else {
				bottomFruitRow = this.field.length - 1;
		}

		var result = [false, 1, false, 1, leftFruitCol, rightFruitCol, fruitRow, topFruitRow, bottomFruitRow, FruitCol];
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
	}, 

	// Ячейки меняются местами
	this.swapCell = function(activeRow, activeCol, clickRow, clickCol) {
		var activeCell = this.field[activeRow][activeCol];
		var clickCell = this.field[clickRow][clickCol];			
		// После перерисовки меняем местами объекты в таблице field		
		var obj = this.field[activeRow][activeCol];
		var objPosX1 = this.field[activeRow][activeCol].position.x1;
		var objPosY1 = this.field[activeRow][activeCol].position.y1;		
		this.field[activeRow][activeCol].position.x1 = this.field[clickRow][clickCol].position.x1;
		this.field[activeRow][activeCol].position.y1 = this.field[clickRow][clickCol].position.y1;
		this.field[activeRow][activeCol] = this.field[clickRow][clickCol];		
		this.field[clickRow][clickCol].position.x1 = objPosX1;
		this.field[clickRow][clickCol].position.y1 = objPosY1;
		this.field[clickRow][clickCol] = obj;
	}, 

	// Список ячеек к удалению
	// содержит массивы типа [row, col] - указывающие какую ячейку в field нужно удалить
	this.whichCellDell = [],

	// Заполняем список к удалению
	this.fillWhichCellDell = function(result1, result2) {					
		//		        0   1    2    3        4            5            6          7             8              9
		// result = [false, 1, false, 1, leftFruitCol, rightFruitCol, fruitRow, topFruitRow, bottomFruitRow, FruitCol] (см. выше)
		// каждый result содержит информацию о том, какие промежутки ячеек нужно удалить, 
		// leftFruitCol - начало строки, rightFruitCol - конец строки, fruitRow - номер строки
		// topFruitRow - начало столбца, bottomFruitRow - конец столбца, FruitCol - номер столбца
		if (result1[0]) {
			for (var i = result1[4]; i <= result1[5]; i++) {
				if (checkCell(this.whichCellDell, [result1[6], i])) {
					this.whichCellDell.push([result1[6], i]);
				}				
			}
		}
		if (result1[2]) {
			for (var i = result1[7]; i <= result1[8]; i++) {
				if (checkCell(this.whichCellDell, [i, result1[9]])) {
					this.whichCellDell.push([i, result1[9]]);
				}				
			}
		}
		if (result2[0]) {
			for (var i = result2[4]; i <= result2[5]; i++) {
				if (checkCell(this.whichCellDell, [result2[6], i])) {
					this.whichCellDell.push([result2[6], i]);
				}				
			}
		}
		if (result2[2]) {
			for (var i = result2[7]; i <= result2[8]; i++) {
				if (checkCell(this.whichCellDell, [i, result2[9]])) {
					this.whichCellDell.push([i, result2[9]]);
				}				
			}
		}

		// проверяет есть ли такие данные в массиве, если нет возвращает true
		function checkCell(array, content) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][0] === content[0] && array[i][1] === content[1]) {
				return false;					
				}
			}
			return true;
		}		
	},

	// заменяет фрукты из field по списку whichCellDell
	this.dellFruitFromField = function() {
		for (var i = 0; i < this.whichCellDell.length; i++) {
			var row = this.whichCellDell[i][0];
			var col = this.whichCellDell[i][1];
			this.field[row][col].typeFruit = "";
		}
	}, 

	// ставим новый фрукт на место удаленного
	this.newFruit = function() {
		for (var i = 0; i < this.whichCellDell.length; i++) {
			var row = this.whichCellDell[i][0];
			var col = this.whichCellDell[i][1];
			do {
				this.field[row][col].typeFruit = this.randomFruit();
				var check = this.checkCell(row, col);
			} while (check[0] || check[2]);			
		}		
	}
}

// Отображение игрового процесса
var view = {
	// Отображает все поле 
	displayField: function(field, context) {		
		for (var i = 0; i < field.length; i++) {
			for (var j = 0; j < field[i].length; j++) {	
				var id = field[i][j].typeFruit;
				var pic = document.getElementById(id);			
				context.drawImage(pic, field[i][j].position.x1, field[i][j].position.y1);
			}
		}
	},

	// Выделяет или снимает выделение с ячейки по которой кликнули
	activeInactiveCell: function(row, col, active, model, context) {	
		var x = model.field[row][col].position.x1; // левый верхний угол
		var y = model.field[row][col].position.y1; // левый верхний угол
		var width = model.widthCell;
		var height = model.heightCell;
		if (model.field[row][col].canBeMoved && !active) {
			// если нет активных ячеек
			context.beginPath(); 			
			context.strokeStyle = "black";
			context.lineWidth = "1";
			context.rect(x + 1, y + 1, width - 2, height - 2);
			context.stroke();
		} else {
			// если ячейка по которой кликнули активна, снимаем выделение
			context.beginPath(); 
			context.clearRect(x, y, width, height);
			var id = model.field[row][col].typeFruit;			
			var pic = document.getElementById(id);			
			context.drawImage(pic, x, y)
		}
	}, 
}

var gameStart = false;
var myCanvas = document.getElementById("c1");
var ctx = myCanvas.getContext("2d");
var model = new Model(8, 8, 50, 50);
var active = false; // ни одна ячейка не активна
// Номер строки и столбца активной ячейки
var activeRow = -1;
var activeCol = -1;

// Кнопка New Game
var newGame = document.getElementById("new-game");
newGame.onclick = function() {	
	gameStart = true;	
	ctx.clearRect(0, 0, 400, 400);
	ctx.beginPath(); 			
	model.fillField();	
	view.displayField(model.field, ctx);
	active = false;
	activeRow = -1;
	activeCol = -1;
}

// Кнопка Rulles
var rules = document.getElementById("rules");
rules.onclick = function() {
	var description = document.getElementById("description");
	if (description.classList.contains("hidden")) {
		description.classList.remove("hidden");
		description.classList.add("visible");
	} else {
		description.classList.remove("visible");
		description.classList.add("hidden");
	}
}

// Запрет контекстного меню на игровом поле 
myCanvas.oncontextmenu = function() {
	return false;
}

// Нажата левая кнопка мыши на игровом поле 
myCanvas.onclick = function(e) {
	if (gameStart && model.canGoOn) {		
		// Номер нажатой строки	
		var clickRow = Math.floor(e.offsetY / model.heightCell);
		// Номер нажатого столбца		
		var clickCol = Math.floor(e.offsetX / model.widthCell);
		// Выполняем действие если ячейку можно переместить
		if (model.field[clickRow][clickCol].canBeMoved) {			
			if (!active && activeRow === -1 && activeCol === -1) {
				// если нет активных ячеек то выделяем ту по которой кликнули	
				ctx.beginPath();
				view.activeInactiveCell(clickRow, clickCol, active, model, ctx);		
				activeRow = clickRow;
				activeCol = clickCol;
				active = true;
			} else if (active) {
				// если на поле есть активная ячейка
				if (clickRow === activeRow && clickCol === activeCol) {
					// если активна ячейка по которой кликнули, снимаем выделение с нее
					ctx.beginPath();
					view.activeInactiveCell(clickRow, clickCol, active, model, ctx);
					activeRow = -1;
					activeCol = -1;
					active = false;
				} else if ((clickRow === activeRow && Math.abs(clickCol - activeCol) === 1) || (clickCol === activeCol && Math.abs(clickRow - activeRow) === 1) ) {
					// Если кликнули по ячейке соседней по горизонтали или вертикали с активной 
					swapSettings.fillSwapSettings(model, activeRow, activeCol, clickRow, clickCol);
					model.swapCell(activeRow, activeCol, clickRow, clickCol);
					// Проверяем образуется ли ряд из трех одинаковых фруктов после перестановки
					var swapResult1 = model.checkCell(activeRow, activeCol);
					swapSettings.result1 = swapResult1;
					var swapResult2 = model.checkCell(clickRow, clickCol);
					swapSettings.result2 = swapResult2;
					// Образуется ли комбинация, если нет, фрукты нужно переместить на место
					swapSettings.result = (swapResult1[0] || swapResult1[2] || swapResult2[0] || swapResult2[2]);
					if (swapResult1[0] || swapResult1[2] || swapResult2[0] || swapResult2[2]) {
						// Если комбинация образуется					
						swap();							
					} else {
						// Если комбинация не образуется то возвращаем фрукты на место
						swap();
						model.swapCell(activeRow, activeCol, clickRow, clickCol);
					}	
					activeRow = -1;
					activeCol = -1;
					active = false;
				} else {
					// Если клинкнули по удаленной от активной ячейке или расположенной по диагонали, то снимаем выделение с текущей активной
					ctx.beginPath();
					view.activeInactiveCell(activeRow, activeCol, active, model, ctx);
					active = false;
					// Активной назначаем ячейку по которой кликнули
					activeRow = clickRow;
					activeCol = clickCol;
					ctx.beginPath();
					view.activeInactiveCell(activeRow, activeCol, active, model, ctx);
					active = true;
				}
			}
		}
	}	
}

// Данные для обмена фруктов местами
var swapSettings = {	
	fillSwapSettings: function(model, activeRow, activeCol, clickRow, clickCol) {
		var activeCell = model.field[activeRow][activeCol];
		var clickCell = model.field[clickRow][clickCol];	
		// заполняем данные для обмена
		swapSettings.width = model.widthCell;
		swapSettings.height = model.heightCell;				
		if (activeCell.position.x1 < clickCell.position.x1 || activeCell.position.y1 < clickCell.position.y1) {
			// если обмен идет с ячейкой расположенной справа или снизу от активной, то активная считается под номером 1
			swapSettings.x1 = activeCell.position.x1;
			swapSettings.y1 = activeCell.position.y1;
			swapSettings.pic1 = document.getElementById(activeCell.typeFruit);
			swapSettings.x2 = clickCell.position.x1;
			swapSettings.y2 = clickCell.position.y1;
			swapSettings.pic2 = document.getElementById(clickCell.typeFruit);
			swapSettings.x = clickCell.position.x1;
			swapSettings.y = clickCell.position.y1;
		} else {
			// если обмен идет с ячейкой расположенной слева или сверху от активной, то активная считается под номером 2
			swapSettings.x2 = activeCell.position.x1;
			swapSettings.y2 = activeCell.position.y1;
			swapSettings.pic2 = document.getElementById(activeCell.typeFruit);
			swapSettings.x1 = clickCell.position.x1;
			swapSettings.y1 = clickCell.position.y1;
			swapSettings.pic1 = document.getElementById(clickCell.typeFruit);
			swapSettings.x = activeCell.position.x1;
			swapSettings.y = activeCell.position.y1;
		}	
	},	
}
// анимация обмена местами фруктов
function swap() {
	model.canGoOn = false;  // запрещает продолжение программы пока анимация не будет закончена
	ctx.clearRect(swapSettings.x1, swapSettings.y1, swapSettings.width, swapSettings.height);
	ctx.clearRect(swapSettings.x2, swapSettings.y2, swapSettings.width, swapSettings.height);
	ctx.beginPath();
	ctx.drawImage(swapSettings.pic1, swapSettings.x1, swapSettings.y1);
	ctx.drawImage(swapSettings.pic2, swapSettings.x2, swapSettings.y2);
	if (swapSettings.y1 === swapSettings.y2) {
		//перемещение по горизонтали
		swapSettings.x1 += 2;
		swapSettings.x2 -= 2;
		if (swapSettings.x1 <= swapSettings.x) {
			requestAnimationFrame(swap);
		} 
		// последеним шагом мы делаем лишнее изменение х1 и х2, откатываем их и при необходимости меняем фрукты обратно местами
		if (swapSettings.x1 > swapSettings.x) {
			swapSettings.x1 -= 2;
			swapSettings.x2 += 2;
			if(!(swapSettings.result)) {
				// если комбинация не образуется возвращаем фрукты на место				
				reverseSwap();
			} else {
				// в проивном случае формируем список к удалению фруктов, предварительно его очистив
				model.whichCellDell.length = 0;				
				model.fillWhichCellDell(swapSettings.result1, swapSettings.result2);
				// после составления списка заполняем данные для анимации удаления				
				dellComboFruitSettings.filldellComboFruitSettings(model);
			}
		}	
	} else if (swapSettings.x1 === swapSettings.x2) {
		//перемещение по вертикали
		swapSettings.y1 += 2;
		swapSettings.y2 -= 2;
		if (swapSettings.y1 <= swapSettings.y) {
			requestAnimationFrame(swap);
		} 
		// последеним шагом мы делаем лишнее изменение у1 и у2, откатываем их и при необходимости меняем фрукты обратно местами
		if (swapSettings.y1 > swapSettings.y) {
			swapSettings.y1 -= 2;
			swapSettings.y2 += 2;
			if (!(swapSettings.result)) {
				// если комбинация не образуется возвращаем фрукты на место
				reverseSwap();
			} else {
				// в проивном случае формируем список к удалению фруктов, предварительно его очистив	
				model.whichCellDell.length = 0;					
				model.fillWhichCellDell(swapSettings.result1, swapSettings.result2); 
				// после составления списка заполняем данные для анимации удаления				
				dellComboFruitSettings.filldellComboFruitSettings(model); 
			}
		}	
	}
}

// анимация обратного обмена местами фруктов
function reverseSwap() {
	ctx.clearRect(swapSettings.x1, swapSettings.y1, swapSettings.width, swapSettings.height);
	ctx.clearRect(swapSettings.x2, swapSettings.y2, swapSettings.width, swapSettings.height);
	ctx.beginPath();
	ctx.drawImage(swapSettings.pic1, swapSettings.x1, swapSettings.y1);
	ctx.drawImage(swapSettings.pic2, swapSettings.x2, swapSettings.y2);
	if (swapSettings.y1 === swapSettings.y2) {
		//перемещение по горизонтали
		swapSettings.x1 -= 2;
		swapSettings.x2 += 2;
		if (swapSettings.x2 <= swapSettings.x) {
			requestAnimationFrame(reverseSwap);
		} 
		// послденим шагом мы делаем лишнее изменение х1 и х2, откатываем их
		if (swapSettings.x2 > swapSettings.x) {
			swapSettings.x1 += 2;
			swapSettings.x2 -= 2;	
			model.canGoOn = true; // разрешает продолжение программы
		}
	} else if (swapSettings.x1 === swapSettings.x2) {
		//перемещение по вертикали
		swapSettings.y1 -= 2;
		swapSettings.y2 += 2;
		if (swapSettings.y2 <= swapSettings.y) {			
			requestAnimationFrame(reverseSwap);
		} 
		// послденим шагом мы делаем лишнее изменение х1 и х2, откатываем их
		if (swapSettings.y2 > swapSettings.y) {
			swapSettings.y1 += 2;
			swapSettings.y2 -= 2;
			model.canGoOn = true; // разрешает продолжение программы		
		}
	}	
}

// Данные для удаления фруктов (и отрисовки новых)
var dellComboFruitSettings = {	
	array: [],
	// заполняет данные для удаления
	filldellComboFruitSettings: function(model) {
		this.array.length = 0; 
		this.startY = 0; // счетчик движения вниз по y
		this.step = 2; // шаг движения вниз
		this.numberCells = model.whichCellDell.length;
		this.field = model.field;
		this.width = model.widthCell; // шириная ячейки игрового поля
		this.height = model.heightCell; // высота	
		this.startYUp = this.height;	// счетчик движения вверх по y
		this.heightUp = 0; // для displayNewFruit()
		// перебираем удаляемые ячейки и для каждой создаем объект с нужными параметрами для удаления
		for (var i = 0; i < this.numberCells; i++) {			
			this.array[i] = {};				
			// расположение стираемого фрукта в field
			this.array[i].row = model.whichCellDell[i][0];			
			this.array[i].col = model.whichCellDell[i][1];			
			// начальные координаты ячейки стираемого фрукта			
			this.array[i].x = this.field[this.array[i].row][this.array[i].col].position.x1;
			this.array[i].y = this.field[this.array[i].row][this.array[i].col].position.y1;
			// изображение удаляемого фрукта
			this.array[i].picId = this.field[this.array[i].row][this.array[i].col].typeFruit;
			this.array[i].pic = document.getElementById(this.array[i].picId);				
		}
		dellComboFruit(); // После того как заполнили необходимые данные вызываем анимацию удаления
	},

	// Заменяет удаленные фрукты на новые
	placeNewFruit: function() {
		for (var i = 0; i < this.numberCells; i++) {
			this.array[i].picId = this.field[this.array[i].row][this.array[i].col].typeFruit;
			this.array[i].pic = document.getElementById(this.array[i].picId);
		}	
		// отображаем их
		displayNewFruit();
	}
}

// анимация удаления фруктов с поля
function dellComboFruit() {			
	var array = dellComboFruitSettings.array;
	var obj = dellComboFruitSettings;
	for (var i = 0; i < array.length; i++) {	
		ctx.clearRect(array[i].x, array[i].y, obj.width, obj.height);
		ctx.beginPath();		
		ctx.drawImage(array[i].pic, 0, 0, obj.width, obj.height, array[i].x, array[i].y, obj.width, obj.height);	
		array[i].y += obj.step;		
	}
	obj.height -= obj.step;		
	obj.startY += obj.step;	
	if (obj.startY <= obj.width) { // width потому что height постоянно меняется, а изначально они равны
		requestAnimationFrame(dellComboFruit);
	}
	if (obj.startY > obj.width) {	
		obj.height = model.heightCell;
		for (var i = 0; i < array.length; i++) {
			array[i].y -= (obj.step + obj.width); // возвращаем у в левый верхний угол
		}
		// после окончания анимации удаляем фрукты из игрового поля field		
		model.dellFruitFromField();
		model.newFruit();
		dellComboFruitSettings.placeNewFruit();
	}
}


// Отображает новые фрукты взамен удаленных
function displayNewFruit() {	
	var array = dellComboFruitSettings.array;
	var obj = dellComboFruitSettings;		
	for (var i = 0; i < array.length; i++) {		
		ctx.clearRect(array[i].x, array[i].y, obj.width, obj.height);
		ctx.beginPath();		
		ctx.drawImage(array[i].pic, 0, 0, obj.width, obj.heightUp, array[i].x, array[i].y+obj.startYUp, obj.width, obj.heightUp);
	}
	obj.startYUp -= obj.step;	
	obj.heightUp += obj.step;	
	if (obj.startYUp >= 0) { // width потому что height постоянно меняется, а изначально они равны	
		requestAnimationFrame(displayNewFruit);
	}
	if (obj.startYUp < 0) {
		model.canGoOn = true;  // разрешает продолжение программы
	}
}