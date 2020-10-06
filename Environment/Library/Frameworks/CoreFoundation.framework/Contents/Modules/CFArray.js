return class extends Array {
	#tag = Date.now().toString().split('').sort(() => (Math.random()-0.5)).join('');

	constructor(..._arguments) {
		super(..._arguments);

		delete this.push;
		delete this.splice;
		delete this.includes;
	}

	get tag() {
		return this.#tag;
	}

	set length(_value) {}

	add(..._value) {
		for(let v of _value) {
			super.push(v);

			CFEventEmitter.dispatch('arrayChanged.'+this.tag, { event: 'added', value: v });
		}

		return this;
	}

	remove(..._value) {
		for(let v of _value) {
			if(this.contains(v)) {
				super.splice(this.indexOf(v), 1);

				CFEventEmitter.dispatch('arrayChanged.'+this.tag, { event: 'removed', value: v });
			}
		}

		return this;
	}

	removeAll() {
		/*
		super.length = 0;

		CFEventEmitter.dispatch('arrayChanged.'+this.tag, { event: 'removedAll' });
		*/
		this.remove(...this);

		return this;
	}

	removeByFilter(_function) {
		if(typeof _function === 'function') {
			for(let v of this) {
				if(_function(v)) {
					this.remove(v);
				}
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

	static addObserver(_array, _function) {
		if(typeof _function === 'function') {
			CFEventEmitter.addHandler('arrayChanged.'+_array.tag, _function);
		}

		return _function;
	}

	static removeObserver(_array, _function) {
		CFEventEmitter.removeHandler('arrayChanged.'+_array.tag, _function);
	}
}