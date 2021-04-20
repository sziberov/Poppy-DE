// noinspection JSAnnotator
return class {
	static __friends__ = [CFObject]

	constructor() {
		this.class = '@Title';

		this.__properties = {
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

		this.element;
	}

	get style() {
		return this.__properties.style;
	}

	get attributes() {
		return this.__properties.attributes;
	}

	get text() {
		return this.__properties.text;
	}

	set style(value) {
		let style = this.__properties.style;

		for(let v in style) {
			delete style[v]
		}
		Object.assign(style, value);
	}

	set attributes(value) {
		let attributes = this.__properties.attributes;

		for(let v in attributes) {
			delete attributes[v]
		}
		Object.assign(attributes, value);
	}

	set text(value) {
		this.__properties.text = value;
		if(this.element) {
			this.element.text(value);
		}
	}

	create() {
		return $('<'+this.class+'/>')
			.css(this.style)
			.attr(this.attributes)
			.text(this.text);
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
		let environment = new CFProcessInfo().environment;

		this.remove();
		environment[this.class].destroyInstance?.();
		for(let v in environment) {
			if(environment.hasOwnProperty(v) && environment[v] == this) {
				delete environment[v]
			}
		}
	}
}