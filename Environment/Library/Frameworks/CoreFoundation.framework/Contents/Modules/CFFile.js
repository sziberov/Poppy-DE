return class {
	static create(_url) {
		_request('create', _url);
	}

	static content(_url, _content) {
		var _mode = !_content ? 'Read' : 'Write';

		return {
			Read: () => _request('read', _url),
			Write: () => _request('write', _url, _content)
		}[_mode]();
	}

	static remove(_url) {
		_request('remove', _url);
	}
}