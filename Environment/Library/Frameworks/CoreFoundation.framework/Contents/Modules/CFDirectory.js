return class {
	static create(_url) {
		_request('createDir', _url);
	}

	static content(_url, _mode) {
		_mode = ['', 'Files', 'Directories'].includes(_mode) ? _mode : '';

		return {
			'': () => _request('readDir', _url).map(v => v.name),
			Files: () => _request('readDir', _url).filter(v => v.isFile()).map(v => v.name),
			Directories: () => _request('readDir', _url).filter(v => !v.isFile()).map(v => v.name)
		}[_mode]();
	}

	static remove(_url) {
		_request('removeDir', _url);
	}
}