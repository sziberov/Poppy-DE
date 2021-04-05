return class extends LFButton {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			title: 'MenuItem',
			..._
		}
		this.menu = this.menu;
	}

	get menu() {
		return this._.menu;
	}

	set menu(value) {
		this.menu?.destroy();
		if(value && value.class == 'LFMenu') {
			this._.menu = value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.click = undefined;
			this.addSubviews([value]);
		} else {
			this._.menu = undefined;
			if(!this.action) {
				this.attributes['enabled'] = undefined;
				this.attributes['menu'] = undefined;
				this.click = super.click;
			}
		}
	}

	click() {}

	mouseover() {
		let shouldActivate = false;

		this.highlighted = true;
		if(this.menu) {
			if(this.superview.autoactivatesItems) {
				shouldActivate = true;
			} else {
				for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
					if(v.activated) {
						shouldActivate = true;
					}
				}
			}
		}
		if(shouldActivate) {
			this.menu.setActivated(true, this);
		}
		if(this.superview.autoactivatesItems && this.action || shouldActivate) {
			for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
				v.menu.setActivated(false);
			}
		}
	}

	mousedown(event) {
		if(event.button == 0) {
			if(this.action && !this.menu) {
				this.activated = true;
				for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
					v.menu.setActivated(false);
				}
			} else
			if(this.menu && !this.superview.autoactivatesItems) {
				this.menu.setActivated('Toggle', this);
				LFMenu.deactivateAll(this.menu);
			}
		}
	}

	mouseup() {
		if(this.action) {
			if(!this.menu) {
				this.activated = false;
				LFMenu.deactivateAll();
			}
			this.action();
		}
	}

	separator() {
		this.action = undefined;
		this.attributes = {
			'title': undefined,
			'separator': ''
		}
		for(let v of ['click', 'dblclick', 'contextmenu', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave', 'mousedown', 'mouseup', 'mousemove', 'drag']) {
			if(typeof this[v] === 'function') {
				this[v] = undefined;
			}
		}

		return this;
	}
}