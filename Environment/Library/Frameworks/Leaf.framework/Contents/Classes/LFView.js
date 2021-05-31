// noinspection JSAnnotator
return class extends LFResponder {
	__superview;
	__subviews = new CFArray();
	__subviews_;
	__layer = new CGLayer();
	__tag;
	__type;
	__tight;
	__xAlign;
	__yAlign;

//	_constraints = new CFArray();

	class = _title;

	constructor({ tag, type = 'horizontal', tight = false, xAlign = 'start', yAlign = 'start', subviews } = {}) {
		super();

		this.__subviews_ = subviews;
		this.__type = type;
		this.__tight = tight;
		this.__xAlign = xAlign;
		this.__yAlign = yAlign;

		this.tag = tag;

	//	CFArray.addObserver(this.__subviews, () => {});
	}

	get superview() {
		return this.__superview;
	}

	get subviews() {
		return this.__subviews;
	}

	get tag() {
		return this.__tag;
	}

	set superview(value) {
		this.__superview = value;
	}

	set subviews(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError();
		}

		for(let k = this.subviews.length; k--;) {
			this.subviews[k].destroy();
		}
		if(value) {
			this.addSubviews(value.filter(v => v));
		}
	}

	set tag(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__tag = value;
	}

	create() {
		if(this.class === _title) {
			this.attributes = {
				'vertical': this.__type === 'vertical' ? '' : undefined,
				'tight': this.__tight === true ? '' : undefined,
				['x'+this.__xAlign]: ['center', 'end'].includes(this.__xAlign) ? '' : undefined,
				['y'+this.__yAlign]: ['center', 'end', 'stretch'].includes(this.__yAlign) ? '' : undefined
			}
			if(this.__subviews_) {
				this.subviews = this.__subviews_;
			}
		}

		return super.create();
	}

	add(view) {
		let mode =
				!view ? 'View' :
				view.subviews && this.subviews ? 'Subview' :
				undefined,
			add = {
				View: () => {
					super.add();

					return true;
				},
				Subview: () => {
					let did = false;

					if(!view.subviews.contains(this)) {
						did = true;

						view.subviews.add(this);
					}
					if(!this.element && view.element || view.element && !$.contains(view.element[0], this.element[0])) {
						did = true;

						this.remove();
						this.element = this.create().appendTo(view.element);
					}
					this.superview = view;

					return did;
				}
			}

		if(mode && add[mode]()) {
			this.addSubviews(this.subviews);
			if(typeof this.didAdd === 'function') {
				this.didAdd();
			}
			if(typeof this.superview?.didAddSubview === 'function') {
				this.superview.didAddSubview();
			}
		}

		return this;
	}

	addSubviews(subviews) {
		for(let v of subviews) {
			v.add(this);
		}

		return this;
	}

	get(mode, value) {
		return {
			Superview: () => {
				let superview = this.superview;

				while(superview) {
					if(!Object.isKindOf(superview, value)) {
						if(!superview.superview) {
							superview = undefined;

							break;
						} else {
							superview = superview.superview;
						}
					} else {
						break;
					}
				}

				return superview;
			},
			Siblings: () => {
				return this.superview.subviews.filter(v => v !== this && Object.isKindOf(v, value));
			},
			Subviews: () => {
				/*
				var subview = undefined,
					current = this;

				function check() {
					for(var v of current.subviews) {
						if(Object.isKindOf(v, value)) {
							subview = v;
							return subview;
						}
					}
				}
				check();

				return subview;
				*/

				return this.subviews.filter(v => Object.isKindOf(v, value));
			},
			TaggedSubviews: () => {
				return this.subviews.filter(v => v.tag === value);
			}
		}[mode]();
	}

	remove() {
		super.remove();

		for(let v of this.subviews) {
			v.remove();
		}
	}

	destroy() {
		for(let v of this.subviews) {
			v.superview = undefined;
		//	v.destroy();
		}
		if(!this.superview) {
			super.destroy();
		} else {
			this.remove();
			this.superview.subviews.remove(this);
		//	this.superview.subviews = this.superview.subviews.filter(v => v !== this);
			this.constructor.destroyShared?.();
		}
	}
}