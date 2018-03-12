// Одна ячейка игрового поля 50х50
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
function Model(numberRows, numberCols) {	
	this.field = [],       // Содержит объекты игрового поля
	this.rows = numberRows; // Число строк 
	this.cols = numberCols; // Число столбцов

	// заполняет игровое поле случайными фруктами
	var startX1 = 0; // левый верхний угол игрового поля
	var startY1 = 0; // левый верхний угол игрового поля
	this.fillField = function() {
		for (var i = 0; i < this.rows; i++) {
			this.field[i] = [];
			for (var j = 0; j < this.cols; j++) {
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
				startX1 += 50; // левый верхний угол каждой клетки
			}			
			startY1 += 50; // левый верхний угол каждой клетки
			startX1 = 0;
		}
	}
}

// Отображение игрового процесс
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