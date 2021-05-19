// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __instance;

	__layer = new CGLayer({ width: CGScreen.frame.width, height: CGScreen.frame.height });
	__workspaces = new CFArray();
	__windows = []
	__cursor;

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
		CFEventEmitter.addHandler('workspaceChanged', (a) => {
			if(a.event === 'current') {
				this.__draw();
			}
		});

		let x, y;

		CFEventEmitter.addHandler('mouseChanged', (a) => {
			if(a.event === 'mousemove' && (x !== a.value.x || y !== a.value.y)) {
				x = a.value.x;
				y = a.value.y;

				this.setCursorOrigin(a.value.x, a.value.y);
			}
		});

		this.createWorkspace();
		this.createCursor();
	}

	__draw() {
		let layer = this.__layer,
			workspaces = this.__workspaces,
			currentPosition = 0,
			layers = []

		for(let v of workspaces) {
			if(!v.current) {
				v.layer.hidden = true;
			} else {
				currentPosition = workspaces.indexOf(v);
			}
			layers.push(v.layer);
		}
		for(let v of layers) {
			v.x = v.width*layers.indexOf(v)-v.width*currentPosition;
		}

		layer.sublayers = [
			...layers,
			this.__cursor.layer
		]

		layer.drawRectangle(CGColor('100', '100', '100'), 0, 0, layer.width, layer.height);
		layer.drawRectangle(CGColor(0, 0, 0, 0.125), 0, 0, layer.width, layer.height);

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
		if(typeof id !== 'number')									throw new TypeError();
		if(!this.__workspaces.find(v => v.id === id))				throw new RangeError();
		if(this.__workspaces.find(v => v.id === id && v.current))	return;

		for(let v of this.__workspaces) {
			v.current = v.id === id;
		}
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceChanged', { event: 'current', value: id });
	}

	destroyWorkspace(id) {
		this.__workspaces.removeByFilter(v => v.id === id);
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'removed', value: id });
	}

	createWindow(workspaceId, x, y, width, height) {
		let id = this.__windows.length > 0 ? Math.max(...this.__windows.map(v => v.id))+1 : 1;

		this.__windows.add({
			id: id,
			workspaceId: workspaceId ?? this.getCurrentWorkspace(),
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

	setWindowWorkspace() {}

	setWindowOrigin() {}

	setWindowFrame() {}

	setWindowLevel() {}

	setWindowDepth() {}

	destroyWindow() {}

	createCursor() {
		this.__cursor = {
			layer: new CGLayer({ width: 32, height: 32 })
		}

		let layer = this.__cursor.layer;

		layer.drawRectangle(CGColor(0, 0, 0), 0, 0, layer.width, layer.height);
	}

	getCursorOrigin() {
		return {
			x: this.__cursor.layer.x,
			y: this.__cursor.layer.y
		}
	}

	setCursorOrigin(x, y) {
		if(!this.__cursor) {
			return;
		}

		this.__cursor.layer.x = x;
		this.__cursor.layer.y = y;

		this.__draw();
	}

	destroyCursor() {}
}