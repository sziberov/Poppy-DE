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

	set menu(_value) {
		this.subviews.removeByFilter(v => v.class == 'LFMenu');
		if(_value && _value.class == 'LFMenu') {
			this._.menu = _value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.click = undefined;
			this.subviews.add(this.menu);
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

	mouseover(_event) {
		let _shouldActivate = false;

		_event.stopPropagation();
		this.attributes['highlighted'] = '';
		if(this.menu) {
			if(this.superview.autoactivatesItems) {
				_shouldActivate = true;
			} else {
				for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
					if(v.state) {
						_shouldActivate = true;
					}
				}
			}
		}
		if(_shouldActivate) {
			this.menu.setState('Active', this);
		}
		if(this.superview.autoactivatesItems && this.action || _shouldActivate) {
			for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
				v.menu.setState('Inactive');
			}
		}
	}

	mousedown(_event) {
		_event.stopPropagation();
		if(_event.button == 0) {
			if(this.action && !this.menu) {
				this.state = true;
				for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
					v.menu.setState('Inactive');
				}
			} else
			if(this.menu && !this.superview.autoactivatesItems) {
				this.menu.setState('Toggle', this);
				LFMenu.deactivateAll(this.menu);
			}
		}
	}

	mouseup() {
		if(this.action) {
			if(!this.menu) {
				this.state = false;
			}
			LFMenu.deactivateAll();
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
		this.mousedown = (_event) => _event.stopPropagation();

		return this;
	}
}