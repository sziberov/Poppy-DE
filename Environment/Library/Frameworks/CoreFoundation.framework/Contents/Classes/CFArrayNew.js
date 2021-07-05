// noinspection JSAnnotator
return class CFArray extends CFObject {
	static indexes(array) {
		let indexes = []

		for(let k in this.keys(array)) {
			if(k.isInteger()) {
				indexes.push(parseInt(k));
			}
		}

		return indexes;
	}

	/*
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
	*/

	[Symbol.collection] = true;

	__count = 0;

	constructor(array) {
		super();

		Object.defineProperty(this, '__count', {
			enumerable: false
		});

		if(array) {
			if(!Array.isArray(array)) {
				throw new TypeError(0);
			}

			this.add(...array);
		}
	}

	get count() {
		return this.__count;
	}

	set count(value) {
		if(value > this.count) {
			throw new RangeError(0);
		}

		while(this.count > value) {
			this.remove(this[this.count-1]);
		}
	}

	[Symbol.set](self, key, value) {
		if(typeof key !== 'number' && !key.isInteger()) {
			return super[Symbol.set](self, key, value);
		}

		let observers = this.constructor.__observation.observers.filter(v => v.object === this),
			in_ = key in this;

		for(let v of observers) {
			v.function(in_ ? 'willChange' : 'willAdd', key, value);
		}

		if(key >= this.count) {
			self[this.count] = value;
			this.__count = this.__count+1;
		} else {
			self[key] = value;
		}

		for(let v of observers) {
			v.function(in_ ? 'didChange' : 'didAdd', key, value);
		}

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: in_ ? 'changed' : 'added', key: key, value: value });
	}

	[Symbol.delete](self, key) {
		if(typeof key !== 'number' && !key.isInteger()) {
			return super[Symbol.delete](self, key);
		}

		if(key < this.count) {
			delete self[key]

			for(let k in this) {
				if(k >= key) {
					this[k-1] = this[k]
				}
			}

			delete self[this.count-1]
			this.__count = this.__count-1;
		}
	}

	[Symbol.iterator] = function*() {
		for(let v of Object.values(this)) {
			yield v;
		}
	}

	add(...value) {
		for(let v of value) {
			this[this.count] = v;
		}
	}

	firstIndex(value) {
		return this.constructor.indexes(this).find(k => this[k] === value);
	}

	first(function_) {
		for(let v of this) {
			if(function_(v)) {
				return v;
			}
		}
	}

	filter(function_) {
		let filter = []

		for(let v of this) {
			if(function_(v)) {
				filter.push(v);
			}
		}

		return new this.constructor(filter);
	}

	allSatisfy(function_) {
		for(let v of this) {
			if(!function_(v)) {
				return false;
			}
		}

		return true;
	}

	contains(value) {
		return this.first(v => v === value) !== undefined;
	}

	min() {
		let min;

		for(let v of this) {
			min = min === undefined ? v : v < min ? v : min;
		}

		return min;
	}

	max() {
		let max;

		for(let v of this) {
			max = max === undefined ? v : v > max ? v : max;
		}

		return max;
	}

	remove(...value) {
		for(let v of value) {
			if(this.contains(v)) {
				delete this[this.firstIndex(v)]
			}
		}
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
	}

	removeAll() {
		this.count = 0;
	}
}