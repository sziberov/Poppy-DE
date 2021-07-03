// Каждый наблюдатель обязан удаляться после завершения его породившего процесса.
// Для этого он должен быть так или иначе привязан к последнему: храниться в самой памяти процесса,
// либо в связанном с ним объекте ядра. Также, по-хорошему, он должен удаляться при недоступности
// наблюдаемого объекта, чтобы не занимать место в памяти.
//
// _Нынешняя реализация отвечает первому требованию, но не умеет автоматически следить за последним,
// так как объекты никогда не удаляются явно._
//
// noinspection JSAnnotator
return class CFObject extends Object {
	static __friends__ = [this]

	static addObserver(object, function_) {
		if(!this.isObject(object) || !this.isKindOf(object, this))	throw new TypeError(0);
		if(typeof function_ !== 'function')							throw new TypeError(1);

		return CFEvent.addHandler(_title+'Changed', (object_, ...arguments_) => {
			if(object_ === object) {
				function_(...arguments_);
			}
		});
	}

	static removeObserver(object, observerID) {
		if(!this.isObject(object) || !this.isKindOf(object, this))	throw new TypeError(0);
		if(typeof observerID !== 'number')							throw new TypeError(1);

		if(!CFEvent.removeHandler(observerID)) {
			return;
		}
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

	release() {
		for(let v of this.__observers) {
			this.removeObserver(v.ID);
		}

		if(this[Symbol.collection] === true) {
			for(let v of this) {
				v.release?.();
			}
		}

		this.destructor();
	}

	destructor() {
		for(let k in this) {
			if(Object.hasOwnProperty.call(this, k)) {
				this[k] = undefined;
			}
		}
	}
}