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

		this.subviews.add(...this._.items.filter(v => v.class == 'LFMenuItem'));
		this.forSuperview;
		this.origin = this._;
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

	get state() {
		return this.attributes['activated'] == '' ? true : false;
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
		this.setSubviews(_value);
	}

	set autoactivatesItems(_value) {
		if([false, true].includes(_value)) {
			this._.autoactivatesItems = _value;
		}
	}

	set state(_value) {
		this.attributes['activated'] = _value == true ? '' : undefined;
	}

	add(_view) {
		super.add(_view?.class == 'LFMenubar' ? _view : new LFWorkspace());

		return this;
	}

	didAddSubview() {
		new LFWorkspace().element.on('mousedown', (_event) => {
			if(this.element && _event.target !== this.element[0]) {
				this.setState('Inactive');
			}
		});
	}

	setState(_mode, _view) {
		this.forSuperview = _view ? _view : this.forSuperview;

		if((_mode == 'Active' || _mode == 'Toggle') && this.state == false) {
			let _topDepth = 0,
				_element = this.forSuperview?.element,
				_side = this.forSuperview?.get('Superview', 'LFMenubar') ? 'Bottom' : 'TopRight',
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
				}[_side || 'Default']();

			for(let v of [...new LFWorkspace().get('Subviews', this.class), ...new LFWorkspace().get('Subviews', 'LFWindow')]) {
				_topDepth = v.element ? Math.max(_topDepth, Number.parseInt(v.element.css('z-index'))) : 0;
			}
			this.style['z-index'] = _topDepth+1;
			if(['LFButton', 'LFMenuItem'].includes(this.forSuperview?.class)) {
				if(this.forSuperview?.class == 'LFButton') {
					this.forSuperview.menu = this;
				}
				this.forSuperview.state = true;
			}
			this.origin = _origin;
			this.state = true;
		} else
		if((_mode == 'Inactive' || _mode == 'Toggle') && this.state == true) {
			if(['LFButton', 'LFMenuItem'].includes(this.forSuperview?.class)) {
				this.forSuperview.state = false;
			}
			this.state = false;
		}
		for(let v of this.subviews) {
			v.attributes['highlighted'] = undefined;
			if(v.menu) {
				v.state = false;
				v.menu.setState('Inactive');
			}
		}
	}

	destroy() {
		for(let v of this.subviews) {
			v.menu?.destroy();
		}

		super.destroy();
	}

	static deactivateAll(_exceptView) {
		let _exceptList = [],
			_exceptCheck = () => {
				if(_exceptView) {
					if(_exceptView.class == 'LFMenu') {
						_exceptList.push(_exceptView);

						_exceptView = _exceptView.forSuperview;
					} else
					if(_exceptView.class == 'LFMenuItem') {
						_exceptView = _exceptView.superview;
					} else {
						_exceptView = undefined;
					}
					_exceptCheck();
				}
			}

		_exceptCheck();
		for(let v of new LFWorkspace().get('Subviews', '@Title')) {
			if(!_exceptList.includes(v)) {
				v.setState('Inactive');
			}
		}
	}
}