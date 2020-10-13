return _single(class {
	#info = _request('info');

	constructor() {
		this.identifier = this.#info.id;
		this.parentIdentifier = this.#info.parentId;
		this.user = this.#info.user;
		this.path = this.#info.path;
		this.arguments = _arguments;
		this.environment = _environment;
	}

	get executable() {
		return this.environment._executable;
	}
});