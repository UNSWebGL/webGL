class Loader {

	loadToVAO(indices, positions) {
		let vao = this._createVAO();
		this._createEBO(indices);
		this._storeDataInAttributeList(0, positions);
		this._unbindVAO();
		return new RawModel(vao, indices.length);
	}

	_createVAO() {
		let vaoExtension = gl.getExtension('OES_vertex_array_object');
		let vao = vaoExtension.createVertexArrayOES();
		vaoExtension.bindVertexArrayOES(vao);
		return vao;
	}

	_unbindVAO() {
		gl.getExtension('OES_vertex_array_object').bindVertexArrayOES(null);
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

	_createEBO(indices) {
		let ebo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	}
}