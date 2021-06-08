// noinspection JSAnnotator
return class CFArray extends Array {
	__observers = []
	__handlerID;

	constructor(...arguments_) {
		super(...arguments_);

		Object.defineProperties(this, {
			__observers: {
				enumerable: false
			},
			__handlerID: {
				enumerable: false
			}
		});
	}

	set length(value) {	// Не работает
		if(value > this.length) {
			throw new RangeError(0);
		}

		while(this.length > value) {
			this.remove(this[this.length-1]);
		}
	}

	get length() {	// Не работает
		return super.length;
	}

	push() {}
	splice() {}
	includes() {}

	add(...value) {
		for(let v of value) {
			super.push(v);

			for(let v_ of this.__observers) {
				v_.function({ event: 'added', value: v });
			}
		}

		return this;
	}

	remove(...value) {
		for(let v of value) {
			if(this.contains(v)) {
				super.splice(this.indexOf(v), 1);

				for(let v_ of this.__observers) {
					v_.function({ event: 'removed', value: v });
				}
			}
		}

		return this;
	}

	removeAll() {
		this.length = 0;

		for(let v_ of this.__observers) {
			v_.function({ event: 'removedAll' });
		}

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

	addObserver(processInfo, function_) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(typeof function_ !== 'function')													throw new TypeError(1);

		let ID = this.__observers.length > 0 ? Math.max(...this.__observers.map(v => v.ID))+1 : 1;

		this.__observers.push({
			ID: ID,
			processID: processInfo.identifier,
			function: function_
		});
		if(!this.__handlerID) {
			this.__handlerID = CFEvent.addHandler('processListChanged', (a) => {
				if(a.event === 'removed') {
					for(let v of this.__observers.filter(v => v.processID === a.value)) {
						this.removeObserver(processInfo, v.ID);
					}
				}
			});
		}

		return ID;
	}

	removeObserver(processInfo, observerID) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(typeof observerID !== 'number')													throw new TypeError(1);

		this.__observers = this.__observers.filter(v => v.ID !== observerID && v.processID !== processInfo.identifier);
		if(this.__observers.length === 0) {
			this.__handlerID = CFEvent.removeHandler(this.__handlerID);
		}
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
		if(!Object.isKindOf(array, this)) {
			throw new TypeError(0);
		}

		return array.addObserver(CFProcessInfo.shared, function_);
	}

	static removeObserver(array, observerID) {
		if(!Object.isKindOf(array, this)) {
			throw new TypeError(0);
		}

		array.removeObserver(CFProcessInfo.shared, observerID);
	}
}