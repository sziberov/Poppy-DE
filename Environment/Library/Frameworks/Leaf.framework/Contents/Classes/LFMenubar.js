// noinspection JSAnnotator
return $CFShared[_title] || class extends LFView {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	static destroyShared() {
		this.__shared = undefined;
	}

	__transparent;

	class = _title;

	constructor({ transparent = false } = {}) {
		super(...arguments);
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.transparent = transparent;

		this.subviews.add(
			new LFMenu({ tag: 'main', autoactivatesItems: false }),
			new LFMenu({ tag: 'application', autoactivatesItems: false }),
			new LFMenu({ tag: 'status', autoactivatesItems: false })
		);

		this.applicationMenu.attributes['application'] = '';
		this.statusMenu.attributes['status'] = '';
	}

	get transparent() {
		return this.__transparent;
	}

	get mainMenu() {
		return this.subviews.find(v => v.tag === 'main');
	}

	get applicationMenu() {
		return this.subviews.find(v => v.tag === 'application');
	}

	get statusMenu() {
		return this.subviews.find(v => v.tag === 'status');
	}

	set transparent(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__transparent = value;
		this.attributes['transparent'] = value === true ? '' : undefined;
	}
}