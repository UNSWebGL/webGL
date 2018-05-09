class Renderer {

	prepare() {
		let r = Math.random();
		let g = Math.random();
		let b = Math.random();

		gl.clearColor(r, g, b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	render(rawModel) {
		gl.bindVertexArray(rawModel.vao);

		gl.enableVertexAttribArray(0);
		gl.drawArrays(gl.TRIANGLES, 0, rawModel.vertexCount);
		gl.disableVertexAttribArray(0);

		gl.bindVertexArray(null);
	}
}
