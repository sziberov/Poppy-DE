// noinspection JSAnnotator
return class CFProcessInfo {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__info = _call('info');

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}
	}

	get identifier() {
		return this.__info.ID;
	}

	get parentIdentifier() {
		return this.__info.parentID;
	}

	get user() {
		return this.__info.user;
	}

	get path() {
		return this.__info.path;
	}

	get arguments() {
		return _arguments;
	}

	get environment() {
		return _environment;
	}

	get executable() {
		return this.environment._executable;
	}
}