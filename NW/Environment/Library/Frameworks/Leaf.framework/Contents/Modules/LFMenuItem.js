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
		this.subviews = this.subviews.filter(v => v && v.class !== 'LFMenu');
		if(_value && _value.class == 'LFMenu') {
			this._.menu = _value;
			this.attributes['enabled'] = '';
			this.attributes['menu'] = '';
			this.click = undefined;
			this.subviews.push(this.menu);
		} else {
			this._.menu = undefined;
			if(!this.action) {
				this.attributes['enabled'] = undefined;
				this.attributes['menu'] = undefined;
				this.click = super.click;
			}
		}
	}

	mouseover(_event) {
		let _menu = this.menu;

		_event.stopPropagation();
		this.attributes['highlighted'] = '';
		if(_menu) {
			this.state = true;
			_menu.setState('Active', this);
		}
		for(let v of this.get('Siblings', this.class).filter(v => v.menu)) {
			v.state = false;
			v.menu.setState('Inactive');
		}
	}

	mousedown(_event) {
		_event.stopPropagation();
		if(this.action) {
			this.element.one('mouseup', () => {
				LFMenu.deactivateAll();
			});
		}
	}

	mouseup() {}

	separator() {
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