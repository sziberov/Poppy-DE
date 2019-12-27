return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			x: 24,
			y: 48,
			title: 'Menu',
			items: [],
			..._
		}

		this.style['transform'] = 'translate('+this._.x+'px, '+this._.y+'px)';
		this.subviews = this._.items.filter(v => v.class == 'LFMenuItem');
	}

	didAddSubview() {
		$(window).on('mousedown', (_event) => {
			if(_event.target != this.element[0]) this.state = false;
		});
	}

	get title() {
		return this._.title;
	}

	get state() {
		return this.attributes['active'] == '' ? true : false;
	}

	set origin(_value) {
		this._.x = _value.x;
		this._.y = _value.y;
		this.style['transform'] = 'translate('+_value.x+'px, '+_value.y+'px)';
	}

	set state(_value) {
		this.attributes['active'] = _value == true ? '' : undefined;
	}
}