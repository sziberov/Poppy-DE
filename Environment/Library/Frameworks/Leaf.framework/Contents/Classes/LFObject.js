// noinspection JSAnnotator
return class LFObject {
	static __friends__ = [CFObject]

	__element;
	__properties = {
		style: new CFObject({
			'@@set': (s, k, v) => {
				s[k] = v;

				if(this.element) {
					this.element.css(k, v);
				}
			}
		}),
		attributes: new CFObject({
			'@@set': (s, k, v) => {
				s[k] = v;

				if(this.element) {
					if(v !== undefined) {
						this.element.attr(k, v);
					} else {
						this.element.removeAttr(k);
					}
				}
			}
		}),
		text: ''
	}

	get element() {
		return this.__element;
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
		return $('<'+this.constructor.name+'/>')
			.css(this.style)
			.attr(this.attributes)
			.text(this.text);
	}

	add() {
		if(!this.element) {
			this.__element = this.create().appendTo('body');
		}

		return this;
	}

	remove() {
		if(this.element) {
			this.element.remove();
			this.__element = undefined;
		}

		return this;
	}

	destroy() {
		let environment = CFProcessInfo.shared.environment;

		this.remove();
		this.constructor.destroyShared?.();
		for(let v in environment) {
			if(environment.hasOwnProperty(v) && environment[v] === this) {
				delete environment[v]
			}
		}
	}
}