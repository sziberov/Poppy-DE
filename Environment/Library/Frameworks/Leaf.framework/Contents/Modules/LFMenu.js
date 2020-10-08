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

	set activated(_value) {
		this.attributes['activated'] = _value == true ? '' : undefined;
	}

	set origin(_value) {
		this._.x = _value.x;
		this._.y = _value.y;
		this.style['transform'] = 'translate('+_value.x+'px, '+_value.y+'px)';
		for(let v of _value.corners) {
			this.attributes[v] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(v) ? '' : undefined;
		}
	}

	set items(_value) {
		_value = _value.filter(v => v.class == 'LFMenuItem');

		this._.items = _value;
		this.subviews = _value;
	}

	set autoactivatesItems(_value) {
		if([false, true].includes(_value)) {
			this._.autoactivatesItems = _value;
		}
	}

	mousedown(_event) {
		_event.stopPropagation();
	}

	add(_view) {
		super.add(_view?.class == 'LFMenubar' ? _view : new LFWorkspace());

		return this;
	}

	setActivated(_mode, _view) {
		this.target = _view ? _view : this.target;

		if((_mode == true || _mode == 'Toggle') && this.activated == false) {
			let _topDepth = 0,
				_element = this.target?.element,
				_side = this.target?.get('Superview', 'LFMenubar') ? 'Bottom' : 'TopRight',
				_origin = {
					Default: () => {
						return { x: this._.x, y: this._.y, corners: [] }
					},
					Bottom: () => {
						let _offsetX = Math.round(_element.offset().left) || this._.x,
							_offsetY = Math.round(_element.offset().top+_element.outerHeight()) || this._.y;

						return { x: _offsetX, y: _offsetY, corners: ['topLeft', 'topRight'] }
					},
					TopRight: () => {
						let _offsetX = Math.round(_element.offset().left+_element.outerWidth()) || this._.x,
							_offsetY = Math.round(_element.offset().top)-4 || this._.y;

						return { x: _offsetX, y: _offsetY, corners: ['topLeft'] }
					}
				}[_element ? _side : 'Default']();

			for(let v of [...new LFWorkspace().get('Subviews', this.class), ...new LFWorkspace().get('Subviews', 'LFWindow')]) {
				_topDepth = v.element ? Math.max(_topDepth, Number.parseInt(v.element.css('z-index'))) : 0;
			}
			this.style['z-index'] = _topDepth+1;
			if(['LFButton', 'LFMenuItem'].includes(this.target?.class)) {
				if(this.target?.class == 'LFButton') {
					this.target.menu = this;
				}
				this.target.activated = true;
			}
			this.origin = _origin;
			this.activated = true;
		} else
		if((_mode == false || _mode == 'Toggle') && this.activated == true) {
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

	static deactivateAll(_view) {
		let _exceptList = [],
			_exceptCheck = () => {
				if(_view) {
					if(_view.class == 'LFMenu') {
						_exceptList.push(_view);

						_view = _view.target;
					} else
					if(_view.class == 'LFMenuItem') {
						_view = _view.superview;
					} else {
						_view = undefined;
					}
					_exceptCheck();
				}
			}

		_exceptCheck();
		for(let v of new LFWorkspace().get('Subviews', '@Title')) {
			if(!_exceptList.includes(v)) {
				v.setActivated(false);
			}
		}
	}
}