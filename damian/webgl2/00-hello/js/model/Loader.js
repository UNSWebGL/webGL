class Loader {

	loadToVAO(positions) {
		let vao = this._createVAO();
		this._storeDataInAttributeList(0, positions);
		this._unbindVAO();
		return new RawModel(vao, positions.length / 3);
	}

	_createVAO() {
		let vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		return vao;
	}

	_unbindVAO() {
		gl.bindVertexArray(null);
	}

	_storeDataInAttributeList(attributeNumber, data) {
		this._createVBO(data);
		gl.vertexAttribPointer(attributeNumber, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	_createVBO(data) {
		let vbo = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	}

}
