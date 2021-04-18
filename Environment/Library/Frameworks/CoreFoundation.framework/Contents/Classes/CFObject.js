// noinspection JSAnnotator
return class extends Object {
	constructor(...arguments_) {
		super(...arguments_);

		this.__proxy = new Proxy(this, {
			set: (target, key, value) => {
				let event = target[key] ? 'changed' : 'added';

				target[key] = value;

				CFEventEmitter.dispatch('@TitleChanged', this.__proxy, { event: event, key: key, value: value });

				return true;
			},
			deleteProperty: (target, key) => {
				if(key in target) {
					delete target[key]

					CFEventEmitter.dispatch('@TitleChanged', this.__proxy, { event: 'removed', key: key });

					return true;
				}
			}
		})

		return this.__proxy;
	}

	static addObserver(object, function_) {
		if(typeof function_ === 'function') {
			return CFEventEmitter.addHandler('@TitleChanged', (object_, ...arguments_) => {
				if(object_ == object) {
					function_(...arguments_);
				}
			});
		}
	}

	static removeObserver(object, observerId) {
		CFEventEmitter.removeHandler('@TitleChanged', observerId);
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

	static equal(object = {}, object_ = {}) {
		return super.isEqual(object, object_);
	}
}