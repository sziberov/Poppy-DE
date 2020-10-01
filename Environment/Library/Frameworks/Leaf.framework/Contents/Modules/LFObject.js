return class {
	constructor() {
		this.class = '@Title';

		this.element;
		this.properties = {
			style: CFArray.observe({}, (k, v) => {
				if(this.element) {
					this.element.css(k, v);
				}
			}),
			attributes: CFArray.observe({}, (k, v) => {
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

		Object.defineProperty(this, 'properties', { writable: false });
	}

	get style() {
		return this.properties.style;
	}

	get attributes() {
		return this.properties.attributes;
	}

	get text() {
		return this.properties.text;
	}

	set style(_value) {
		let _style = this.properties.style;

		for(let v in _style) {
			delete _style[v]
		}
		Object.assign(_style, _value);
	}

	set attributes(_value) {
		let _attributes = this.properties.attributes;

		for(let v in _attributes) {
			delete _attributes[v]
		}
		Object.assign(_attributes, _value);
	}

	set text(_value) {
		this.properties.text = _value;
		if(this.element) {
			this.element.text(_value);
		}
	}

	create() {
		let _create = $('<'+this.class+'/>')
				.css(this.style)
				.attr(this.attributes)
				.text(this.text);

		return _create;
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
		window[this.class].remove;
		for(let v in window) {
			if(window.hasOwnProperty(v) && window[v] == this) {
				delete window[v]
			}
		}
	}
}