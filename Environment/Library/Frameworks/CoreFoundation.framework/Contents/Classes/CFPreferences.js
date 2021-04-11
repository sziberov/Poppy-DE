return class {
	constructor(identifier) {
		this.__user = new CFProcessInfo().user;
		this.__identifier;
		this.__properties;

		let file =
				CFFile.content('/Users/'+this.__user+'/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Environment/Library/Preferences/'+identifier+'.plist') ||
				undefined;

		if(!file) {
			return undefined;
		} else {
			this.__identifier = identifier;
			this.__properties = JSON.parse(file);
		}
	}

	get() {
		return this.__properties;
	}

	set(value) {
		this.__properties[value] = value;

		CFFile.content('/Users/'+this.__user+'/Library/Preferences/'+this.__identifier+'.plist', JSON.stringify(this.__properties));
	}
}