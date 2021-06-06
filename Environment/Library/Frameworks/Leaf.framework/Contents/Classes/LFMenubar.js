// noinspection JSAnnotator
return $CFShared[_title] || class LFMenubar extends LFView {
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

		layer.width = CGScreen.size.width;
		layer.height = 48;

		let width = layer.width,
			height = layer.height/2;

		if(!this.transparent) {
			layer.context.drawRectangle(CGColor('100', '100', '100'), 0, 0, width, height);
			layer.context.drawGradient([
				[0, CGColor('100', '100', '100', 0.0625)],
				[1, CGColor(0, 0, 0, 0.5)]
			], 0, 0, width, height, 0, 0, 0, height);
			layer.context.drawRectangle(CGColor('100', '100', '100'), 0, 0, width, 1);
			layer.context.drawRectangle(CGColor('25', '25', '25'), 0, height-1, width, 1);
		} else {
			let blurMask = new CGLayer({ width: width, height: height });

			blurMask.context.drawRectangle(CGColor('100', '100', '100'), 0, 0, width, height);

			layer.backgroundFilters = [{ title: 'blur', mask: blurMask, amount: 4 }]

			layer.context.drawGradient([
				[0, CGColor('100', '100', '100', 0.75)],
				[1, CGColor('100', '100', '100', 0.25)]
			], 0, 0, width, height, 0, 0, 0, height);
			layer.context.drawRectangle(CGColor('100', '100', '100', 0.25), 0, 0, width, 1);
			layer.context.drawRectangle(CGColor(0, 0, 0, 0.5), 0, height-1, width, 1);
		}

		layer.context.drawGradient([
			[0, CGColor(0, 0, 0, 0.25)],
			[1, CGColor(0, 0, 0, 0)]
		], 0, height, width, height, 0, 0, 0, height);
	}
}