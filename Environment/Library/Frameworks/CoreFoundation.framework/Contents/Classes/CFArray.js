// noinspection JSAnnotator
return class CFArray extends Array {
	constructor(...arguments_) {
		super(...arguments_);

		delete this.push;
		delete this.splice;
		delete this.includes;
	}

	set length(value) {
		if(value > this.length) {
			throw new RangeError(0);
		}

		while(this.length > value) {
			this.remove(this[this.length-1]);
		}
	}

	add(...value) {
		for(let v of value) {
			super.push(v);

			CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'added', value: v });
		}

		return this;
	}

	remove(...value) {
		for(let v of value) {
			if(this.contains(v)) {
				super.splice(this.indexOf(v), 1);

				CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'removed', value: v });
			}
		}

		return this;
	}

	removeAll() {
		this.length = 0;

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'removedAll' });

		return this;
	}

	removeByFilter(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let v of this) {
			if(function_(v)) {
				this.remove(v);
			}
		}

		return this;
	}

	contains(value) {
		return super.includes(value);
	}

	static add(array, ...value) {
		if(!super.isArray(array)) {
			throw new TypeError(0);
		}

		(array.add || array.push)(...value);
	}

	static remove(array, ...value) {
		if(!super.isArray(array)) {
			throw new TypeError(0);
		}

		for(let v of value) {
			if(array.contains?.(v)) {
				array.remove(v);
			} else
			if(array.includes(v)) {
				array.splice(array.indexOf(v), 1);
			}
		}
	}

	static contains(array, value) {
		if(!super.isArray(array)) {
			throw new TypeError(0);
		}

		return (array.contains || array.includes)(value);
	}

	static addObserver(array, function_) {
		if(!super.isArray(array))			throw new TypeError(0);
		if(typeof function_ !== 'function')	throw new TypeError(1);

		return CFEvent.addHandler(_title+'Changed', (array_, ...arguments_) => {
			if(array_ === array) {
				function_(...arguments_);
			}
		});
	}

	static removeObserver(observerId) {
		if(typeof observerId !== 'number') {
			throw new TypeError();
		}

		CFEvent.removeHandler(_title+'Changed', observerId);
	}
}