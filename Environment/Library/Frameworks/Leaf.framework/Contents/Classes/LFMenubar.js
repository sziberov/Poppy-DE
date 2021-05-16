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

	draw() {
		let layer = this.__layer;

		layer.width = CGScreen.frame.width;
		layer.height = 48;

	//	layer.drawLayer(new CGImage(LFWorkspace.shared.desktopImage), 0, 0, '100', '100');
	//	layer.blur(0, 0, layer.width, layer.height/2, 4, true, true);
		layer.drawGradient([
			[0, CGColor('100','100','100', '75')],
			[1, CGColor('100','100','100', '25')]
		], 0, 0, layer.width, layer.height/2, 0, 0, 0, layer.height/2);
		layer.drawGradient([
			[0, CGColor('0','0','0', '25')],
			[1, CGColor('0','0','0', '0')]
		], 0, layer.height/2, layer.width, layer.height/2, 0, 0, 0, layer.height/2);
	}
}