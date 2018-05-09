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

//Aux variables,
var angle = 0;
var scale = 1;
var parsedOBJ = null; //Parsed OBJ file

var axis;//Objeto auxiliar "Ejes"
var camera;

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

	//BUFFERS
	let indicesSolid = parsedOBJ.indices;
	let indicesWire = Utils.reArrangeIndicesToRenderWithLines(parsedOBJ.indices);
	indexCountSolid = indicesSolid.length;
	indexCountWire = indicesWire.length;
	let positions = parsedOBJ.positions;

	let vertexAttributeInfoArray = [
		new VertexAttributeInfo(positions, posLocation, 3)
	];
	vaoSolid = VAOHelper.create(indicesSolid, vertexAttributeInfoArray);
	vaoWire = VAOHelper.create(indicesWire, vertexAttributeInfoArray);
	//Ya tengo los buffers cargados en memoria de la placa grafica, puedo borrarlo de JS
	delete(parsedOBJ);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new FreeCamera(55, 800/600);//use canvas dimensions
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

	if (isSolid) {
		_gl.bindVertexArrayOES(vaoSolid);
		gl.drawElements(gl.TRIANGLES, indexCountSolid, gl.UNSIGNED_INT, 0);
	} else {
		_gl.bindVertexArrayOES(vaoWire);
		gl.drawElements(gl.LINES, indexCountWire, gl.UNSIGNED_INT, 0);
	}

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
