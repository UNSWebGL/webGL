var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

var shaderProgram  = null; //Shader program to use.
var vaoSolid = null; //Geometry to render (stored in VAO).
var vaoWire = null;
var isSolid = false;
var indexCountSolid = 0;
var indexCountWire = 0;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Uniform values.
var modelColor = Utils.hexToRgbFloat("#FFFFFF");

//Objects (OBJ)
var cubo;
var esfera;
var cilindro;
var cono;
var toroide;
var mono;
var ironman;

//Aux variables,
var angle = 0;
var scale = 1;
var parsedOBJ = null; //Parsed OBJ file

var axis;//Objeto auxiliar "Ejes"
var camera;

function loadObjects(pos_location) {
	mono = new Object(monoSource, pos_location);
	mono.generateModel();

	esfera = new Object(esferaSource, pos_location);
	esfera.generateModel();

	ironman = new Object(ironmanSource, pos_location);
	ironman.generateModel();

	cono = new Object(conoSource, pos_location);
	cono.generateModel();

}

function setObjectTransformations() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();

	// Set mono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [1.0, 0.0, 1.0]);
	mat4.multiply(matrix, translation, scaling);
	mono.setModelMatrix(matrix);


	// Set esfera model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-1.0, 0.0, 1.0]);
	mat4.multiply(matrix, translation, scaling);
	esfera.setModelMatrix(matrix);

	// Set ironman model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [1.0, 0.0, -1.0]);
	mat4.multiply(matrix, translation, scaling);
	ironman.setModelMatrix(matrix);

	// Set cono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-1.0, 0.0, -1.0]);
	mat4.multiply(matrix, translation, scaling);
	cono.setModelMatrix(matrix);
}

function setObjectTransformations2() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();
	let rotation = mat4.create();

	// Set mono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [0.5, 0.0, 0.5]);
	mat4.fromYRotation(rotation, glMatrix.toRadian(45));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	mono.setModelMatrix(matrix);


	// Set esfera model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-0.5, 0.0, 0.5]);
	mat4.multiply(matrix, translation, scaling);
	esfera.setModelMatrix(matrix);

	// Set ironman model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [0.5, 0.0, -0.5]);
	mat4.fromZRotation(rotation, glMatrix.toRadian(90));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	ironman.setModelMatrix(matrix);

	// Set cono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-0.5, 0.0, -0.5]);
	mat4.fromZRotation(rotation, glMatrix.toRadian(180));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	cono.setModelMatrix(matrix);
}

function setObjectTransformations3() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();
	let rotation = mat4.create();

	// Set mono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.5, 0.25, 0.75]);
	mat4.fromTranslation(translation, [2.5, 0.0, 2.5]);
	mat4.fromXRotation(rotation, glMatrix.toRadian(90));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	mono.setModelMatrix(matrix);


	// Set esfera model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [-2.5, 0.0, 2.5]);
	mat4.multiply(matrix, translation, scaling);
	esfera.setModelMatrix(matrix);

	// Set ironman model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.75, 0.75, 0.75]);
	mat4.fromTranslation(translation, [2.5, 0.0, -2.5]);
	mat4.multiply(matrix, translation, scaling);
	mat4.fromYRotation(rotation, glMatrix.toRadian(180));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	ironman.setModelMatrix(matrix);

	// Set cono model matrix
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	rotation = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.75, 0.25]);
	mat4.fromTranslation(translation, [-2.5, 0.0, -2.5]);
	mat4.fromZRotation(rotation, glMatrix.toRadian(45));
	mat4.multiply(matrix, rotation, scaling);
	mat4.multiply(matrix, translation, matrix);
	cono.setModelMatrix(matrix);
}

function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl');
	_gl = VAOHelper.getVaoExtension();

	//SHADERS
	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);

	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	u_modelColor = gl.getUniformLocation(shaderProgram, 'modelColor');

	loadObjects(posLocation);
	setObjectTransformations();

	//BUFFERS
	//let indicesSolid = parsedOBJ.indices;
	//let indicesWire = Utils.reArrangeIndicesToRenderWithLines(parsedOBJ.indices);
	//indexCountSolid = indicesSolid.length;
	//indexCountWire = indicesWire.length;
	//let positions = parsedOBJ.positions;

	//let vertexAttributeInfoArray = [
	//	new VertexAttributeInfo(positions, posLocation, 3)
	//];
	//vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);
	//vaoWire = VAOHelper.create(indicesWire, vertexAttributeInfoArray);
	//Ya tengo los buffers cargados en memoria de la placa grafica, puedo borrarlo de JS
	//delete(parsedOBJ);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new SphericalCamera(55, 800/600);//use canvas dimensions
}

function onRender() {
	let modelMatrix = createModelMatrix();
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(projMatrix, viewMatrix);

	gl.useProgram(shaderProgram);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
	let _modelColor = vec3.fromValues(modelColor.r, modelColor.g, modelColor.b);
	gl.uniform3fv(u_modelColor, _modelColor);

	// Draw objects
	setObjectTransformations();
	mono.draw(isSolid, gl, _gl);
	esfera.draw(isSolid, gl, _gl);
	ironman.draw(isSolid, gl, _gl);
	cono.draw(isSolid, gl, _gl);

	// Draw objects using different transformations
	setObjectTransformations2();
	mono.draw(isSolid, gl, _gl);
	esfera.draw(isSolid, gl, _gl);
	ironman.draw(isSolid, gl, _gl);
	cono.draw(isSolid, gl, _gl);

	// Yet again draw objects using different transformations
	setObjectTransformations3();
	mono.draw(isSolid, gl, _gl);
	esfera.draw(isSolid, gl, _gl);
	ironman.draw(isSolid, gl, _gl);
	cono.draw(isSolid, gl, _gl);

	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function createModelMatrix() {
	let modelMatrix = mat4.create(); 
	let rotationMatrix = mat4.create();
	let scaleMatrix = mat4.create();
	mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle));
	mat4.fromScaling(scaleMatrix, [scale, scale, scale]);

	mat4.multiply(modelMatrix, rotationMatrix, scaleMatrix);

	return modelMatrix;
}
