return _fork('@Title') || class {
	static #urls = []

	constructor(_url) {
		this.url = _url;
		this.element;
	}

	add() {
		if(!this.element && this.url && !@Title.#urls.includes(this.url)) {
			let _add = $('<style/>'),
				_files = CFDirectory.content(this.url, 'Files'),
				_format =
					_files.includes('Appearance.less') ? 'less' :
					_files.includes('Appearance.css') ? 'css' :
					undefined;

			if(_format) {
				@Title.#urls.push(this.url);
				_add.attr('type', 'text/'+_format);
				_add.text(CFFile.content(`${this.url}/Appearance.${_format}`).replace(/@(Resources)/g, this.url));
			}
			this.element = _add.appendTo('body');

			if(_format == 'less') {
				less?.refreshStyles();
			}
		}

		return this;
	}

	remove() {
		if(this.element) {
			CFArray.remove(@Title.#urls, this.url);
			this.element.remove();
			this.element = undefined;
		}

		return this;
	}
}