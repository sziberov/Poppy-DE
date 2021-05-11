// noinspection JSAnnotator
return class {
	__user = CFProcessInfo.shared.user;
	__identifier;
	__properties;

	constructor(identifier) {
		this.identifier = identifier;
	}

	set identifier(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		let file =
			CFFile.content('/Users/'+this.__user+'/Library/Preferences/'+value+'.plist') ||
			CFFile.content('/Library/Preferences/'+value+'.plist') ||
			CFFile.content('/Environment/Library/Preferences/'+value+'.plist') ||
			undefined;

		if(!file) {
			throw new RangeError();
		}

		this.__identifier = value;
		this.__properties = JSON.parse(file);
	}

	get() {
		return this.__properties;
	}

	set(value) {
		this.__properties[value] = value;

		CFFile.content('/Users/'+this.__user+'/Library/Preferences/'+this.__identifier+'.plist', JSON.stringify(this.__properties));
	}
}