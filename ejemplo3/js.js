 /*=================Creating a canvas=========================*/
var canvas = document.getElementById('my_canvas');
gl = canvas.getContext('experimental-webgl'); 

/*===========Defining and storing the geometry==============*/
var vertices = [
  -0.5,0.5,0.0,   
  -0.5,-0.5,0.0,  
  0.5,-0.5,0.0,   
];
  
//Create an empty buffer object and store vertex data            
var vertex_buffer = gl.createBuffer(); 

//Create a new buffer
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);   

//bind it to the current buffer      
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 

// Pass the buffer data
gl.bindBuffer(gl.ARRAY_BUFFER, null);  
  
/*========================Shaders============================*/
  
//vertex shader source code 
var vertCode =
  'attribute vec4 coordinates;' + 
  'uniform vec4 translation;'+
  'void main(void) {' +
     '  gl_Position = coordinates + translation;' +
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


/* ===========Associating shaders to buffer objects============*/

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);    
var coordinatesVar = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coordinatesVar, 3, gl.FLOAT, false, 0, 0);   
gl.enableVertexAttribArray(coordinatesVar); 

/* ==========translation======================================*/
var Tx = 0.5, Ty = 0.5, Tz = 0.0;
var translation = gl.getUniformLocation(shaderProgram, 'translation');
//vec4
gl.uniform4f(translation, Tx, Ty, Tz, 0.0);

/*=================Drawing the riangle and transforming it========================*/ 
  
gl.clearColor(0.5, 0.5, 0.5, 0.9);
gl.enable(gl.DEPTH_TEST);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0,0,canvas.width,canvas.height);
gl.drawArrays(gl.TRIANGLES, 0, 3);