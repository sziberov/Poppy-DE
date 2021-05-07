// noinspection JSAnnotator
return class {
	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.__info = _request('info');

		this.identifier = this.__info.id;
		this.parentIdentifier = this.__info.parentId;
		this.user = this.__info.user;
		this.path = this.__info.path;
		this.arguments = _arguments;
		this.environment = _environment;
	}

	get executable() {
		return this.environment._executable;
	}
}