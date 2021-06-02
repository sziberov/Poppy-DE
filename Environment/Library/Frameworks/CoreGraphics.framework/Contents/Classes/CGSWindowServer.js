// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__connections = new CFArray();
	__workspaces = new CFArray();
	__windows = new CFArray();
	__cursor;
	__layer = new CGLayer({ width: CGScreen.frame.width, height: CGScreen.frame.height });

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
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
				v.layer.hidden = false;
				currentPosition = workspaces.indexOf(v);
			}
			layers.push(v.layer);
		}
		for(let v of layers) {
			v.x = v.width*layers.indexOf(v)-v.width*currentPosition;
		}

		layer.sublayers = [
			...layers,
			...this.__cursor ? [this.__cursor.layer] : []
		]

		layer.context.drawRectangle(CGColor('100', '100', '100'), 0, 0, layer.width, layer.height);
		layer.context.drawRectangle(CGColor(0, 0, 0, 0.25), 0, 0, layer.width, layer.height);

		_request('fbWrite', this.__layer.draw().__layer);
	}

	createConnection(process) {
		if(Object.isObject(process) || !Object.isKindOf(process, CFProcessInfo))	throw new TypeError();	// @todo Заменить .isKindOf() на .isMemberOf()
		if(this.__connections.find(v => v.processId === process.shared.identifier))	throw new RangeError();

		let id = this.__connections.length > 0 ? Math.max(...this.__connections.map(v => v.id))+1 : 1;

		this.__connections.add({
			id: id,
			processId: process.shared.identifier,
			universal: false
		});
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'connectionsListChanged', { event: 'added', value: id });

		return id;
	}

	setConnectionUniversal(connectionId, value) {

	}

	destroyConnection(connectionId) {

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

	setCurrentWorkspace(workspaceId) {
		if(typeof workspaceId !== 'number')									throw new TypeError();
		if(!this.__workspaces.find(v => v.id === workspaceId))				throw new RangeError();
		if(this.__workspaces.find(v => v.id === workspaceId && v.current))	return;

		for(let v of this.__workspaces) {
			v.current = v.id === workspaceId;
		}
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceChanged', { event: 'current', value: workspaceId });
	}

	destroyWorkspace(workspaceId) {
		this.__workspaces.removeByFilter(v => v.id === workspaceId);
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'removed', value: workspaceId });
	}

	createWindow(processId, workspaceId, x, y, width, height) {
		if(typeof processId !== 'number')							throw new TypeError();
		if(!_request('info', processId))							throw new RangeError();
		if(workspaceId) {
			if(typeof workspaceId !== 'number')						throw new TypeError();
			if(!this.__workspaces.find(v => v.id === workspaceId))	throw new RangeError();
		}

		let window = {
			id: this.__windows.length > 0 ? Math.max(...this.__windows.map(v => v.id))+1 : 1,
			processId: processId,
			workspaceId: workspaceId ?? this.getCurrentWorkspace(),
			layer: new CGLayer({ x: x, y: y, width: width, height: height })
		}

		window.layer.context.drawRectangle(CGColor(0, 0, 0), 0, 0, width, height);

		this.__windows.add(window);
		CFEventEmitter.dispatch(CFProcessInfo.shared.identifier, 'windowsListChanged', { event: 'added', value: window.id });

		return window.id;
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

		layer.context.drawRectangle(CGColor(0, 0, 0), 0, 0, layer.width, layer.height);
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