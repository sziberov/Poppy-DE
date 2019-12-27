return class {
	static add(_array = [], ..._value) {
		_array.push(..._value);
	}

	static remove(_array = [], _value) {
		_array.splice(_array.indexOf(_value), 1);
	}

	static contains(_array = [], _value) {
		return _array.includes(_value);
	}

	static observe(_array = [], _function) {
		return new Proxy(_array, {
			set: (t, k, v) => {
				t[k] = v;
				_function(k, v);

				return true;
			}
		});
	}

	/*
	constructor(_array) {
		this.array = _array || []
		this.observers = []

		this.array = new Proxy(this.array, {
			get: (t, p) => {
				return t[p] || this[p]
			},
			set: (t, p, v) => {
				if(this[p]) {
					this[p] = v;
				} else {
					t[p] = v;
					for(var f of this.observers) if(typeof f === 'function') f(p, v);
				}

				return true;
			}
		});

		return this.array;
	}

	add(..._value) {
		this.array.push(..._value);

		return this;
	}

	remove(_value) {
		this.array.splice(this.array.indexOf(_value), 1);

		return this;
	}

	contains(_value) {
		return this.array.includes(_value);
	}

	addObserver(..._function) {
		this.observers.push(..._function);

		return this;
	}

	removeObserver(_function) {
		this.observers.splice(this.observers.indexOf(_function), 1);

		return this;
	}
	*/
}