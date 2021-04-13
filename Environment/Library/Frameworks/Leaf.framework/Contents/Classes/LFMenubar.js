return $CFShared.@Title || _single(class extends LFView {
	constructor(_) {
		super(_);
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
		return this.subviews.filter(v => v.tag == 'main')[0]
	}

	get applicationMenu() {
		return this.subviews.filter(v => v.tag == 'application')[0]
	}

	get statusMenu() {
		return this.subviews.filter(v => v.tag == 'status')[0]
	}

	set transparent(value) {
		this._.transparent = value;
		this.attributes['transparent'] = value == true ? '' : undefined;
	}
});