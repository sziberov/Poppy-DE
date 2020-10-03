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
		this.attributes['title'] = _value;
	}

	set image(_value) {
		this.subviews.removeByFilter(v => v.class == 'LFImage');
		if(_value?.class == 'LFImage') {
			this._.image = _value;
			this.subviews.add(_value);
		} else {
			this._.image = undefined;
		}
	}

	set menu(_value) {
		this.subviews.removeByFilter(v => v.class == 'LFMenu');
		if(_value?.class == 'LFMenu') {
			this._.menu = _value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.subviews.add(_value);
		} else {
			this._.menu = undefined;
			if(!this.action) {
				this.attributes['enabled'] = undefined;
				this.attributes['menu'] = undefined;
			}
		}
	}

	mouseleave() {
		this.attributes['highlighted'] = undefined;
		if(!this.menu) {
			this.state = false;
		}
	}

	mousedown(_event) {
		super.mousedown(_event, this.menu);

		if(!this.action && this.menu && _event.button == 0) {
			this.menu.setState('Toggle', this);
		} else {

		}
	}

	mouseup() {
		if(!this.menu) {
			super.mouseup();
		}
	}

	destroy() {
		for(let v of this.subviews.filter(v => v.class == 'LFMenu')) {
			v.destroy();
		}

		super.destroy();
	}
}