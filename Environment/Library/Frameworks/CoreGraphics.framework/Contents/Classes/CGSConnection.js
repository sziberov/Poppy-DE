// noinspection JSAnnotator
return class {
	static __shared = this.create();

	static get shared() {
		return this.__shared;
	}

	static set universal(value) {
		return CGSWindowServer.shared.setConnectionUniversal(this.shared, value);
	}

	static create() {
		return CGSWindowServer.shared.createConnection(CFProcessInfo);
	}

	static destroy(connectionId) {
		return CGSWindowServer.shared.destroyConnection(connectionId ?? this.shared);
	}
}