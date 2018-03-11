window.onload = function() {
	var model = new Model(8, 8);	
	model.fillField();
	console.log(model);

	var myCanvas = document.getElementById("c1");
	var myContext = myCanvas.getContext('2d');
	var pic = document.getElementById("apple");
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {		
			myContext.drawImage(pic, model.field[i][j].position.x1, model.field[i][j].position.y1);	
		}
	}
}
