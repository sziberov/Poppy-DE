return class extends LFResponder {
	constructor(_) {
		super();
		this.class = '@Title';
		this._ = {
			tag: undefined,
			..._
		}

		this.superview;
		this.subviews = new CFArray();
	}

	get tag() {
		return this._.tag;
	}

	set tag(_value) {
		this._.tag = _value;
	}

	create() {
		if(this.class == '@Title') {
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
			this.subviews.add(...this._.subviews);
		}

		return super.create();
	}

	add(_view) {
		let _mode =
				!_view ? 'View' :
				_view.subviews && this.subviews ? 'Subview' :
				undefined,
			_add = {
				View: () => {
					super.add();

					return true;
				},
				Subview: () => {
					let _did = false;

					if(!_view.subviews.contains(this)) {
						_did = true;

						_view.subviews.add(this);
					}
					if(!this.element || !$.contains(_view.element[0], this.element[0])) {
						_did = true;

						this.remove();
						this.element = this.create().appendTo(_view.element);
					}
					this.superview = _view;

					return _did;
				}
			}

		if(_mode && _add[_mode]()) {
			this.addSubviews(this.subviews);
			if(typeof this.didAddSubview === 'function') {
				this.didAddSubview();
			}
		}

		return this;
	}

	addSubviews(_subviews) {
		for(let v of _subviews) {
			v.add(this);
		}

		return this;
	}

	setSubviews(_subviews) {
		for(let k = this.subviews.length; k--;) {
			this.subviews[k].destroy();
		}
		/*
		for(let v of this.subviews) {
			v.destroy();
		}
		*/
		this.addSubviews(_subviews);

		return this;
	}

	get(_mode, _value) {
		return {
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
				return this.superview.subviews.filter(v => v !== this && v.class == _value);
			},
			Subviews: () => {
				/*
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
				*/

				return this.subviews.filter(v => v.class == _value);
			},
			TaggedSubviews: () => {
				return this.subviews.filter(v => v.tag == _value);
			}
		}[_mode]();
	}

	remove() {
		super.remove();

		for(var v of this.subviews) {
			v.remove();
		}
	}

	destroy() {
		for(var v of this.subviews) {
			v.superview = undefined;
		//	v.destroy();
		}
		if(!this.superview) {
			super.destroy();
		} else {
			this.remove();
			this.superview.subviews.remove(this);
		//	this.superview.subviews = this.superview.subviews.filter(v => v !== this);
			window[this.class].remove;
		}
	}
}