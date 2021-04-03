return class {
	#user = new CFProcessInfo().user;
	#identifier;
	#properties;

	constructor(identifier) {
		let file =
				CFFile.content('/Users/'+this.#user+'/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Environment/Library/Preferences/'+identifier+'.plist') ||
				undefined;

		if(!file) {
			return undefined;
		} else {
			this.#identifier = identifier;
			this.#properties = JSON.parse(file);
		}
	}

	get() {
		return this.#properties;
	}

	set(value) {
		this.#properties[value] = value;

		CFFile.content('/Users/'+this.#user+'/Library/Preferences/'+this.#identifier+'.plist', JSON.stringify(this.#properties));
	}
}