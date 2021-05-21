// noinspection JSAnnotator
return class {
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
		this.__properties = _request('readPref', value);
	}

	get() {
		return this.__properties;
	}

	set(value) {
		this.__properties[value] = value;

		_request('writePref', this.__identifier, this.__properties);
	}
}