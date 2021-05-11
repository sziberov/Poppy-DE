// noinspection JSAnnotator
return class extends LFControl {
	__type;

	class = '@Title';

	constructor({ type } = {}) {
		super(...arguments);

		this.type = type;
	}

	mouseover() {
		this.highlighted = true;
		for(let v of this.get('Siblings', this.class)) {
			v.highlighted = true;
		}
	}

	mouseout() {
		this.highlighted = false;
		for(let v of this.get('Siblings', this.class)) {
			v.highlighted = false;
		}
	}

	get type() {
		return this.__type;
	}

	set type(value) {
		if(typeof value !== 'string')							throw new TypeError();
		if(!['close', 'minimize', 'maximize'].includes(value))	throw new RangeError();

		this.__type = value;
		for(let v of ['close', 'minimize', 'maximize']) {
			this.attributes[v] = v === value ? '' : undefined;
		}
	}
}