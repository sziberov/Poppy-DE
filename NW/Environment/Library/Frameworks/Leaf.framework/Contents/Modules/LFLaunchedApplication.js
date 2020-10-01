return _single(class {
	#application;

	constructor(_application) {
		this.#application = _application;
	}

	get processIdentifier() {
		return this.#application.process.identifier;
	}

	get bundle() {
		return this.#application.bundle;
	}

	get identifier() {
		return this.#application.identifier;
	}

	get executable() {
		return this.#application.executable;
	}

	get title() {
		return this.#application.title;
	}

	get version() {
		return this.#application.version;
	}

	get license() {
		return this.#application.license;
	}

	get icon() {
		return this.#application.icon;
	}

	focus(..._arguments) {
		this.#application.focus(..._arguments);
	}

	cautiously(..._arguments) {
		this.#application.cautiously(..._arguments);
	}

	quit(..._arguments) {
		this.#application.quit(..._arguments);
	}
});