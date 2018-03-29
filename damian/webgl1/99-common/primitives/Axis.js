class Axis {

	_vertexShaderSource() {
		return `
		uniform mat4 projMatrix;
		uniform mat4 viewMatrix;
		attribute vec3 position;
		attribute vec3 color;
		varying vec3 vColor;
		void main(void) {
			vColor = color;
			gl_Position = projMatrix * viewMatrix * vec4(position, 1.0);
		}
		`;
	}

	_fragmentShaderSource() {
		return `
		precision mediump float;

		varying vec3 vColor;
		void main(void) {
			gl_FragColor = vec4(vColor, 1.0);
		}
		`;
	}

	load() {
		let positions = [
			0, 0, 0, 1, 0, 0,
			0, 0, 0, 0, 1, 0,
			0, 0, 0, 0, 0, 1,
			0, 0, 0, -1, 0, 0,
			0, 0, 0, 0, -1, 0,
			0, 0, 0, 0, 0, -1
		];
		let colors = [
			1, 0, 0, 1, 0, 0,
			0, 1, 0, 0, 1, 0,
			0, 0, 1, 0, 0, 1,
			0.25, 0, 0, 0.25, 0, 0,
			0, 0.25, 0, 0, 0.25, 0,
			0, 0, 0.25, 0, 0, 0.25
		];
		let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this._shaderProgram = ShaderProgramHelper.create(
			this._vertexShaderSource(),
			this._fragmentShaderSource()
		);
		let posLocation = gl.getAttribLocation(this._shaderProgram, 'position');
		let colLocation = gl.getAttribLocation(this._shaderProgram, 'color');
		this._u_projMatrix = gl.getUniformLocation(this._shaderProgram, 'projMatrix');
		this._u_viewMatrix = gl.getUniformLocation(this._shaderProgram, 'viewMatrix');
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, posLocation, 3),
			new VertexAttributeInfo(colors, colLocation, 3)
		];

		this._vao = VAOHelper.create(indices, vertexAttributeInfoArray);
	}

	render(projMatrix, viewMatrix) {
		let previuosLineWidth = gl.getParameter(gl.LINE_WIDTH);
		gl.lineWidth(3.0);

		gl.useProgram(this._shaderProgram);
		gl.uniformMatrix4fv(this._u_projMatrix, false, projMatrix);
		gl.uniformMatrix4fv(this._u_viewMatrix, false, viewMatrix);

		_gl.bindVertexArrayOES(this._vao);
		gl.drawElements(gl.LINES, 12, gl.UNSIGNED_INT, 0);
		_gl.bindVertexArrayOES(null);

		gl.useProgram(null);
		gl.lineWidth(previuosLineWidth);
	}
}