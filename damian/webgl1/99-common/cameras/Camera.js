class Camera {
	getViewMatrix() {
		throw "getViewMatrix: Must be implemented by subclasses!"
	}

	getProjMatrix() {
		throw "getProjMatrix: Must be implemented by subclasses!"
	}
}