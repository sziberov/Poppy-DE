/**
 * _Этот класс является служебным и не предназначен для использования сторонними приложениями._
 */
return class CGSConnection {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			this.__shared = this.create();
		}

		return this.__shared;
	}

	static create() {
		return CGSWindowServer.shared.createConnection(CFProcessInfo.shared);
	}

	static getID(processID) {
		return CGSWindowServer.shared.getConnectionID(this.shared, processID);
	}

	static getProcessID(connectionID) {
		return CGSWindowServer.shared.getConnectionProcessID(this.shared, connectionID);
	}

	static getUniversalOwner(connectionID) {
		return CGSWindowServer.shared.getConnectionUniversalOwner(this.shared, connectionID);
	}

	static setUniversalOwner(connectionID, value) {
		return CGSWindowServer.shared.setConnectionUniversalOwner(this.shared, connectionID, value);
	}

	static destroy(connectionID) {
		return CGSWindowServer.shared.destroyConnection(this.shared, connectionID);
	}
}