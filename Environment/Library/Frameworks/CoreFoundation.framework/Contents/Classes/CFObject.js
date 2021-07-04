// Каждый наблюдатель обязан автоматически удаляться:
// - После завершения его породившего процесса.
// - При недоступности наблюдаемого объекта.
//
// noinspection JSAnnotator
return class CFObject extends Object {
	static __friends__ = [this]
	static __observation = {
		handlerID: undefined,
		observers: []
	}

	static assign(object, ...arguments_) {
		for(let object_ of arguments) {
			for(let key in object_) {
				if(Object.hasOwnProperty.call(object_, key)) {
					object[key] = object_[key]
				}
			}
		}
	}

	static addObserver(object, function_) {
		if(!this.isObject(object) || !this.isKindOf(object, this)) {
			throw new TypeError(0);
		}

		object.addObserver(CFProcessInfo.shared, function_);
	}

	static removeObserver(object, observerID) {
		if(!this.isObject(object) || !this.isKindOf(object, this)) {
			throw new TypeError(0);
		}

		object.removeObserver(CFProcessInfo.shared, observerID);
	}

	[Symbol.collection] = false;

	constructor(object) {
		super();

		if(object) {
			if(!Object.isObject(object) || !Object.isMemberOf(object, Object)) {
				throw new TypeError(0);
			}

			this[Symbol.collection] = true;

			for(let k in object) {
				if(['__proto__', '__friends__'].includes(k) || typeof object[k] === 'symbol') {
					continue;
				}
				if(['@@collection', '@@get', '@@set', '@@call', '@@delete'].includes(k)) {
					this[Symbol[k.substring(2)]] = object[k]
				} else {
					this[k] = object[k]
				}
			}
		}
	}

	[Symbol.get](self, key) {
		let value = self[key]

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'get', key: key });

		return value;
	}

	[Symbol.set](self, key, value) {
		self[key] = value;

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: key in self ? 'changed' : 'added', key: key });
	}

	[Symbol.call](self, key, ...arguments_) {
		let value = self[key](...arguments_);

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'called', key: key });

		return value;
	}

	[Symbol.delete](self, key) {
		delete self[key]

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'removed', key: key });
	}

	shallowlyEquals(object) {
		return this.constructor.isShallowlyEqual(this, object);
	}

	addObserver(processInfo, function_) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(typeof function_ !== 'function')													throw new TypeError(1);

		/*
		return CFEvent.addHandler(_title+'Changed', (object_, ...arguments_) => {
			if(object_ === object) {
				function_(...arguments_);
			}
		});
		*/
	}

	removeObserver(processInfo, observerID) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(typeof observerID !== 'number')													throw new TypeError(1);

		/*
		if(!CFEvent.removeHandler(observerID)) {
			return;
		}
		*/
	}

	release() {
		for(let v of this.constructor.__observation.observers) {
			this.removeObserver(v.processInfo, v.ID);
		}

		if(this[Symbol.collection] === true) {
			for(let v of Object.values(this).filter(v => Object.isObject(v))) {
				v.release?.();
			}
		}

		this.destructor();
	}

	destructor() {
		for(let k of [...Object.getOwnPropertyNames(this), ...Object.getOwnPropertySymbols(this)]) {
			delete this[k]
		}

		this.__proto__ = null;
	}
}