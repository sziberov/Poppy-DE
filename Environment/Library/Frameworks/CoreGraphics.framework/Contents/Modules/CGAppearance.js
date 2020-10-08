return _fork('@Title') || class {
	static #URLs = []

	constructor(URL) {
		this.URL = URL;
		this.element;
	}

	add() {
		if(!this.element && this.URL && !@Title.#URLs.includes(this.URL)) {
			let file = CFFile.content(this.URL),
				format =
					this.URL.endsWith('.less') ? 'less' :
					this.URL.endsWith('.css') ? 'css' :
					undefined;

			if(file && format) {
				let add = $('<style/>');

				@Title.#URLs.push(this.URL);
				add.attr('type', 'text/'+format);
				add.text(file.replace(/@(Resources)/g, this.URL.replace(/(?<=\/Resources\/)(.*)/g, '')));

				this.element = add.appendTo('body');

				if(format == 'less') {
					less?.refreshStyles();
				}
			}
		}

		return this;
	}

	remove() {
		if(this.element) {
			CFArray.remove(@Title.#URLs, this.URL);
			this.element.remove();
			this.element = undefined;
		}

		return this;
	}
}