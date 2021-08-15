// noinspection JSAnnotator
return class CFPreferences {
	static async new(identifier) {
		let self = new this();

		await self.setIdentifier(identifier);

		return self;
	}

	__identifier;
	__properties;

	async setIdentifier(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		this.__identifier = value;
		this.__properties = await _call('readPref', value);
	}

	get(key) {
		return key != null ? this.__properties[key] : this.__properties;
	}

	async set(key, value) {
		this.__properties[key] = value;

		await _call('writePref', this.__identifier, this.__properties);
	}
}