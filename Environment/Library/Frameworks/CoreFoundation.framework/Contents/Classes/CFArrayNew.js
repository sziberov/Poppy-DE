// noinspection JSAnnotator
return class CFArray extends CFObject {
	static add(array, ...value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
			throw new TypeError(0);
		}

		(array.add || array.push)(...value);
	}

	static contains(array, value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
			throw new TypeError(0);
		}

		return (array.contains || array.includes)(value);
	}

	static remove(array, ...value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
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

	get empty() {
		return this.count === 0;
	}

	set count(value) {
		if(value > this.count) {
			throw new RangeError(0);
		}

		while(this.count > value) {
			this.removeLast();
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

	[Symbol.iterator]() {
		let done,
			value,
			k = 0;

		return {
			next: () => {
				if(k < this.count) {
					done = false;
					value = this[k]
					k = k+1;
				} else {
					done = true;
				}

				return {
					done: done,
					value: value
				}
			}
		}
	}

	add(...value) {
		for(let v of value) {
			this[this.count] = v;
		}
	}

	first(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let v of this) {
			if(function_(v)) {
				return v;
			}
		}
	}

	firstIndex({ of, where } = {}) {
		if(where && typeof where !== 'function') {
			throw new TypeError(0);
		}

		for(let k = 0; k < this.count; k++) {
			if(!where ? this[k] === of : where(this[k])) {
				return k;
			}
		}
	}

	last(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let k = this.count-1; k > -1; k--) {
			if(function_(this[k])) {
				return this[k]
			}
		}
	}

	lastIndex({ of, where } = {}) {
		if(where && typeof where !== 'function') {
			throw new TypeError(0);
		}

		for(let k = this.count-1; k > -1; k--) {
			if(!where ? this[k] === of : where(this[k])) {
				return k;
			}
		}
	}

	filter(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		let filter = []

		for(let v of this) {
			if(function_(v)) {
				filter.push(v);
			}
		}

		return new this.constructor(filter);
	}

	allSatisfy(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let v of this) {
			if(!function_(v)) {
				return false;
			}
		}

		return true;
	}

	contains(value) {
		return this.firstIndex({ of: value }) !== undefined;
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
				delete this[this.firstIndex({ of: v })]
			}
		}
	}

	removeFirst(times = 1) {
		if(!Number.isInteger(times))		throw new TypeError(0);
		if(times < 0 || times > this.count)	throw new RangeError(1);
		if(this.count < 1)					return;

		let value = times === 1 ? this[0] : undefined;

		for(let i = 0; i < times; i++) {
			delete this[0]
		}

		return value;
	}

	removeLast(times = 1) {
		if(!Number.isInteger(times))		throw new TypeError(0);
		if(times < 0 || times > this.count)	throw new RangeError(1);
		if(this.count < 1)					return;

		let value = times === 1 ? this[this.count-1] : undefined;

		for(let i = 0; i < times; i++) {
			delete this[this.count-1]
		}

		return value;
	}

	removeAll({ where, keepCount = false } = {}) {
		if(where && typeof where !== 'function')	throw new TypeError(0);
		if(typeof keepCount !== 'boolean')			throw new TypeError(1);

		if(!keepCount) {
			if(!where) {
				this.count = 0;
			} else {
				for(let k = this.count-1; k > -1; k--) {
					if(where(this[k])) {
						delete this[k]
					}
				}
			}
		} else {
			for(let k = 0; k < this.count; k++) {
				if(!where || where && where(this[k])) {
					this[k] = undefined;
				}
			}
		}
	}
}