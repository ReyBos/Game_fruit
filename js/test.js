window.onload = function() {
	var model = new Model(8, 8);	
	model.fillField();	

	view.displayField(model.field);

}
