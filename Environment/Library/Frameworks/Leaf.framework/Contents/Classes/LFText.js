// noinspection JSAnnotator
return class LFText extends LFView {
	__string;
	__size;
	__weight;

	constructor({ string = 'Text', size = 'medium', weight } = {}) {
		super(...arguments);

		this.string = string;
		this.size = size;
		this.weight = weight;
	}

	get string() {
		return this.__string;
	}

	get size() {
		return this.__size;
	}

	get weight() {
		return this.__weight;
	}

	set string(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError(0);
		}

		this.__string = value;
		this.text = value === '' ? undefined : value;
	}

	set size(value) {
		if(typeof value !== 'string')					throw new TypeError(0);
		if(!['small', 'medium', 'big'].includes(value))	throw new RangeError(1);

		this.__size = value;
		for(let v of ['small', 'medium', 'big']) {
			this.attributes[v] = v === value ? '' : undefined;
		}
	}

	set weight(value) {
		if(value) {
			if(typeof value !== 'string')	throw new TypeError(0);
			if(value !== 'bold')			throw new RangeError(1);
		}

		this.__weight = value;
		this.attributes['bold'] = value ? '' : undefined;
	}
}