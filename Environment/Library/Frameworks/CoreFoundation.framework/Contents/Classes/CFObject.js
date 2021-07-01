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

	constructor(object) {
		super();

		for(let k in object) {
			if(['__proto__', '__friends__', '__get__', '__set__', '__call__', '__delete__'].includes(k)) {
				continue;
			}
			if(['get', 'set', 'call', 'delete'].includes(k)) {
				Object.defineProperty(this, '__'+k+'__', {
					value: object[k],
					writable: true,
					enumerable: false,
					configurable: true
				});
			} else {
				this[k] = object[k]
			}
		}
	}

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

	__get__(self, key) {
		let value = self[key]

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'get', key: key });

		return value;
	}

	__set__(self, key, value) {
		self[key] = value;

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: self[key] ? 'changed' : 'added', key: key });
	}

	__call__(self, key, ...arguments_) {
		let value = self[key](...arguments_);

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'called', key: key });

		return value;
	}

	__delete__(self, key) {
		delete self[key]

		CFEvent.dispatch(undefined, _title+'Changed', this, { event: 'removed', key: key });
	}

	shallowlyEquals(object) {
		return this.constructor.isShallowlyEqual(this, object);
	}

	release() {
	//	for(let v of this.__observers) {}

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