// noinspection JSAnnotator
return $CFShared.@Title || class extends LFView {
	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	constructor(_) {
		super(...arguments);
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.class = '@Title';
		this._ = {
			...this._,
			transparent: false,
			..._
		}

		this.attributes['transparent'] = this._.transparent == true ? '' : undefined;
		this.subviews.add(
			new LFMenu({ tag: 'main', autoactivatesItems: false }),
			new LFMenu({ tag: 'application', autoactivatesItems: false }),
			new LFMenu({ tag: 'status', autoactivatesItems: false })
		);

		this.applicationMenu.attributes['application'] = '';
		this.statusMenu.attributes['status'] = '';
	}

	get transparent() {
		return this._.transparent;
	}

	get mainMenu() {
		return this.subviews.find(v => v.tag == 'main');
	}

	get applicationMenu() {
		return this.subviews.find(v => v.tag == 'application');
	}

	get statusMenu() {
		return this.subviews.find(v => v.tag == 'status');
	}

	set transparent(value) {
		this._.transparent = value;
		this.attributes['transparent'] = value == true ? '' : undefined;
	}
}