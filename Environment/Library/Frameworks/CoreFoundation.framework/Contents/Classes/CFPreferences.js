// noinspection JSAnnotator
return class {
	constructor(identifier) {
		if(typeof identifier !== 'string') {
			return;
		}

		this.__user = new CFProcessInfo().user;
		this.__identifier = identifier;
		this.__properties;

		let file =
				CFFile.content('/Users/'+this.__user+'/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Library/Preferences/'+identifier+'.plist') ||
				CFFile.content('/Environment/Library/Preferences/'+identifier+'.plist') ||
				undefined;

		if(file) {
			this.__properties = JSON.parse(file);
		} else {
			return;
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