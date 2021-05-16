// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __instance;

	layer = new CGLayer({ width: CGScreen.frame.width, height: CGScreen.frame.height });
	spaces = []
	windows = []

	constructor() {
		if(!this.constructor.__instance) {
			this.constructor.__instance = this;
		} else {
			console.error(0); return;
		}
	}

	__draw() {
		_request('fbWrite', this.layer);
	}

	createSpace() {}

	switchSpace() {}

	destroySpace() {}

	createWindow() {}

	setWindowSpace() {}

	setWindowOrigin() {}

	setWindowFrame() {}

	destroyWindow() {}
}