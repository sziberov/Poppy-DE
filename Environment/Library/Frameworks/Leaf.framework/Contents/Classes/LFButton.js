// noinspection JSAnnotator
return class LFButton extends LFControl {
	__minWidth;
	__title;
	__image;
	__menu;

	constructor({ minWidth, title = 'Button', image, menu } = {}) {
		super(...arguments);

		this.minWidth = minWidth;
		this.title = title;
		this.image = image;
		this.menu = menu;

	//	this.attributes['tabIndex'] = 0;
	}

	get minWidth() {
		return this.__minWidth;
	}

	get title() {
		return this.__title;
	}

	get image() {
		return this.__image;
	}

	get menu() {
		return this.__menu;
	}

	set minWidth(value) {
		if(value) {
			if(typeof value !== 'number')	throw new TypeError();
			if(value < 0)					throw new RangeError();
		}

		this.__minWidth = value;
		this.style['min-width'] = value || '';
	}

	set title(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__title = value;
		this.attributes['title'] = value === '' ? undefined : value;
	}

	set image(value) {
		if(value && !Object.isKindOf(value, LFImage)) {
			throw new TypeError();
		}

		this.__image = value;
		this.attributes['image'] = value ? '' : undefined;
		this.image?.destroy();
		if(value) {
			this.addSubviews([value]);
		}
	}

	set menu(value) {
		if(value && !Object.isKindOf(value, LFMenu)) {
			throw new TypeError();
		}

		this.__menu = value;
		this.attributes['menu'] = value ? '' : undefined;
		this.menu?.destroy();
		if(value) {
			this.attributes['enabled'] = '';
			this.addSubviews([value]);
		} else
		if(!this.action) {
			this.attributes['enabled'] = undefined;
		}
	}

	mouseleave() {
		this.highlighted = false;
		if(!this.menu) {
			this.activated = false;
		}
	}

	mousedown(event) {
		super.mousedown(event, this.menu);

		if(!this.action && this.menu && event.button === 0) {
			this.menu.setActivated('Toggle', this);
		} else
		if(this.action && this.menu && event.button === 0) {
			// TODO
		}
	}

	mouseup() {
		if(!this.menu) {
			super.mouseup();
		}
	}

	didAdd() {
		this.menu.add(this);
	}

	destroy() {
		this.menu?.destroy();

		super.destroy();
	}
}