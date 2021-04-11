return _single(class {
	constructor() {
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
});