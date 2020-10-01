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

	get state() {
		return this.attributes['activated'] == '' ? true : false;
	}

	get action() {
		return this._.action;
	}

	set state(_value) {
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
		this.attributes['highlighted'] = '';
	}

	mouseleave() {
		this.attributes['highlighted'] = undefined;
		this.state = false;
	}

	mousedown(_event) {
		let _window = this.get('Superview', 'LFWindow'),
			_menu = new LFWorkspace().get('Subviews', 'LFMenu');

		_event.stopPropagation();
		if(_event.button == 0) {
			this.state = true;
		}
		if(_window) {
			_window.focus();
		}
		if(_menu) {
			LFMenu.deactivateAll();
		}
	}

	mouseup() {
		this.state = false;
	}
}