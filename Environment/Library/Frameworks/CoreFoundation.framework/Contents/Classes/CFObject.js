// noinspection JSAnnotator
return class CFObject extends Object {
	__observers = []
	__observersHandlerID;

	addObserver(processInfo, function_) {
		if(!Object.isObject(processInfo) || !Object.isMemberOf(processInfo, CFProcessInfo))	throw new TypeError(0);
		if(typeof function_ !== 'function')													throw new TypeError(1);

		if(this.__observers.length === 0) {
			let clone = Object.create(this.constructor.prototype);

			for(let k of Object.keys(this)) {
				if(Object.hasOwnProperty.call(this, k)) {
					clone[k] = this[k]

					delete this[k]
				}
			}

			let proxy = new Proxy(clone, {
				set: (target, key, value) => {
					let event = target[key] ? 'changed' : 'added';

					target[key] = value;

					if(this.__observers) {
						for(let v_ of this.__observers) {
							v_.function({ event: event, key: key, value: value });
						}
					}

					return true;
				},
				deleteProperty: (target, key) => {
					if(key in target) {
						delete target[key]

						if(this.__observers) {
							for(let v_ of this.__observers) {
								v_.function({ event: 'removed', key: key });
							}
						}

						return true;
					}
				}
			});

			Object.setPrototypeOf(this, proxy);
		}

		let ID = this.__observers.length > 0 ? Math.max(...this.__observers.map(v => v.ID))+1 : 1;

		this.__observers.push({
			ID: ID,
			processInfo: processInfo,
			function: function_
		});
		if(this.__observersHandlerID === undefined) {
			this.__observersHandlerID = CFEvent.addHandler('processListChanged', (a) => {
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

			let proto = this.__proto__;

			Object.setPrototypeOf(this, proto.constructor.prototype);

			for(let k of Object.keys(proto)) {
				if(Object.hasOwnProperty.call(proto, k)) {
					this[k] = proto[k]

					delete proto[k]	// Вероятно не нужно
				}
			}
		}
	}

	static keys(object) {
		if(!Object.isObject(object)) {
			throw new TypeError(0);
		}

		return Object.isKindOf(object, this) && object.__observers?.length > 0 ? Object.keys(object.__proto__) : Object.keys(object);
	}

	static values(object) {
		if(!Object.isObject(object)) {
			throw new TypeError(0);
		}

		return Object.isKindOf(object, this) && object.__observers?.length > 0 ? Object.values(object.__proto__) : Object.values(object);
	}

	static entries(object) {
		if(!Object.isObject(object)) {
			throw new TypeError(0);
		}

		return Object.isKindOf(object, this) && object.__observers?.length > 0 ? Object.entries(object.__proto__) : Object.entries(object);
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
		return Object.isShallowlyEqual(this, object);
	}
}