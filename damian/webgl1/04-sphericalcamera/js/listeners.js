function onSliderRotation(slider, labelId) {
	angle = parseFloat(slider.value);
	writeValue(labelId, angle);
	onRender();
}

function onSliderScale(slider, labelId) {
	scale = parseFloat(slider.value);
	writeValue(labelId, scale);
	onRender();
}

function onModelLoad(event) {
	let objFileContent = event.target.result;
	parsedOBJ = OBJParser.parseFile(objFileContent);
}

function onSliderRadius(slider, labelId) {
	let radius = parseFloat(slider.value);
	camera.setRadius(radius);
	writeValue(labelId, radius);
	onRender();
}

function onSliderTheta(slider, labelId) {
	let theta = parseFloat(slider.value);
	camera.setTheta(theta);
	writeValue(labelId, theta);
	onRender();
}

function onSliderPhi(slider, labelId) {
	let phi = parseFloat(slider.value);
	camera.setPhi(phi);
	writeValue(labelId, phi);
	onRender();
}

function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.setFovy(fovy);
	writeValue(labelId, fovy);
	onRender();
}

function onColorModel(picker, labelId) {
	modelColor = Utils.hexToRgbFloat(picker.value);
	writeValue(labelId, picker.value);
	onRender();
}

function onCheckboxSolid(checkbox) {
	isSolid = !isSolid;
	onRender();
}

function writeValue(labelId, value) {
	if (labelId) {
		document.getElementById(labelId).innerText = value;
	}
}
