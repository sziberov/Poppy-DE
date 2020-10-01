return class extends LFView {
	#application = new LFApplication();

	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			x: 24,
			y: 48,
			width: undefined,
			height: undefined,
			background: undefined,
			level: 1,	//0: Desktop, 1: Normal, 2: Alert
			style: [
				'titled',
				'closable',
				'minimizable',
				'resizable',
			//	'fullscreen',
			//	'borderless',
			//	'unifiedTitlebarAndToolbar'
			],
			title: 'Window',
			toolbar: undefined,
			view: undefined,
			..._
		}

		this.style = {
			'width': this._.width+'px',
			'height': this._.height+'px',
			'background': this._.background
		}
		this.attributes = {
			'fullscreen': this._.style.includes('fullscreen') ? '' : undefined,
			'borderless': this._.style.includes('borderless') ? '' : undefined,
			'unifiedTitlebarAndToolbar': this._.style.includes('unifiedTitlebarAndToolbar') ? '' : undefined
		}
		this.subviews = [
			...!this._.style.includes('borderless') ? [
				new LFFrame({ type: 'top', subviews: [
					...this._.style.includes('titled') ? [
						new LFTitlebar({ title: this.title, subviews: [
							new LFTitlebarButton({ type: 'close',		action: this._.style.includes('closable')		? () => this.close()	: undefined }),
							new LFTitlebarButton({ type: 'minimize',	action: this._.style.includes('minimizable')	? () => this.minimize()	: undefined }),
							new LFTitlebarButton({ type: 'maximize',	action: this._.style.includes('resizable')		? () => this.maximize()	: undefined })
						] })
					] : [],
					...this.toolbar?.class == 'LFToolbar' ? [this.toolbar] : []
				] }),
			] : [],
			...this.view?.class == 'LFView' ? [this.view] : [new LFView()]
		]
		this.level = [0, 1, 2].includes(this._.level) ? this._.level : 1;
		this.main = false;
	}

	get minimized() {
		return this.attributes['minimized'] == '' ? true : false
	}

	get maximized() {
		return this.element.position().top == 24 && this.element.position().left == 0 && new LFWorkspace().element.outerWidth() == this.element.outerWidth() && new LFWorkspace().element.outerHeight()-24 == this.element.outerHeight();
	}

	get title() {
		return this._.title;
	}

	get toolbar() {
		return this._.toolbar;
	}

	get view() {
		return this._.view;
	}

	get application() {
		return new LFLaunchedApplication();
	}

	set origin(_value) {
		_value.x = this.element && _value.x == 'center' ? Math.round(new LFWorkspace().element.outerWidth()/2-this.element.outerWidth()/2) : Math.round(_value.x);
		_value.y = this.element && _value.y == 'center' ? Math.round(new LFWorkspace().element.outerHeight()/2-this.element.outerHeight()/2) : Math.round(_value.y);

		if(typeof _value.x === 'number' && typeof _value.y === 'number') {
			this._.x = _value.x;
			this._.y = _value.y;
			this.style['transform'] = 'translate('+_value.x+'px, '+_value.y+'px)';
		}
	}

	set frame(_value) {
		this._.width = _value.width;
		this._.height = _value.height;
		this.style['width'] = _value.width+'px';
		this.style['height'] = _value.height+'px';
	}

	mousedown() {
		this.focus();
	}

	didAddSubview() {
		this.origin = this._;

		this.focus();
	}

	/*
	center(_direction) {
		if(this.element) {
			this.origin = {
				x: !_direction || _direction == 'Horizontally' ? Math.round(new LFWorkspace().element.outerWidth()/2-this.element.outerWidth()/2) : this._.x,
				y: !_direction || _direction == 'Vertically' ? Math.round(new LFWorkspace().element.outerHeight()/2-this.element.outerHeight()/2) : this._.y
			}
		}

		return this;
	}
	*/

	focus() {
		if(this.element) {
			let _topDepth = 0;

			for(let v of this.get('Siblings', this.class)) {
				let _depth = v.element ? Number.parseInt(v.element.css('z-index')) : 0;

				if(v.level <= this.level) {
					_topDepth = Math.max(_topDepth, _depth);
				}
				if(v.level > this.level) {
					v.style['z-index'] = _depth+1;
				}
				v.attributes['focused'] = undefined;
			}
			this.style['z-index'] = _topDepth+1;
			this.attributes['focused'] = '';
		}
		if(this.application) {
			for(let v of this.get('Siblings', this.class).filter(v => v.application == this.application)) {
				v.main = false;
			}
			this.main = true;
			this.application.focus();
		}

		return this;
	}

	close() {
		if(this._.style.includes('closable')) {
			this.destroy();
		}
	}

	minimize() {
		if(this._.style.includes('minimizable')) {
			this.attributes['animatedResize'] = '';
			if(!this.minimized) {
				this.attributes['minimized'] = '';
			} else {
				this.attributes['minimized'] = undefined;
			}
			setTimeout(() => {
				this.attributes['animatedResize'] = undefined;
			}, 250);
		}

		return this;
	}

	maximize() {
		if(this._.style.includes('resizable')) {
			if(!this.maximized) {
				if(this.minimized) {
					this.minimize();
				}
				this.attributes['animatedResizeIn'] = '';
				this.style['width'] = new LFWorkspace().element.outerWidth()+'px';
				this.style['height'] = new LFWorkspace().element.outerHeight()-24+'px';
				this.style['transform'] = 'translate(0px, 24px)';
			} else {
				this.attributes['animatedResizeOut'] = '';
				this.style['width'] = this._.width+'px';
				this.style['height'] = this._.height+'px';
				this.style['transform'] = 'translate('+this._.x+'px, '+this._.y+'px)';
			}
			setTimeout(() => {
				this.attributes['animatedResizeIn'] = undefined;
				this.attributes['animatedResizeOut'] = undefined;
			}, 250);
		}

		return this;
	}

	destroy() {
		super.destroy();

		if(this.#application) {
			let _application = this.#application,
				_windows = _application.windows;

			CFArray.remove(_windows, this);
			if(_application.quitableBySingleWindow && _windows.length == 0) {
				_application.quit();
			}
		}
	}
}