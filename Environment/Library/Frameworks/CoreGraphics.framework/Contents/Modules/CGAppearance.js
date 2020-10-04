return _fork('@Title') || class {
	static #urls = []

	constructor(_url) {
		this.url = _url;
		this.element;
	}

	add() {
		if(!this.element && this.url && !@Title.#urls.includes(this.url)) {
			let _file = CFFile.content(this.url),
				_format =
					this.url.endsWith('.less') ? 'less' :
					this.url.endsWith('.css') ? 'css' :
					undefined;

			if(_file && _format) {
				let _add = $('<style/>');

				@Title.#urls.push(this.url);
				_add.attr('type', 'text/'+_format);
				_add.text(_file.replace(/@(Resources)/g, this.url.replace(/(?<=\/Resources\/)(.*)/g, '')));

				this.element = _add.appendTo('body');

				if(_format == 'less') {
					less?.refreshStyles();
				}
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