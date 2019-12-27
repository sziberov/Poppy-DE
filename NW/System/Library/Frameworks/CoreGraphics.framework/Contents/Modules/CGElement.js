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

	set style(_value) {
		this._.style = _value;
		this.node.attr('style', '').css(_value);
	}

	set attributes(_value) {
		this._.attributes = _value;
		for(var k in this.node[0].attributes) if(_value[k] == undefined) this.node.removeAttr(k);
		this.node.attr(_value);
	}

	set text(_value) {
		this._.text = _value;
		this.node.text(_value);
	}

	add(_element) {
		var _add = _element ? _element.node : 'body';

		this.node = this.node.appendTo(_add);

		return this;
	}

	addEvent(_event, _function) {
		this.node.on(_event, _function);

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