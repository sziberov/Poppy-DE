// noinspection JSAnnotator
return class CFArray extends Array {
	__observers = []
	__observersHandlerID;

	constructor(...arguments_) {
		super(...arguments_);

		Object.defineProperties(this, {
			__observers:			{ enumerable: false },
			__observersHandlerID:	{ enumerable: false }
		});
	}

	set count(value) {
		if(value > this.count) {
			throw new RangeError(0);
		}

		while(this.count > value) {
			this.remove(this[this.count-1]);
		}
	}

	get count() {
		return this.length;
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
			processInfo: processInfo,
			function: function_
		});
		if(this.__observersHandlerID === undefined) {
			this.__observersHandlerID = CFEvent.addHandler('processListChanged', (a) => {	// Не удаляется вместе с объектом, его создавшим
				if(a.event === 'removed') {
					for(let v of this.__observers.filter(v => v.processInfo.identifier === a.value)) {
						this.removeObserver(v.processInfo, v.ID);
					}
				}
			});
		}

		return ID;
	}

	removeObserver(processInfo, observerID) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))				throw new TypeError(0);
		if(typeof observerID !== 'number')																throw new TypeError(1);
		if(!this.__observers.find(v => v.ID === observerID && v.processInfo === processInfo))	throw new RangeError(2);

		this.__observers = this.__observers.filter(v => v.ID !== observerID && v.processInfo !== processInfo);
		if(this.__observers.length === 0) {
			this.__observersHandlerID = CFEvent.removeHandler(this.__observersHandlerID);
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