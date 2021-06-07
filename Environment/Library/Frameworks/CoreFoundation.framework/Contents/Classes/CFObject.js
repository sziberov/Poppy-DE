// noinspection JSAnnotator
return class CFObject {
	constructor() {
		let proxy = new Proxy(Object.create(this.constructor.prototype), {
			set: (target, key, value) => {
				let event = target[key] ? 'changed' : 'added';

				target[key] = value;

				CFEvent.dispatch(undefined, _title+'Changed', proxy, { event: event, key: key, value: value });

				return true;
			},
			deleteProperty: (target, key) => {
				if(key in target) {
					delete target[key]

					CFEvent.dispatch(undefined, _title+'Changed', proxy, { event: 'removed', key: key });

					return true;
				}
			}
		});

		Object.setPrototypeOf(this, proxy);
	}

	static addObserver(object, function_) {
		if(!Object.isObject(object) || !Object.isKindOf(object, this))	throw new TypeError(0);
		if(typeof function_ !== 'function')								throw new TypeError(1);

		return CFEvent.addHandler(_title+'Changed', (object_, ...arguments_) => {
			if(object_ === Object.getPrototypeOf(object)) {
				function_(...arguments_);
			}
		});
	}

	static removeObserver(observerId) {
		if(typeof observerId !== 'number') {
			throw new TypeError(0);
		}

		CFEvent.removeHandler(_title+'Changed', observerId);
	}

	static observable(object = {}, function_) {
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