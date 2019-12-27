return class extends LFResponder {
	constructor(_) {
		super();
		this.class = '@Title';
		this._ = {
			tag: undefined,
			..._
		}

		this.tag = this._.tag;
		this.superview;
		this.subviews = []
	}

	create() {
		if(this.class == 'LFView') {
			this._ = {
				type: 'horizontal',
				tight: false,
				xAlign: 'start',
				yAlign: 'start',
				subviews: [],
				...this._
			}

			this.attributes = {
				'vertical': this._.type == 'vertical' ? '' : undefined,
				'tight': this._.tight == true ? '' : undefined,
				['x'+this._.xAlign]: ['center', 'end'].includes(this._.xAlign) ? '' : undefined,
				['y'+this._.yAlign]: ['center', 'end', 'stretch'].includes(this._.yAlign) ? '' : undefined
			}
			this.subviews = this._.subviews;
		}

		return super.create();
	}

	add(_view) {
		var _mode =
				!this.element && !_view ? 'View' :
				!this.element && _view.subviews && this.subviews ? 'Subview' :
				undefined,
			_add = {
				View: () => super.add(),
				Subview: () => {
					if(!_view.subviews.includes(this)) {
						_view.subviews.push(this);
					}
					this.element = this.create().appendTo(_view.element);
					this.superview = _view;
				}
			}

		if(_mode) {
			_add[_mode]();
			this.addSubviews(this.subviews);
			if(typeof this.didAddSubview === 'function') this.didAddSubview();
		}

		return this;
	}

	addSubviews(_subviews) {
		for(var v of _subviews) v.add(this);

		return this;
	}

	setSubviews(_subviews) {
		for(var v of this.subviews) v.destroy();
		this.addSubviews(_subviews);

		return this;
	}

	get(_mode, _value) {
		return {
			Tag: () => {
				var _tag = this.subviews.filter(v => v.tag == _value);

				if(_tag.length > 1) return _tag;

				return _tag[0];
			},
			Superview: () => {
				var _superview = this.superview;

				function check() {
					if(_superview.class !== _value) {
						if(!_superview.superview) {
							_superview = undefined;
						} else {
							_superview = _superview.superview;
							check();
						}
					}
				}
				check();

				return _superview;
			},
			Siblings: () => {
				return this.superview.subviews.filter(v => v != this && v.class == _value);
			},
			/*
			Subview: () => {
				var _subview = undefined,
					_current = this;

				function check() {
					for(var v of _current.subviews) {
						if(v.class == _value) {
							_subview = v;
							return _subview;
						}
					}
				}
				check();

				return _subview;
			}
			*/
		}[_mode]();
	}

	destroy() {
		if(!this.superview) {
			super.destroy();
		} else {
			this.remove();
			this.superview.subviews = this.superview.subviews.filter(v => v !== this);
		}
	}
}