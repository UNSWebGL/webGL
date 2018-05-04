// WebGL context and extensions
var gl = null;
var _gl = null;//This extension is to support VAOs in webgl1. (In webgl2, functions are called directly to gl object.)

//Shader program
var shaderProgram  = null;

//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_modelColor;

//Uniform values.
var modelColor = Utils.hexToRgbFloat("#FFFFFF");

//Models (OBJ)
var cono;
var then=0;
var velocidadRotacion = 15;
// Auxiliary objects
var axis;
var world;
var sphereBody;
var sphereBody2;
// Camera
var camera;

// Flags
var isSolid = false;

function loadModels(pos_location) {
	// Load each model (OBJ) and generate the mesh
	// mono = new Model(monoSource);
	// mono.generateModel(pos_location);

	esfera = new Model(esferaSource);
	esfera.generateModel(pos_location);
	//
	// ironman = new Model(ironmanSource);
	// ironman.generateModel(pos_location);
	//
	// cono = new Model(conoSource);
	// cono.generateModel(pos_location);

}

function setModelsTransformations() {
	let matrix = mat4.create();
	let translation = mat4.create();
	let scaling = mat4.create();

	// Set mono model matrix
	// matrix = mat4.create();
	// translation = mat4.create();
	// scaling = mat4.create();
	// mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	// mat4.fromTranslation(translation, [1.0, 0.0, 1.0]);
	// mat4.multiply(matrix, translation, scaling);
	// mono.setModelMatrix(matrix);

	// Set esfera model matrix
	// matrix = mat4.create();
	// translation = mat4.create();
	// scaling = mat4.create();
	// mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	// mat4.fromTranslation(translation, [-1.0, 0.0, 1.0]);
	// mat4.multiply(matrix, translation, scaling);
	// esfera.setModelMatrix(matrix);
	//
	// // Set ironman model matrix
	// matrix = mat4.create();
	// translation = mat4.create();
	// scaling = mat4.create();
	// mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	// mat4.fromTranslation(translation, [1.0, 0.0, -1.0]);
	// mat4.multiply(matrix, translation, scaling);
	// ironman.setModelMatrix(matrix);
	//
	// // Set cono model matrix
	// matrix = mat4.create();
	// translation = mat4.create();
	// scaling = mat4.create();
	// mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	// mat4.fromTranslation(translation, [-1.0, 0.0, -1.0]);
	// mat4.multiply(matrix, translation, scaling);
	// cono.setModelMatrix(matrix);
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

	// Load all the models
	loadModels(posLocation);

	// Set the models' transformations
	setModelsTransformations();

	// Set some WebGL properties
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create auxiliary models
	axis = new Axis();
	axis.load();

	// Create the camera using canvas dimension
	camera = new SphericalCamera(55, 800/600);
	camera.setRadius(10);
	// start physics
	world = new CANNON.World();
	world.gravity.set(0, 0, -9.82); // m/s²
	
	// Create material
	var groundMaterial=new CANNON.Material();
	var mat1 = new CANNON.Material();
	var mat2= new CANNON.Material();
	//var mat3_ground = new CANNON.ContactMaterial(groundMaterial, mat3, { friction: 0.0, restitution: 0.9 });
	//world.addContactMaterial(mat3_ground);
	 var mat1_ground = new CANNON.ContactMaterial(groundMaterial, mat1, { friction: 0.0, restitution: 0.0 });
     var mat2_ground = new CANNON.ContactMaterial(groundMaterial, mat2, { friction: 0.0, restitution: 0.4});
	// Create a sphere
	var radius = 1; // m
	sphereBody = new CANNON.Body({
	   mass:1, // kg
		material : mat1,
	   position: new CANNON.Vec3(1, 0,30), // m
	   shape: new CANNON.Sphere(radius/4)
	});
	world.addBody(sphereBody);
	//otra esfera
	var radius = 1; // m
	sphereBody2 = new CANNON.Body({
	   mass:0.5,// kg
		angularDamping:0.5,
		material:mat2,
	   position: new CANNON.Vec3(-1,0,30), // m
	   shape: new CANNON.Sphere(radius/4)
	});
	world.addBody(sphereBody2);
	world.addContactMaterial(mat1_ground);
     world.addContactMaterial(mat2_ground);

	// Create a plane
	var groundBody = new CANNON.Body({
	    mass: 0,
		material: groundMaterial,// mass == 0 makes the body static
	});
	var groundShape = new CANNON.Plane();
	groundBody.addShape(groundShape);
	world.addBody(groundBody);

	

	// end physics

	requestAnimationFrame(onRender);
}

function onRender(now) {
	// Convert to seconds
	now *= 0.001;
	// Subtract the previous time from the current time
	var deltaTime = now - then;
	world.step(deltaTime);
	console.log("Sphere z position: " + sphereBody.position.z);

	// Remember the current time for the next frame.
	then = now;
	camera.setTheta(camera.getTheta() + deltaTime*velocidadRotacion);
	let modelMatrix = mat4.create();
	let viewMatrix = camera.getViewMatrix();
	let projMatrix = camera.getProjMatrix();

	// Set some WebGL properties
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw auxiliary models
	axis.render(projMatrix, viewMatrix);

	// Set shader and uniforms
	gl.useProgram(shaderProgram);
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
	let _modelColor = vec3.fromValues(1,0,0);
	gl.uniform3fv(u_modelColor, _modelColor);

	// Draw models
	// setModelsTransformations();
	// mono.draw(isSolid, gl, _gl);
	mover(sphereBody.position.x,sphereBody.position.z,sphereBody.position.y,esfera);
	esfera.draw(isSolid, gl, _gl);
	mover(sphereBody2.position.x,sphereBody2.position.z,sphereBody2.position.y,esfera);
	esfera.draw(isSolid, gl, _gl);
	// ironman.draw(isSolid, gl, _gl);
	// cono.draw(isSolid, gl, _gl);

	// Clean
	_gl.bindVertexArrayOES(null);
	gl.useProgram(null);

	// Call drawScene again next frame
	requestAnimationFrame(onRender);
}

function mover (x,y,z,obj){
	matrix = mat4.create();
	translation = mat4.create();
	scaling = mat4.create();
	mat4.fromScaling(scaling, [0.25, 0.25, 0.25]);
	mat4.fromTranslation(translation, [x, y, z]);
	mat4.multiply(matrix,translation, scaling);
	obj.setModelMatrix(matrix);
}