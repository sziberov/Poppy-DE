// noinspection JSAnnotator
return class LFTitlebarButton extends LFControl {
	__type;

	constructor({ type } = {}) {
		super(...arguments);

		this.type = type;
	}

	mouseover() {
		this.highlighted = true;
		for(let v of this.get('Siblings', this)) {
			v.highlighted = true;
		}
	}

	mouseout() {
		this.highlighted = false;
		for(let v of this.get('Siblings', this)) {
			v.highlighted = false;
		}
	}

	get type() {
		return this.__type;
	}

	set type(value) {
		if(typeof value !== 'string')							throw new TypeError(0);
		if(!['close', 'minimize', 'maximize'].includes(value))	throw new RangeError(1);

		this.__type = value;
		for(let v of ['close', 'minimize', 'maximize']) {
			this.attributes[v] = v === value ? '' : undefined;
		}
	}
}