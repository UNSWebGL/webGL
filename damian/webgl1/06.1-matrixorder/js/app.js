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
var modelColor1 = Utils.hexToRgbFloatArray("#FFFFFF");
var modelColor2 = Utils.hexToRgbFloatArray("#FFFF00");
//Modelling matrices.
var modelMatrix1 = mat4.create();
var modelMatrix2 = mat4.create();
var rotationMatrix = mat4.create();
var translationMatrix = mat4.create();

//Aux variables,
var angle = 90;
var translationX = 0.8;

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

	let parsedOBJ = OBJParser.parseFile(objFileContent);
	delete(objFileContent);

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

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new SphericalCamera(55, 800/600);//use canvas dimensions


	onRender();
}

function onRender() {

	updateModelMatrices();//Rebuild modelMatrix1 and modelMatrix2.
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(projMatrix, viewMatrix);

	gl.useProgram(shaderProgram);

	// MODEL1
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix1);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
	gl.uniform3fv(u_modelColor, modelColor1);

	if (isSolid) {
		_gl.bindVertexArrayOES(vaoSolid);
		gl.drawElements(gl.TRIANGLES, indexCountSolid, gl.UNSIGNED_INT, 0);
	} else {
		_gl.bindVertexArrayOES(vaoWire);
		gl.drawElements(gl.LINES, indexCountWire, gl.UNSIGNED_INT, 0);
	}

	// MODEL2 (ONLY SET UNIFORMS THAT WE WANT TO CHANGE)
	gl.uniform3fv(u_modelColor, modelColor2);
	gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix2);
	_gl.bindVertexArrayOES(vaoWire);
	gl.drawElements(gl.LINES, indexCountWire, gl.UNSIGNED_INT, 0);


	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);
}

function updateModelMatrices() {
	//Update Rotation and translation matrices.
	mat4.fromYRotation(rotationMatrix, glMatrix.toRadian(angle));
	mat4.fromTranslation(translationMatrix, [translationX, 0, 0]);

	//Update modelMatrices.
	mat4.multiply(modelMatrix1, rotationMatrix, translationMatrix);
	mat4.multiply(modelMatrix2, translationMatrix, rotationMatrix);
}
