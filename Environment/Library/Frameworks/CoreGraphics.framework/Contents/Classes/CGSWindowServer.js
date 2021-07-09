/**
 * Оконный сервер. Отвечает за композицию и вывод на экран слоёв рабочих пространств, окон и курсора.
 * Также в его обязанности входит отправка некоторых событий в процессы.
 *
 * Каждый процесс может иметь по одному подключению к серверу.
 * Процесс, успевший обозначить себя (своё подключение) универсальным владельцем, имеет права администратора сервера.
 * Администратор владеет всеми окнами и курсорами наравне с процессами, их создавшими.
 *
 * _Этот класс является служебным и не предназначен для использования сторонними приложениями._
 */

// noinspection JSAnnotator
return $CFShared[_title] ?? class CGSWindowServer extends CFObject {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__connections = new CFArrayNew();
	__workspaces = new CFArrayNew();
	__windows = new CFArrayNew();
//	__cursors = new CFArrayNew();
	__cursor;
	__layer = new CGLayer({ width: CGScreen.size.width, height: CGScreen.size.height });

	constructor() {
		super();
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		CFEvent.addHandler('workspaceListChanged', (a) => {
			if(a.event === 'added' && !this.__workspaces.first(v => v.current)) {
				this.setCurrentWorkspace(CGSConnection.shared, a.value);
			}
		});
		CFEvent.addHandler('workspaceChanged', (a) => {
			if(a.event === 'current') {
				this.__draw();
			}
		});

		let x, y;

		CFEvent.addHandler('mouseChanged', (a) => {
			if(a.event === 'mousemove' && (x !== a.value.x || y !== a.value.y)) {
				x = a.value.x;
				y = a.value.y;

				this.setCursorOrigin(a.value.x, a.value.y);
			}
		});

		this.setConnectionUniversalOwner(CGSConnection.shared, CGSConnection.shared, true);
		this.createWorkspace(CGSConnection.shared);
		this.createCursor(CGSConnection.shared);
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
				currentPosition = workspaces.firstIndex({ of: v });
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

		_call('fbWrite', this.__layer.draw().__layer);
	}

	createConnection(processInfo) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(this.__connections.first(v => v.processID === processInfo.identifier))	throw new RangeError(1);

		let ID = new Number(!this.__connections.empty ? Math.max(...this.__connections.map(v => v.ID))+1 : 1);	// Упаковка примитива в объект даёт безопасность сравнений, передать в качестве аргумента чужой ID просто так не получится

		this.__connections.add({
			ID: ID,
			processID: processInfo.identifier,
			universalOwner: false
		});
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'connectionsListChanged', { event: 'added', value: ID });

		return ID;
	}

	getConnectionID(connectionID, processID) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(typeof processID !== 'number')														throw new TypeError(1);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);

		return this.__connections.first(v => v.processID === processID)?.ID;
	}

	getConnectionProcessID(connectionID, connectionID_) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(!Object.isKindOf(connectionID_, Number))												throw new TypeError(1);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);

		return this.__connections.first(v => v.ID === connectionID_)?.processID;
	}

	getConnectionUniversalOwner(connectionID, connectionID_) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(!Object.isKindOf(connectionID_, Number))												throw new TypeError(1);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);

		return this.__connections.first(v => v.ID === connectionID_)?.universalOwner;
	}

	setConnectionUniversalOwner(connectionID, connectionID_, value) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(!Object.isKindOf(connectionID_, Number))												throw new TypeError(1);
		if(typeof value !== 'boolean')															throw new TypeError(2);
		if(
			this.__connections.first(v => v.universalOwner) &&
			this.__connections.first(v => v.ID === connectionID && !v.universalOwner)
		)																						throw new RangeError(3);

		this.__connections.first(v => v.ID === connectionID_)?.universalOwner = value;
	}

	destroyConnection(connectionID, connectionID_) {
		if(!Object.isKindOf(connectionID, Number))													throw new TypeError(0);
		if(!Object.isKindOf(connectionID_, Number))													throw new TypeError(1);
		if(connectionID !== connectionID_) {
			if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);
		}

		this.__connections.removeAll({ where: v => v.ID === connectionID_ });
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'connectionsListChanged', { event: 'removed', value: connectionID_ });
	}

	createWorkspace(connectionID) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(1);

		let ID = !this.__workspaces.empty ? Math.max(...this.__workspaces.map(v => v.ID))+1 : 1;

		this.__workspaces.add({
			ID: ID,
			current: false,
			layer: new CGLayer({ width: this.__layer.width, height: this.__layer.height })
		});
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'added', value: ID });

		return ID;
	}

	getCurrentWorkspace() {
		return this.__workspaces.first(v => v.current)?.ID;
	}

	setCurrentWorkspace(connectionID, workspaceID) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(typeof workspaceID !== 'number')														throw new TypeError(1);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);
		if(!this.__workspaces.first(v => v.ID === workspaceID))							throw new RangeError(3);
		if(this.__workspaces.first(v => v.ID === workspaceID && v.current))				return;

		for(let v of this.__workspaces) {
			v.current = v.ID === workspaceID;
		}
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'workspaceChanged', { event: 'current', value: workspaceID });
	}

	destroyWorkspace(connectionID, workspaceID) {
		if(!Object.isKindOf(connectionID, Number))												throw new TypeError(0);
		if(typeof workspaceID !== 'number')														throw new TypeError(1);
		if(!this.__connections.first(v => v.ID === connectionID && v.universalOwner))	throw new RangeError(2);
		if(!this.__workspaces.first(v => v.ID === workspaceID))							throw new RangeError(3);

		this.__workspaces.removeAll({ where: v => v.ID === workspaceID });
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'workspaceListChanged', { event: 'removed', value: workspaceID });
	}

	createWindow(connectionID, workspaceID, x, y, width, height) {
		if(!Object.isKindOf(connectionID, Number))							throw new TypeError(0);
		if(!this.__connections.first(v => v.ID === connectionID))	throw new RangeError(1);
		if(workspaceID) {
			if(typeof workspaceID !== 'number')								throw new TypeError(2);
			if(!this.__workspaces.first(v => v.ID === workspaceID))	throw new RangeError(3);
		}

		let window = {
			ID: !this.__windows.empty ? Math.max(...this.__windows.map(v => v.ID))+1 : 1,
			connectionID: connectionID,
			workspaceID: workspaceID ?? this.getCurrentWorkspace(),
			layer: new CGLayer({ x: x, y: y, width: width, height: height })
		}

		window.layer.context.drawRectangle(CGColor(0, 0, 0), 0, 0, width, height);

		this.__windows.add(window);
		CFEvent.dispatch(CFProcessInfo.shared.identifier, 'windowsListChanged', { event: 'added', value: window.ID });

		return window.ID;
	}

	getWindowWorkspace() {}

	getWindowOrigin() {}

	getWindowFrame() {}

	getWindowLevel() {}

	getWindowDepth() {}

	getWindowContext() {}

	setWindowWorkspace() {}

	setWindowOrigin() {}

	setWindowFrame() {}

	setWindowLevel() {}

	setWindowDepth() {}

	destroyWindow() {}

	createCursor(connectionID, layer) {
		this.__cursor = {
			layer: new CGLayer({ width: 32, height: 32 })
		}

		layer = this.__cursor.layer;

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