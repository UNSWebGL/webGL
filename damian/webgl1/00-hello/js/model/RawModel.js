class RawModel {

	constructor(vao, indexCount) {
		this._vao = vao;
		this._indexCount = indexCount;
	}

	get vao() {
		return this._vao;
	}

	get indexCount() {
		return this._indexCount;
	}
}