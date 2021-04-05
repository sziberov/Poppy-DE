return class {
	#properties = {
		style: CFObject.observable({}, (k, v) => {
			if(this.element) {
				this.element.css(k, v);
			}
		}),
		attributes: CFObject.observable({}, (k, v) => {
			if(this.element) {
				if(v !== undefined) {
					this.element.attr(k, v);
				} else {
					this.element.removeAttr(k);
				}
			}
		}),
		text: ''
	}

	/*
	#properties = {
		style: new CFObject(),
		attributes: new CFObject(),
		text: ''
	}
	*/

	constructor() {
		this.class = '@Title';

		this.element;

		/*
		CFObject.addObserver(this.style, (_) => {
			if(this.element) {
				if(['added', 'changed'].includes(_.event)) {
					this.element.css(_.key, _.value);
				} else {
					this.element.css(_.key, undefined);
				}
			}
		});
		CFObject.addObserver(this.attributes, (_) => {
			if(this.element) {
				if(['added', 'changed'].includes(_.event) && _.value !== undefined) {
					this.element.attr(_.key, _.value);
				} else {
					this.element.removeAttr(_.key);
				}
			}
		});
		*/
	}

	get style() {
		return this.#properties.style;
	}

	get attributes() {
		return this.#properties.attributes;
	}

	get text() {
		return this.#properties.text;
	}

	set style(value) {
		let style = this.#properties.style;

		for(let v in style) {
			delete style[v]
		}
		Object.assign(style, value);
	}

	set attributes(value) {
		let attributes = this.#properties.attributes;

		for(let v in attributes) {
			delete attributes[v]
		}
		Object.assign(attributes, value);
	}

	set text(value) {
		this.#properties.text = value;
		if(this.element) {
			this.element.text(value);
		}
	}

	create() {
		let create = $('<'+this.class+'/>')
				.css(this.style)
				.attr(this.attributes)
				.text(this.text);

		return create;
	}

	add() {
		if(!this.element) {
			this.element = this.create().appendTo('body');
		}

		return this;
	}

	remove() {
		if(this.element) {
			this.element.remove();
			this.element = undefined;
		}

		return this;
	}

	destroy() {
		this.remove();
		window[this.class].destroyInstance?.();
		for(let v in window) {
			if(window.hasOwnProperty(v) && window[v] == this) {
				delete window[v]
			}
		}
	}
}