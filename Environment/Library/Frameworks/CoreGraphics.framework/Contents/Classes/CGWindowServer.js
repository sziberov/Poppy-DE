// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __instance;

	__layer = new CGLayer({ width: CGScreen.frame.width, height: CGScreen.frame.height });
	__workspaces = new CFArray();
	__windows = []

	constructor() {
		if(!this.constructor.__instance) {
			this.constructor.__instance = this;
		} else {
			console.error(0); return;
		}

		CFEventEmitter.addHandler('workspaceListChanged', (a) => {
			if(a.event === 'added' && !this.__workspaces.some(v => v.current)) {
				this.setCurrentWorkspace(a.value);
			}
		});
		CFEventEmitter.addHandler('mouseChanged', (a) => {
			if(a.event === 'mousemove') {
				this.setCursorOrigin(a.value.x, a.value.y);
			}
		});

		this.createWorkspace();
	}

	__draw() {
		_request('fbWrite', this.__layer.draw().__layer);
	}

	createWorkspace() {
		let id = this.__workspaces.length > 0 ? Math.max(...this.__workspaces.map(v => v.id))+1 : 1;

		this.__workspaces.add({
			id: id,
			current: false,
			layer: new CGLayer({ width: this.__layer.width, height: this.__layer.height })
		});
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'added', value: id });

		return id;
	}

	getCurrentWorkspace() {
		return this.__workspaces.find(v => v.current).id;
	}

	setCurrentWorkspace(id) {
		if(typeof id !== 'number')						throw new TypeError();
		if(!this.__workspaces.find(v => v.id === id))	throw new RangeError();

		for(let v of this.__workspaces) {
			v.current = v.id === id;
		}
	}

	destroyWorkspace(id) {
		this.__workspaces.removeByFilter(v => v.id === id);
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'removed', value: id });
	}

	createWindow(workspaceId, x, y, width, height) {
		let id = this.__windows.length > 0 ? Math.max(...this.__windows.map(v => v.id))+1 : 1;

		this.__windows.add({
			id: id,
			workspaceId: workspaceId || this.getCurrentWorkspace(),
			layer: new CGLayer()
		});
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'windowsListChanged', { event: 'added', value: id });

		return id;
	}

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