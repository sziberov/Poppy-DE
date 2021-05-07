return class extends LFControl {
	constructor(_) {
		super(...arguments);
		this.class = '@Title';
		this._ = {
			...this._,
			minWidth: undefined,
			title: 'Button',
			image: undefined,
			menu: undefined,
			..._
		}
		this.minWidth = this.minWidth;
		this.title = this.title;
		this.image = this.image;
		this.menu = this.menu;

	//	this.attributes['tabIndex'] = 0;
	}

	get minWidth() {
		return this._.minWidth;
	}

	get title() {
		return this._.title;
	}

	get image() {
		return this._.image;
	}

	get menu() {
		return this._.menu;
	}

	set minWidth(value) {
		this._.minWidth = value;
		this.style['min-width'] = value;
	}

	set title(value) {
		this._.title = value;
		this.attributes['title'] = value?.length > 0 ? value : undefined;
	}

	set image(value) {
		this.image?.destroy();
		if(value?.class == 'LFImage') {
			this._.image = value;
			this.attributes['image'] = '';
			this.addSubviews([value]);
		} else {
			this._.image = undefined;
			this.attributes['image'] = undefined;
		}
	}

	set menu(value) {
		this.menu?.destroy();
		if(value?.class == 'LFMenu') {
			this._.menu = value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.addSubviews([value]);
		} else {
			this._.menu = undefined;
			if(!this.action) {
				this.attributes['enabled'] = undefined;
				this.attributes['menu'] = undefined;
			}
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

		if(!this.action && this.menu && event.button == 0) {
			this.menu.setActivated('Toggle', this);
		} else {

		}
	}

	mouseup() {
		if(!this.menu) {
			super.mouseup();
		}
	}

	didAdd() {
		this.menu = this.menu;
	}

	destroy() {
		this.menu?.destroy();

		super.destroy();
	}
}