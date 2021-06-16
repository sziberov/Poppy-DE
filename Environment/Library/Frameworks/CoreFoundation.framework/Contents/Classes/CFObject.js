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

	static addObserver(object, function_) {
		if(!this.isObject(object) || !this.isKindOf(object, this))	throw new TypeError(0);
		if(typeof function_ !== 'function')							throw new TypeError(1);

		if(object.__observers.length === 0) {
			let clone = this.create(object.constructor.prototype);

			for(let k of this.keys(object)) {
				if(new this().hasOwnProperty.call(object, k)) {
					clone[k] = object[k]

					delete object[k]
				}
			}

			object.__proto__ = new Proxy(clone, {
				set: (target, key, value) => {
					let event = target[key] ? 'changed' : 'added';

					target[key] = value;

					CFEvent.dispatch(undefined, _title+'Changed', object, { event: event, key: key, value: value });

					return true;
				},
				deleteProperty: (target, key) => {
					if(key in target) {
						delete target[key]

						CFEvent.dispatch(undefined, _title+'Changed', object, { event: 'removed', key: key });

						return true;
					}
				}
			});
		}

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
		if(object.__observers.length === 0) {
			let proto = object.__proto__;

			this.setPrototypeOf(object, proto.constructor.prototype);

			for(let k of this.keys(proto)) {
				if(new this().hasOwnProperty.call(proto, k)) {
					object[k] = proto[k]

					delete proto[k]	// Вероятно не нужно
				}
			}
		}
	}

	static keys(object) {
		if(!this.isObject(object)) {
			throw new TypeError(0);
		}

		return this.isKindOf(object, this) && object.__observers?.length > 0 ? super.keys(object.__proto__) : super.keys(object);
	}

	static values(object) {
		if(!this.isObject(object)) {
			throw new TypeError(0);
		}

		return this.isKindOf(object, this) && object.__observers?.length > 0 ? super.values(object.__proto__) : super.values(object);
	}

	static entries(object) {
		if(!this.isObject(object)) {
			throw new TypeError(0);
		}

		return this.isKindOf(object, this) && object.__observers?.length > 0 ? super.entries(object.__proto__) : super.entries(object);
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

	shallowlyEquals(object) {
		return this.constructor.isShallowlyEqual(this, object);
	}
}