// noinspection JSAnnotator
return class {
	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__info = _request('info');

	identifier = this.__info.id;
	parentIdentifier = this.__info.parentId;
	user = this.__info.user;
	path = this.__info.path;
	arguments = _arguments;
	environment = _environment;

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}
	}

	get executable() {
		return this.environment._executable;
	}
}