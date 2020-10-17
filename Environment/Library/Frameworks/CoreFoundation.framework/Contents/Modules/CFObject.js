return class extends Object {
	#proxy;

	constructor(..._arguments) {
		super(..._arguments);

		this.#proxy = new Proxy(this, {
			get: (target, key) => {
				CFEventEmitter.dispatch('@TitleChanged', this.#proxy, { event: 'get', key: key });

				return target[key]
			},
			set: (target, key, value) => {
				target[key] = value;

				CFEventEmitter.dispatch('@TitleChanged', this.#proxy, { event: 'set', key: key, value: value });
			},
			deleteProperty: (target, key) => {
				if(key in target) {
					delete target[key]

					CFEventEmitter.dispatch('@TitleChanged', this.#proxy, { event: 'removed', key: key });
				}
			}
		})

		return this.#proxy;
	}

	static addObserver(object, _function) {
		if(typeof _function === 'function') {
			return CFEventEmitter.addHandler('@TitleChanged', (_object, ..._arguments) => {
				if(_object == object) {
					_function(..._arguments);
				}
			});
		}
	}

	static removeObserver(object, observerId) {
		CFEventEmitter.removeHandler('@TitleChanged', observerId);
	}

	static observe(object = {}, _function) {
		return new Proxy(object, {
			set: (target, key, value) => {
				target[key] = value;
				_function(key, value);

				return true;
			}
		});
	}
}