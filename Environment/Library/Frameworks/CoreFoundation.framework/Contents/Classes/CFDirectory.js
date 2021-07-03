// noinspection JSAnnotator
return class CFDirectory {
	static create(URL) {
		_call('createDir', URL);
	}

	static content(URL, mode) {
		mode = ['', 'Files', 'Directories'].includes(mode) ? mode : '';

		return {
			'': () => _call('readDir', URL).map(v => v.name),
			Files: () => _call('readDir', URL).filter(v => v.isFile()).map(v => v.name),
			Directories: () => _call('readDir', URL).filter(v => !v.isFile()).map(v => v.name)
		}[mode]();
	}

	static remove(URL) {
		_call('removeDir', URL);
	}
}