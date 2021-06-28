// По-хорошему, каждый наблюдатель обязан удаляться после завершения его породившего процесса.
// Для этого он должен быть так или иначе привязан к последнему, и желательно - на уровне ядра:
// храниться в самой памяти процесса, либо в связанном с ним объекте ядра.
// Также он должен удаляться при недоступности наблюдаемого объекта, но так как это не критично,
// то он может существовать и независимо от доступности наблюдаемого объекта.
// _Нынешняя реализация в целом отвечает этим требованиям, но имеет дыру безопасности:
// события изменений можно прослушивать глобально для любого объекта..._
//
// noinspection JSAnnotator
return class CFObject extends Object {
	static __friends__ = [this]

	__observers = []

	constructor() {
		super();

		for(let v of Object.keys(this)) {
			if(v.startsWith('_')) {
				Object.defineProperty(this, v, {
					enumerable: false
				});
			}
		}
	}

	static addObserver(object, function_) {
		if(!this.isObject(object) || !this.isKindOf(object, this))	throw new TypeError(0);
		if(typeof function_ !== 'function')							throw new TypeError(1);

		let ID = CFEvent.addHandler(_title+'Changed', (object_, ...arguments_) => {
			if(object_ === object) {
				function_(...arguments_);
			}
		});

		object.__observers.push(ID);

		return ID;
	}

	static removeObserver(object, observerID) {
		if(!this.isObject(object) || !this.isKindOf(object, this))	throw new TypeError(0);
		if(typeof observerID !== 'number')							throw new TypeError(1);
		if(!object.__observers.find(v => v === observerID))			throw new RangeError(2);

		if(!CFEvent.removeHandler(observerID)) {
			return;
		}

		object.__observers = object.__observers.filter(v => v !== observerID);
	}

	static observable(object = {}, function_) {	// Следовало бы убрать этот костыль
		return new Proxy(object, {
			set: (target, key, value) => {
				target[key] = value;
				function_(key, value);

				return true;
			}
		});
	}

	__set__(self, key, value) {
		this[key] = value;

		if(this.__observers.length > 0) {
			CFEvent.dispatch(undefined, _title+'Changed', self, { event: this[key] ? 'changed' : 'added', key: key, value: value });
		}
	}

	__delete__(self, key) {
		delete this[key]

		if(this.__observers.length > 0) {
			CFEvent.dispatch(undefined, _title+'Changed', self, { event: 'removed', key: key });
		}
	}

	shallowlyEquals(object) {
		return this.constructor.isShallowlyEqual(this, object);
	}
}