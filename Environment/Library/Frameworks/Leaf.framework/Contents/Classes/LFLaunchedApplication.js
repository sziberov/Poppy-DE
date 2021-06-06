// noinspection JSAnnotator
return class LFLaunchedApplication {
	static __shared;

	static get shared() {
		return this.__shared;
	}

	__application;

	constructor(application) {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}
		if(!Object.isKindOf(application, LFApplication)) {
			throw new TypeError(0);
		}

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
}