return class {
	static create(_url) {
		_Opium.fsCreate(_url);
	}

	static content(_url, _content) {
		var _mode = !_content ? 'Read' : 'Write';

		return {
			Read: () => _Opium.fsRead(_url),
			Write: () => _Opium.fsWrite(_url, _content)
		}[_mode]();
	}

	static remove(_url) {
		_Opium.fsRemove(_url);
	}
}