/*=================Creating a canvas=========================*/
var canvas = document.getElementById('my_canvas');
gl = canvas.getContext('experimental-webgl'); 

/*===========Defining and storing the geometry==============*/
var vertices =  [
   -0.5,0.5,0.0, 	
   -0.5,-0.5,0.0, 	
   0.5,-0.5,0.0,   
];
   
//Create an empty buffer object and store vertex data
   
var vertex_buffer = gl.createBuffer();                                                     
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);                                                
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);           
gl.bindBuffer(gl.ARRAY_BUFFER, null);  
   
/*========================Shaders============================*/
  
//Vertex shader source code
var vertCode =
   'attribute vec4 coordinates;' + 
   'uniform mat4 u_xformMatrix;' +
   'void main(void) {' +
      '  gl_Position = coordinates  * u_xformMatrix ;' +
   '}';
      
//Create a vertex shader program object and compile it                
var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);
   
//fragment shader source code
var fragCode =
   'void main(void) {' +
      '   gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
   '}';
   
//Create a fragment shader program object and compile it 
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

//Create and use combiened shader program
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram); 
 
/*===================scaling==========================*/
 
var Sx = 1.0, Sy = 1.5, Sz = 1.0;
var xformMatrix = new Float32Array([
   Sx,   0.0,  0.0,  0.0,
   0.0,  Sy,   0.0,  0.0,
   0.0,  0.0,  Sz,   0.0,
   0.0,  0.0,  0.0,  1.0  
]);

var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

/* ===========Associating shaders to buffer objects============*/
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);   

var coordinatesVar = gl.getAttribLocation(shaderProgram, "coordinates"); 
gl.vertexAttribPointer(coordinatesVar, 3, gl.FLOAT, false, 0, 0);  
gl.enableVertexAttribArray(coordinatesVar);

/*=================Drawing the Quad========================*/ 
gl.clearColor(0.5, 0.5, 0.5, 0.9);
gl.enable(gl.DEPTH_TEST);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0,0,canvas.width,canvas.height);
gl.drawArrays(gl.TRIANGLES, 0, 3);