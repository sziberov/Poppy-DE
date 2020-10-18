return class extends LFControl {
	constructor(_) {
		super(_);
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

	set minWidth(_value) {
		this._.minWidth = _value;
		this.style['min-width'] = _value;
	}

	set title(_value) {
		this._.title = _value;
		this.attributes['title'] = _value?.length > 0 ? _value : undefined;
	}

	set image(_value) {
		this.image?.destroy();
		if(_value?.class == 'LFImage') {
			this._.image = _value;
			this.attributes['image'] = '';
			this.addSubviews([_value]);
		} else {
			this._.image = undefined;
			this.attributes['image'] = undefined;
		}
	}

	set menu(_value) {
		this.menu?.destroy();
		if(_value?.class == 'LFMenu') {
			this._.menu = _value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.addSubviews([_value]);
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

	mousedown(_event) {
		super.mousedown(_event, this.menu);

		if(!this.action && this.menu && _event.button == 0) {
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