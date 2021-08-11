// noinspection JSAnnotator
return class CFDirectory {
	static create(URL) {
		return _call('createDir', URL);
	}

	static content(URL, mode) {
		mode = ['', 'Files', 'Directories'].includes(mode) ? mode : '';

		return {
			'': async () => (await _call('readDir', URL)).map(v => v.name),
			Files: async () => (await _call('readDir', URL)).filter(v => v.isFile()).map(v => v.name),
			Directories: async () => (await _call('readDir', URL)).filter(v => !v.isFile()).map(v => v.name)
		}[mode]();
	}

	static remove(URL) {
		return _call('removeDir', URL);
	}
}