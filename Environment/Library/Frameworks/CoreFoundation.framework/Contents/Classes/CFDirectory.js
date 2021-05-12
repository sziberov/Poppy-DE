// noinspection JSAnnotator
return class {
	static create(URL) {
		_request('createDir', URL);
	}

	static content(URL, mode) {
		mode = ['', 'Files', 'Directories'].includes(mode) ? mode : '';

		return {
			'': () => _request('readDir', URL).map(v => v.name),
			Files: () => _request('readDir', URL).filter(v => v.isFile()).map(v => v.name),
			Directories: () => _request('readDir', URL).filter(v => !v.isFile()).map(v => v.name)
		}[mode]();
	}

	static remove(URL) {
		_request('removeDir', URL);
	}
}