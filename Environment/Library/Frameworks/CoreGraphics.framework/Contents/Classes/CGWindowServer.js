// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __instance;

	__layer = new CGLayer({ width: CGScreen.frame.width, height: CGScreen.frame.height });
	__workspaces = []
	__windows = []

	constructor() {
		if(!this.constructor.__instance) {
			this.constructor.__instance = this;
		} else {
			console.error(0); return;
		}

		CFEventEmitter.addHandler('mouseChanged', (a) => {
			if(a.event === 'mousemove') {
				this.setCursorOrigin(a.value.x, a.value.y);
			}
		});
	}

	__draw() {
		_request('fbWrite', this.__layer.draw().__layer);
	}

	createWorkspace() {}

	getCurrentWorkspace() {}

	setCurrentWorkspace() {}

	destroyWorkspace() {}

	createWindow() {}

	getWindowWorkspace() {}

	getWindowOrigin() {}

	getWindowFrame() {}

	getWindowLevel() {}

	getWindowDepth() {}

	setWindowSpace() {}

	setWindowOrigin() {}

	setWindowFrame() {}

	setWindowLevel() {}

	setWindowDepth() {}

	destroyWindow() {}

	createCursor() {}

	getCursorOrigin() {}

	setCursorOrigin() {}

	destroyCursor() {}
}