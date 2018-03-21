class RawModel {

	constructor(vao, vertexCount) {
		this._vao = vao;
		this._vertexCount = vertexCount;
	}

	get vao() {
		return this._vao;
	}

	get vertexCount() {
		return this._vertexCount;
	}
}