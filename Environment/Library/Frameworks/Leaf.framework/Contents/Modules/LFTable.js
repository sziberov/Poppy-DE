return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			subviews: [],
			..._
		}

		this.subviews.add(...this._.subviews);
	}

	get activeRow() {
		for(let v of this.subviews) {
			if(v.state == true) {
				return v;
			}
		}
	}

	mousedown(_event) {
		let _window = this.get('Superview', 'LFWindow');

		for(let v of this.subviews) {
			v.state = false;
		}
		if(_window) {
			_window.focus();
		}
	}
}