// noinspection JSAnnotator
return class extends LFView {
	__string;
	__size;
	__weight;

	class = _title;

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
			throw new TypeError();
		}

		this.__string = value;
		this.text = value === '' ? undefined : value;
	}

	set size(value) {
		if(typeof value !== 'string')					throw new TypeError();
		if(!['small', 'medium', 'big'].includes(value))	throw new RangeError();

		this.__size = value;
		for(let v of ['small', 'medium', 'big']) {
			this.attributes[v] = v === value ? '' : undefined;
		}
	}

	set weight(value) {
		if(value) {
			if(typeof value !== 'string')	throw new TypeError();
			if(value !== 'bold')			throw new RangeError();
		}

		this.__weight = value;
		this.attributes['bold'] = value ? '' : undefined;
	}
}