// noinspection JSAnnotator
return class CFPreferences {
	__identifier;
	__properties;

	constructor(identifier) {
		this.identifier = identifier;
	}

	set identifier(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		this.__identifier = value;
		this.__properties = _call('readPref', value);
	}

	get() {
		return this.__properties;
	}

	set(value) {
		this.__properties[value] = value;

		_call('writePref', this.__identifier, this.__properties);
	}
}