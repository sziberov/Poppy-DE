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

	set highlighted(_value) {
		this.attributes['highlighted'] = _value == true ? '' : undefined;
	}

	set activated(_value) {
		this.attributes['activated'] = _value == true ? '' : undefined;
	}

	set action(_value) {
		if(typeof _value === 'function') {
			this._.action = _value;
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

	mousedown(_event, _exceptView) {
		_event.stopPropagation();
		if(_event.button == 0) {
			this.activated = true;
		}
		LFMenu.deactivateAll(_exceptView);
		this.get('Superview', 'LFWindow')?.focus();
	}

	mouseup() {
		this.activated = false;
	}
}