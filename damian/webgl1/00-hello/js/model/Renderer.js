class Renderer {

	prepare() {
		let r = Math.random();
		let g = Math.random();
		let b = Math.random();

		gl.clearColor(r, g, b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	render(rawModel) {
		let vaoExtension = gl.getExtension('OES_vertex_array_object');
		vaoExtension.bindVertexArrayOES(rawModel.vao);

		gl.enableVertexAttribArray(0);
		gl.drawElements(gl.TRIANGLES, rawModel.indexCount, gl.UNSIGNED_SHORT, 0);
		gl.disableVertexAttribArray(0);

		vaoExtension.bindVertexArrayOES(null);
	}
}