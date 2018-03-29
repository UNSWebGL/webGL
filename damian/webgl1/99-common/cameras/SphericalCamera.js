/**
 * Camara simple, en coordenadas esféricas.
 * Limitaciones: (Usar solo para pruebas)
 * - Orbita SIEMPRE alrededor del origen.
 * - Apunta SIEMPRE al origen.
 * - Matriz de proyeccion fija.
 */
class SphericalCamera extends Camera {
	constructor(width, height) {
		super();
		this.r = 1;
		this.theta = 45;//degrees
		this.phi = 45; //degrees
		this.aspect = width / height;
	}
	getViewMatrix() {
		let eye = this._toCartesianArray();
		let target = [0, 0, 0];
		let up = [0, 1, 0];

		let viewMatrix = mat4.create();
		mat4.lookAt(viewMatrix, eye, target, up);
		return viewMatrix;
	}

	getProjMatrix() {
		let fovy = glMatrix.toRadian(50);
		let aspect = this.aspect;
		let zNear = 0.1;
		let zFar = 100.0;

		let projMatrix = mat4.create();
		mat4.perspective(projMatrix, fovy, aspect, zNear, zFar);
		return projMatrix;
	}

	setRadius(radius) {
		this.r = radius;
	}
	setTheta(theta) {
		this.theta = theta;
	}
	setPhi(phi) {
		this.phi = phi;
	}

	_toCartesianArray() {
		let _theta = glMatrix.toRadian(this.theta);
		let _phi = glMatrix.toRadian(this.phi);

		let x = this.r * Math.sin(_phi) * Math.cos(_theta);
		let z = this.r * Math.sin(_phi) * Math.sin(_theta);
		let y = this.r * Math.cos(_phi);
		return [x, y, z];
	}
}