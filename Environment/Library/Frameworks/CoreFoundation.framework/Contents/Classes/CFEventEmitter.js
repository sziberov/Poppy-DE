// noinspection JSAnnotator
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

	static dispatch(processId, event, ...arguments_) {
		_request('throw', processId, event, ...arguments_);
	}

	static addHandler(event, function_) {
		return _request('catch', event, function_);
	}

	static removeHandler(handler) {
		_request('catchRemove', handler);
	}
}