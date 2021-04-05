return class {
	static create(URL) {
		_request('write', URL, '');
	}

	static content(URL, content) {
		let mode = !content ? 'Read' : 'Write';

		return {
			Read: () => _request('read', URL),
			Write: () => _request('write', URL, content)
		}[mode]();
	}

	static remove(URL) {
		_request('remove', URL);
	}
}