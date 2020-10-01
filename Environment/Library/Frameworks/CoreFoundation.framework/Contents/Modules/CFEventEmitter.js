return class {
	/*
	constructor() {
		$(document).on('click dblclick contextmenu mouseover mouseout mousedown mouseup', '*', (e) => {
			this.dispatch('Mouse', e);
		});
		this.handle('Mouse', (_value) => {
			console.log(_value);
		});
	}
	*/

	static dispatch(_event, ..._value) {
		_request('throw', _event, ..._value);
	}

	static addHandler(_event, _function) {
		_request('catch', _event, _function);
	}

	static removeHandler(_event, _function) {
		_request('catchRemove', _event, _function);
	}
}