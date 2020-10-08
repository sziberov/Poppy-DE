return class {
	/*
	constructor() {
		$(document).on('click dblclick contextmenu mouseover mouseout mousedown mouseup', '*', (e) => {
			this.dispatch('Mouse', e);
		});
		this.handle('Mouse', (value) => {
			console.log(value);
		});
	}
	*/

	static dispatch(event, ...value) {
		_request('throw', event, ...value);
	}

	static addHandler(event, _function) {
		_request('catch', event, _function);
	}

	static removeHandler(event, _function) {
		_request('catchRemove', event, _function);
	}
}