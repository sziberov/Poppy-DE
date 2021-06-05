// noinspection JSAnnotator
return class CFEvent {
	static dispatch(processID, event, ...arguments_) {
		_request('throw', processID, event, ...arguments_);
	}

	static addHandler(event, function_) {
		return _request('catch', event, function_);
	}

	static removeHandler(handler) {
		_request('catchRemove', handler);
	}
}