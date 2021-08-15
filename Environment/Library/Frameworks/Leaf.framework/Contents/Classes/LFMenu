// noinspection JSAnnotator
return class LFMenu extends LFView {
	__x;
	__y;
	__corners = []
	__title;
	__autoactivatesItems;

	target;
	application;

	constructor({ x = 24, y = 48, corners, title = 'Menu', items, autoactivatesItems = true } = {}) {
		super(...arguments);

		this.origin = {
			x: x,
			y: y,
			corners: corners
		}
		this.items = items;
		this.autoactivatesItems = autoactivatesItems;
	}

	get activated() {
		return this.attributes['activated'] === '';
	}

	get origin() {
		return {
			x: this.__x,
			y: this.__y,
			corners: [...this.__corners]
		}
	}

	get title() {
		return this.__title;
	}

	get items() {
		return this.subviews.filter(v => Object.isKindOf(v, LFMenuItem));
	}

	get autoactivatesItems() {
		return this.__autoactivatesItems;
	}

	set activated(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.attributes['activated'] = value ? '' : undefined;
	}

	set origin(value) {
		if(!Object.isObject(value))										throw new TypeError();
		if(!value.x || !value.y)										throw new TypeError();
		if(typeof value.x !== 'number' || typeof value.y !== 'number')	throw new TypeError();
		if(value.corners && !Array.isArray(value.corners))				throw new TypeError();
		if(value.x < 0 || value.y < 0)									throw new RangeError();

		this.__x = value.x;
		this.__y = value.y;
		this.__corners = value.corners || []
		this.style['transform'] = 'translate('+value.x+'px, '+value.y+'px)';
		for(let v of ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']) {
			this.attributes[v] = (value.corners || []).includes(v) ? '' : undefined;
		}
	}

	set title(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__title = value;
	}

	set items(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError();
		}

		this.subviews = value ? value.filter(v => Object.isKindOf(v, LFMenuItem)) : undefined
	}

	set autoactivatesItems(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__autoactivatesItems = value;
	}

	mousedown(event) {
		event.stopPropagation();
	}

	add(view) {
		super.add(Object.isKindOf(view, LFMenubar) ? view : LFWorkspace.shared);

		return this;
	}

	setActivated(mode, view) {
		this.target = view ? view : this.target;

		if((mode === true || mode === 'Toggle') && this.activated === false) {
			let topDepth = 0,
				element = this.target?.element,
				side = this.target?.get('Superview', LFMenubar) ? 'Bottom' : 'TopRight',
				origin = {
					Default: () => {
						return { x: Math.round(this.__x), y: Math.round(this.__y), corners: [] }
					},
					Bottom: () => {
						let offsetX = element.offset().left || this.__x,
							offsetY = element.offset().top+element.outerHeight() || this.__y;

						offsetX = offsetX+(offsetX+this.element.outerWidth() > LFWorkspace.shared.element.outerWidth() ? element.outerWidth()-this.element.outerWidth() : 0);

						return { x: Math.round(offsetX), y: Math.round(offsetY), corners: ['topLeft', 'topRight'] }
					},
					TopRight: () => {
						let offsetX = element.offset().left+element.outerWidth() || this.__x,
							offsetY = element.offset().top-4 || this.__y;

						return { x: Math.round(offsetX), y: Math.round(offsetY), corners: ['topLeft'] }
					}
				}[element ? side : 'Default']();

			for(let v of [...LFWorkspace.shared.get('Subviews', this), ...LFWorkspace.shared.get('Subviews', LFWindow)]) {
				topDepth = v.element ? Math.max(topDepth, Number.parseInt(v.element.css('z-index'))) : 0;
			}
			this.style['z-index'] = topDepth+1;
			if(Object.isKindOf(this.target, LFButton) || Object.isKindOf(this.target, LFMenuItem)) {
				if(Object.isKindOf(this.target, LFButton)) {
					this.target.menu = this;
				}
				this.target.activated = true;
			}
			this.origin = origin;
			this.activated = true;
		} else
		if((mode === false || mode === 'Toggle') && this.activated === true) {
			if(Object.isKindOf(this.target, LFButton) || Object.isKindOf(this.target, LFMenuItem)) {
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

	release() {
		this.setActivated(false);
		for(let v of this.subviews) {
			v.menu?.release();
		}

		super.release();
	}

	static deactivateAll(view) {
		let exceptList = [],
			exceptCheck = () => {
				if(view) {
					if(Object.isKindOf(view, LFMenu)) {
						exceptList.push(view);

						view = view.target;
					} else
					if(Object.isKindOf(view, LFMenuItem)) {
						view = view.superview;
					} else {
						view = undefined;
					}
					exceptCheck();
				}
			}

		exceptCheck();
		for(let v of LFWorkspace.shared.get('Subviews', this).filter(v => !exceptList.includes(v))) {
			v.setActivated(false);
		}
	}
}