return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			x: 24,
			y: 48,
			corners: [],
			title: 'Menu',
			items: [],
			autoactivatesItems: true,
			..._
		}
		this.origin = this._;

		this.subviews.add(...this._.items.filter(v => v.class == 'LFMenuItem'));
		this.target;
	}

	get activated() {
		return this.attributes['activated'] == '' ? true : false;
	}

	get title() {
		return this._.title;
	}

	get items() {
		return this._.items;
	}

	get autoactivatesItems() {
		return this._.autoactivatesItems;
	}

	set activated(value) {
		this.attributes['activated'] = value == true ? '' : undefined;
	}

	set origin(value) {
		this._.x = value.x;
		this._.y = value.y;
		this.style['transform'] = 'translate('+value.x+'px, '+value.y+'px)';
		for(let v of value.corners) {
			this.attributes[v] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(v) ? '' : undefined;
		}
	}

	set items(value) {
		value = value.filter(v => v.class == 'LFMenuItem');

		this._.items = value;
		this.subviews = value;
	}

	set autoactivatesItems(value) {
		if([false, true].includes(value)) {
			this._.autoactivatesItems = value;
		}
	}

	mousedown(event) {
		event.stopPropagation();
	}

	add(view) {
		super.add(view?.class == 'LFMenubar' ? view : new LFWorkspace());

		return this;
	}

	setActivated(mode, view) {
		this.target = view ? view : this.target;

		if((mode == true || mode == 'Toggle') && this.activated == false) {
			let topDepth = 0,
				element = this.target?.element,
				side = this.target?.get('Superview', 'LFMenubar') ? 'Bottom' : 'TopRight',
				origin = {
					Default: () => {
						return { x: Math.round(this._.x), y: Math.round(this._.y), corners: [] }
					},
					Bottom: () => {
						let _offsetX = element.offset().left || this._.x,
							_offsetY = element.offset().top+element.outerHeight() || this._.y;

						_offsetX = _offsetX+(_offsetX+this.element.outerWidth() > new LFWorkspace().element.outerWidth() ? element.outerWidth()-this.element.outerWidth() : 0);

						return { x: Math.round(_offsetX), y: Math.round(_offsetY), corners: ['topLeft', 'topRight'] }
					},
					TopRight: () => {
						let _offsetX = element.offset().left+element.outerWidth() || this._.x,
							_offsetY = element.offset().top-4 || this._.y;

						return { x: Math.round(_offsetX), y: Math.round(_offsetY), corners: ['topLeft'] }
					}
				}[element ? side : 'Default']();

			for(let v of [...new LFWorkspace().get('Subviews', this.class), ...new LFWorkspace().get('Subviews', 'LFWindow')]) {
				topDepth = v.element ? Math.max(topDepth, Number.parseInt(v.element.css('z-index'))) : 0;
			}
			this.style['z-index'] = topDepth+1;
			if(['LFButton', 'LFMenuItem'].includes(this.target?.class)) {
				if(this.target?.class == 'LFButton') {
					this.target.menu = this;
				}
				this.target.activated = true;
			}
			this.origin = origin;
			this.activated = true;
		} else
		if((mode == false || mode == 'Toggle') && this.activated == true) {
			if(['LFButton', 'LFMenuItem'].includes(this.target?.class)) {
				this.target.activated = false;
			}
			this.activated = false;
		}
		for(let v of this.subviews) {
			v.highlighted = false;
			if(v.menu) {
				v.activated = false;
				v.menu.setActivated(false);
			}
		}
	}

	destroy() {
		this.setActivated(false);
		for(let v of this.subviews) {
			v.menu?.destroy();
		}

		super.destroy();
	}

	static deactivateAll(view) {
		let exceptList = [],
			exceptCheck = () => {
				if(view) {
					if(view.class == 'LFMenu') {
						exceptList.push(view);

						view = view.target;
					} else
					if(view.class == 'LFMenuItem') {
						view = view.superview;
					} else {
						view = undefined;
					}
					exceptCheck();
				}
			}

		exceptCheck();
		for(let v of new LFWorkspace().get('Subviews', '@Title')) {
			if(!exceptList.includes(v)) {
				v.setActivated(false);
			}
		}
	}
}