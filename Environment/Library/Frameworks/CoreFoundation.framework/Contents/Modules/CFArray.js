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

	set length(value) {}

	add(...value) {
		for(let v of value) {
			super.push(v);

			CFEventEmitter.dispatch('arrayChanged.'+this.tag, { event: 'added', value: v });
		}

		return this;
	}

	remove(...value) {
		for(let v of value) {
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

	contains(value) {
		return super.includes(value);
	}

	static add(array = [], ...value) {
		if(array.add) {
			array.add(...value);
		} else
		if(array.push) {
			array.push(...value);
		}
	}

	static remove(array = [], ...value) {
		for(let v of value) {
			if(array.contains && array.contains(v)) {
				array.remove(v);
			} else
			if(array.includes && array.includes(v)) {
				array.splice(array.indexOf(v), 1);
			}
		}
	}

	static contains(array = [], value) {
		return array.contains && array.contains(value) || array.includes && array.includes(value);
	}

	static addObserver(array, _function) {
		if(typeof _function === 'function') {
			CFEventEmitter.addHandler('arrayChanged.'+array.tag, _function);
		}

		return _function;
	}

	static removeObserver(array, _function) {
		CFEventEmitter.removeHandler('arrayChanged.'+array.tag, _function);
	}
}