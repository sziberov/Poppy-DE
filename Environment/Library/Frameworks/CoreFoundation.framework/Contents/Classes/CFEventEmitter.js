// noinspection JSAnnotator
return class {
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