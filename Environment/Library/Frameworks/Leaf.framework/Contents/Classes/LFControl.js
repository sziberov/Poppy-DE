return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			action: undefined,
			..._
		}
		this.action = this.action;
	}

	get highlighted() {
		return this.attributes['highlighted'] == '' ? true : false;
	}

	get activated() {
		return this.attributes['activated'] == '' ? true : false;
	}

	get enabled() {
		return this.attributes['enabled'] == '' ? true : false;
	}

	get action() {
		return this._.action;
	}

	set highlighted(value) {
		this.attributes['highlighted'] = value == true ? '' : undefined;
	}

	set activated(value) {
		this.attributes['activated'] = value == true ? '' : undefined;
	}

	set action(value) {
		if(typeof value === 'function') {
			this._.action = value;
			this.attributes['enabled'] = '';
		} else {
			this._.action = undefined;
			this.attributes['enabled'] = undefined;
		}
	}

	click() {
		if(this.action) {
			this.action();
		}
	}

	mouseover() {
		this.highlighted = true;
	}

	mouseleave() {
		this.highlighted = false;
		this.activated = false;
	}

	mousedown(event, exceptView) {
		event.stopPropagation();
		if(event.button == 0) {
			this.activated = true;
		}
		LFMenu.deactivateAll(exceptView);
		this.get('Superview', 'LFWindow')?.focus();
	}

	mouseup() {
		this.activated = false;
	}
}