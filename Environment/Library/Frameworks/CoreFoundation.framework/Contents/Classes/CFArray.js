// noinspection JSAnnotator
return class extends Array {
	constructor(...arguments_) {
		super(...arguments_);

		delete this.push;
		delete this.splice;
		delete this.includes;
	}

	set length(value) {}

	add(...value) {
		for(let v of value) {
			super.push(v);

			CFEventEmitter.dispatch(_title+'Changed', this, { event: 'added', value: v });
		}

		return this;
	}

	remove(...value) {
		for(let v of value) {
			if(this.contains?.(v)) {
				super.splice(this.indexOf(v), 1);

				CFEventEmitter.dispatch(_title+'Changed', this, { event: 'removed', value: v });
			}
		}

		return this;
	}

	removeAll() {
		/*
		super.length = 0;

		CFEventEmitter.dispatch(_title+'Changed', this, { event: 'removedAll' });
		*/
		this.remove(...this);

		return this;
	}

	removeByFilter(function_) {
		if(typeof function_ === 'function') {
			for(let v of this) {
				if(function_(v)) {
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
		(array.add || array.push)?.(...value);
	}

	static remove(array = [], ...value) {
		for(let v of value) {
			if(array.contains?.(v)) {
				array.remove(v);
			} else
			if(array.includes?.(v)) {
				array.splice(array.indexOf(v), 1);
			}
		}
	}

	static contains(array = [], value) {
		return (array.contains || array.includes)?.(value);
	}

	static addObserver(array, function_) {
		if(super.isArray(array) && typeof function_ === 'function') {
			return CFEventEmitter.addHandler(_title+'Changed', (array_, ...arguments_) => {
				if(array_ === array) {
					function_(...arguments_);
				}
			});
		}
	}

	static removeObserver(array, observerId) {
		CFEventEmitter.removeHandler(_title+'Changed', observerId);
	}
}