return _single(class {
	constructor(application) {
		this.__application = application;
	}

	get processIdentifier() {
		return this.__application.process.identifier;
	}

	get bundle() {
		return this.__application.bundle;
	}

	get identifier() {
		return this.__application.identifier;
	}

	get executable() {
		return this.__application.executable;
	}

	get title() {
		return this.__application.title;
	}

	get version() {
		return this.__application.version;
	}

	get license() {
		return this.__application.license;
	}

	get icon() {
		return this.__application.icon;
	}

	focus(...arguments_) {
		this.__application.focus(...arguments_);
	}

	cautiously(...arguments_) {
		this.__application.cautiously(...arguments_);
	}

	quit(...arguments_) {
		this.__application.quit(...arguments_);
	}
});