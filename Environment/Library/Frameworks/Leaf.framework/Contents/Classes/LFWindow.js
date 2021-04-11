return class extends LFView {
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

		this.__application = new LFApplication();
		this.__hidden = true;
		this.__main = false;

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
		this.subviews.add(
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
		);
		this.level = [0, 1, 2].includes(this._.level) ? this._.level : 1;

		this.add(new LFWorkspace());
	}

	get hidden() {
		return this.__hidden;
	}

	get main() {
		return this.__main;
	}

	get frame() {
		if(!this.element) {
			return {
				width: this._.width,
				height: this._.height
			}
		} else {
			return {
				width: Math.round(this.element.outerWidth()),
				height: Math.round(this.element.outerHeight())
			}
		}
	}

	get minimized() {
		return this.attributes['minimized'] == '' ? true : false;
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

	set hidden(value) {
		if([false, true].includes(value)) {
			this.__hidden = value;
			if(!value) {
				this.attributes['hidden'] = undefined;
			} else {
				this.attributes['hidden'] = '';
			}
		}
	}

	set main(value) {
		if([false, true].includes(value)) {
			this.__main = value;
			if(value) {
				for(let v of this.get('Siblings', this.class).filter(v => v.application == this.application)) {
					v.main = false;
				}
			}
		}
	}

	set origin(value) {
		value.x = this.element && value.x == 'center' ? Math.round(new LFWorkspace().element.outerWidth()/2-this.element.outerWidth()/2) : Math.round(value.x);
		value.y = this.element && value.y == 'center' ? Math.round(new LFWorkspace().element.outerHeight()/2-this.element.outerHeight()/2) : Math.round(value.y);

		if(typeof value.x === 'number' && typeof value.y === 'number') {
			this._.x = value.x;
			this._.y = value.y;
			this.style['transform'] = 'translate3d('+value.x+'px, '+value.y+'px, 0)';
		}
	}

	set frame(value) {
		if(typeof value.width === 'number' && typeof value.height === 'number') {
			this._.width = value.width;
			this._.height = value.height;
			this.style['width'] = value.width+'px';
			this.style['height'] = value.height+'px';
		}
	}

	mousedown() {
		LFMenu.deactivateAll();
		this.focus();
	}

	didAdd() {
		this.origin = this._;
		this.frame = this.frame;

		this.hidden = false;
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
			let topDepth = 0;

			for(let v of this.get('Siblings', this.class)) {
				let depth = v.element ? Number.parseInt(v.element.css('z-index')) : 0;

				if(v.level <= this.level) {
					topDepth = Math.max(topDepth, depth);
				}
				if(v.level > this.level) {
					v.style['z-index'] = depth+1;
				}
				v.attributes['focused'] = undefined;
			}
			this.style['z-index'] = topDepth+1;
			this.attributes['focused'] = '';
		}
		if(this.application) {
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
			_request('timerCreate', 'single', 250, () => {
				this.attributes['animatedResize'] = undefined;
			});
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
				this.style['transform'] = 'translate3d(0px, 24px, 0)';
			} else {
				this.attributes['animatedResizeOut'] = '';
				this.style['width'] = this._.width+'px';
				this.style['height'] = this._.height+'px';
				this.style['transform'] = 'translate3d('+this._.x+'px, '+this._.y+'px, 0)';
			}
			_request('timerCreate', 'single', 250, () => {
				this.attributes['animatedResizeIn'] = undefined;
				this.attributes['animatedResizeOut'] = undefined;
			});
		}

		return this;
	}

	destroy() {
		super.destroy();

		let application = this.__application;

		if(application.quitableBySingleWindow && application.windows.length == 0) {
			application.quit();
		}
	}
}