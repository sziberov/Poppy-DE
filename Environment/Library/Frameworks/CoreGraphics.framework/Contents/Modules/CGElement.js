return class {
	constructor(_) {
		this._ = {
			tag: '@Title',
			style: {},
			attributes: {},
			text: '',
			..._
		}

		this.node = $('<'+this._.tag+'/>')
			.css(this._.style)
			.attr(this._.attributes)
			.text(this._.text);
	}

	set style(value) {
		this._.style = value;
		this.node.attr('style', '').css(value);
	}

	set attributes(value) {
		this._.attributes = value;
		for(let k in this.node[0].attributes) {
			if(value[k] == undefined) {
				this.node.removeAttr(k);
			}
		}
		this.node.attr(value);
	}

	set text(value) {
		this._.text = value;
		this.node.text(value);
	}

	add(element) {
		let add = element ? element.node : 'body';

		this.node = this.node.appendTo(add);

		return this;
	}

	addEvent(event, _function) {
		this.node.on(event, _function);

		return this;
	}

	removeEvents() {
		this.node.off();

		return this;
	}

	remove() {
		this.node.remove();

		return this;
	}
}