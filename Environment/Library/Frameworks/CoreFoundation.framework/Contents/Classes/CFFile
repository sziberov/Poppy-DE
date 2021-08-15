// noinspection JSAnnotator
return class CFFile {
	static create(URL) {
		return _call('write', URL, '');
	}

	static content(URL, content) {
		let mode = !content ? 'Read' : 'Write';

		return {
			Read: () => _call('read', URL),
			Write: () => _call('write', URL, content)
		}[mode]();
	}

	static remove(URL) {
		return _call('remove', URL);
	}
}