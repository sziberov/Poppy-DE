return class {
	constructor() {
		this.events = _Opium.events();
	}

	dispatch(_event) {
		this.events.emit(_event);
	}

	handle(_event, _function) {
		this.events.on(_event, _function);
	}
}