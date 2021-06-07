// noinspection JSAnnotator
return class CFEvent {
	static dispatch(processID, event, ...arguments_) {
		if(processID && typeof processID !== 'number')	throw new TypeError(0);
		if(typeof event !== 'string')					throw new TypeError(1);

		_request('throw', processID, event, ...arguments_);
	}

	static addHandler(event, function_) {
		if(typeof event !== 'string')		throw new TypeError(0);
		if(typeof function_ !== 'function')	throw new TypeError(1);

		return _request('catch', event, function_);
	}

	static removeHandler(handler) {
		if(typeof handler !== 'number') {
			throw new TypeError(0);
		}

		_request('catchRemove', handler);
	}
}