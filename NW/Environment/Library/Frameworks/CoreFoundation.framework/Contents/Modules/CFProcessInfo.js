return _single(class {
	#info = _request('info');

	constructor() {
		this.identifier = this.#info.id;
		this.parentIdentifier = this.#info.parentId;
		this.user = this.#info.user;
		this.path = this.#info.path;
		this.environment = window;
		this.arguments = window._arguments;
		this.executable = new Proxy({}, {
			get(target, property) {
				return window._executable[property]
			}
		});
	}
});