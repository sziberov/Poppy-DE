return class extends LFResponder {
	#subviews = new CFArray();

	constructor(_) {
		super();
		this.class = '@Title';
		this._ = {
			tag: undefined,
			..._
		}

		this.superview;
	//	CFArray.addObserver(this.#subviews, () => {});
	}

	get subviews() {
		return this.#subviews;
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
			if(typeof this.didAddSubview === 'function') {
				this.didAddSubview();
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
				var superview = this.superview;

				function check() {
					if(superview.class !== value) {
						if(!superview.superview) {
							superview = undefined;
						} else {
							superview = superview.superview;
							check();
						}
					}
				}
				check();

				return superview;
			},
			Siblings: () => {
				return this.superview.subviews.filter(v => v !== this && v.class == value);
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
			window[this.class].remove;
		}
	}
}