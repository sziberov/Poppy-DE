return class extends Array {
	constructor(..._arguments) {
		super(..._arguments);

		delete this.push;
		delete this.splice;
		delete this.includes;
	}

	set length(value) {}

	add(...value) {
		for(let v of value) {
			super.push(v);

			CFEventEmitter.dispatch('@TitleChanged', this, { event: 'added', value: v });
		}

		return this;
	}

	remove(...value) {
		for(let v of value) {
			if(this.contains(v)) {
				super.splice(this.indexOf(v), 1);

				CFEventEmitter.dispatch('@TitleChanged', this, { event: 'removed', value: v });
			}
		}

		return this;
	}

	removeAll() {
		/*
		super.length = 0;

		CFEventEmitter.dispatch('@TitleChanged', this, { event: 'removedAll' });
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
		if(super.isArray(array) && typeof _function === 'function') {
			return CFEventEmitter.addHandler('@TitleChanged', (_array, ..._arguments) => {
				if(_array == array) {
					_function(..._arguments);
				}
			});
		}
	}

	static removeObserver(array, observerId) {
		CFEventEmitter.removeHandler('@TitleChanged', observerId);
	}
}