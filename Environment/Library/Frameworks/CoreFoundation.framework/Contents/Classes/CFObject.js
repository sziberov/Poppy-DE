// noinspection JSAnnotator
return class CFObject extends Object {
	__proxy;

	constructor(...arguments_) {
		super(...arguments_);

		this.__proxy = new Proxy(this, {
			set: (target, key, value) => {
				let event = target[key] ? 'changed' : 'added';

				target[key] = value;

				CFEvent.dispatch(undefined, _title+'Changed', this.__proxy, { event: event, key: key, value: value });

				return true;
			},
			deleteProperty: (target, key) => {
				if(key in target) {
					delete target[key]

					CFEvent.dispatch(undefined, _title+'Changed', this.__proxy, { event: 'removed', key: key });

					return true;
				}
			}
		});

		return this.__proxy;
	}

	static addObserver(object, function_) {
		if(!Object.isObject(object) || !Object.isKindOf(object, this))	throw new TypeError(0);
		if(typeof function_ !== 'function')								throw new TypeError(1);

		return CFEvent.addHandler(_title+'Changed', (object_, ...arguments_) => {
			if(object_ === object) {
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

	static shallowlyEqual(object = {}, object_ = {}) {
		return super.isShallowlyEqual(object, object_);
	}
}