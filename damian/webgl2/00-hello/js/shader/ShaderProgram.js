class ShaderProgram {

	constructor(vertexShaderSource, fragmentShaderSource) {
		let vertexShader = this._loadShader(vertexShaderSource, gl.VERTEX_SHADER);
		let fragmentShader = this._loadShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
		this._shaderProgram = gl.createProgram();
		gl.attachShader(this._shaderProgram, vertexShader);
		gl.attachShader(this._shaderProgram, fragmentShader);
		gl.linkProgram(this._shaderProgram);
		gl.validateProgram(this._shaderProgram);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		this.bindAttributes();
	}

	start() {
		gl.useProgram(this._shaderProgram);
	}

	stop() {
		gl.useProgram(null);
	}

	bindAttributes() {
		throw "Must be implemented by child.!";
	}

	bindAttribute(attributeIndex, variableName) {
		gl.bindAttribLocation(this._shaderProgram, attributeIndex, variableName);
	}

	_loadShader(shaderSource, type) {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!success) {
			throw "Could not compile shader: " + gl.getShaderInfoLog(shader);
		}
		return shader;
	}
}
