return class extends Array {
	#code = Date.now().toString().split('').sort(() => (Math.random()-0.5)).join('');

	constructor(..._arguments) {
		super(..._arguments);

		delete this.push;
		delete this.splice;
		delete this.includes;
	}

	get code() {
		return this.#code;
	}

	add(..._value) {
		for(let v of _value) {
			super.push(v);

			CFEventEmitter.dispatch('arrayChanged.'+this.code, { event: 'added', value: v });
		}

		return this;
	}

	remove(..._value) {
		for(let v of _value) {
			if(this.contains(v)) {
				super.splice(this.indexOf(v), 1);

				CFEventEmitter.dispatch('arrayChanged.'+this.code, { event: 'removed', value: v });
			}
		}

		return this;
	}

	contains(_value) {
		return super.includes(_value);
	}

	static add(_array = [], ..._value) {
		if(_array.add) {
			_array.add(..._value);
		} else
		if(_array.push) {
			_array.push(..._value);
		}
	}

	static remove(_array = [], ..._value) {
		for(let v of _value) {
			if(_array.contains && _array.contains(v)) {
				_array.remove(v);
			} else
			if(_array.includes && _array.includes(v)) {
				_array.splice(_array.indexOf(v), 1);
			}
		}
	}

	static contains(_array = [], _value) {
		return _array.contains && _array.contains(_value) || _array.includes && _array.includes(_value);
	}

	static observe(_array = [], _function) {
		return new Proxy(_array, {
			set: (t, k, v) => {
			//	if(k !== 'length' || k == 'length' && t[k] > v) {
					t[k] = v;
					_function(k, v);
			//	} else {
			//		t[k] = v;
			//	}

				return true;
			}
		});
	}

	static addObserver(_array, _function) {
		if(_array.code && typeof _function === 'function') {
			CFEventEmitter.addHandler('arrayChanged.'+_array.code, _function);
		}

		return _function;
	}

	static removeObserver(_array, _function) {
		if(_array.code) {
			CFEventEmitter.removeHandler('arrayChanged.'+_array.code, _function);
		}
	}
}