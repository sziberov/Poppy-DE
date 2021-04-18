// noinspection JSAnnotator
return class extends LFResponder {
	constructor(_) {
		super();

		this.class = '@Title';
		this._ = {
			tag: undefined,
			..._
		}

		this.__constraints = new CFArray();
		this.__subviews = new CFArray();

		this.superview;
	//	CFArray.addObserver(this.__subviews, () => {});
	}

	get subviews() {
		return this.__subviews;
	}

	get tag() {
		return this._.tag;
	}

	set subviews(value) {
		for(let k = this.subviews.length; k--;) {
			this.subviews[k].destroy();
		}
		this.addSubviews(value);
	}

	set tag(value) {
		this._.tag = value;
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
					if(!this.element || !$.contains(view.element[0], this.element[0])) {
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
					if(superview.class !== value) {
						if(!superview.superview) {
							superview = undefined;
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
				return this.superview.subviews.filter(v => !CFObject.equal(v, this) && v.class == value);
			},
			Subviews: () => {
				/*
				var subview = undefined,
					current = this;

				function check() {
					for(var v of current.subviews) {
						if(v.class == value) {
							subview = v;
							return subview;
						}
					}
				}
				check();

				return subview;
				*/

				return this.subviews.filter(v => v.class == value);
			},
			TaggedSubviews: () => {
				return this.subviews.filter(v => v.tag == value);
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
			window[this.class].destroyInstance?.();
		}
	}
}