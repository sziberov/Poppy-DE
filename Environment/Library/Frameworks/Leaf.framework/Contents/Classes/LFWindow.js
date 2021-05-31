// noinspection JSAnnotator
return class extends LFView {
	static level = Object.freeze({
		base:		0,
		background:	4,
		desktop:	8,
		normal:		12,
		panel:		16,
		floating:	20,
		launchpad:	24,
		dock:		28,
		menu:		32,
		menubar:	36
	});

	__application = LFApplication.shared;
	__hidden = true;
	__main = false;
	__x;
	__y;
	/*
	__this = this;
	__origin = {
		__x,
		__y,
		get x() {
			return this.__x;
		},
		get y() {
			return this.__y;
		},
		set x(value) {
			this.__x = value;
		},
		set y(value) {
			this.__y = value;
		}
	}
	*/
	__width;
	__height;
	__background;
	__level;
	__type = []
	__title;
	__toolbar;
	__view;

	class = _title;

	constructor({
		x = 24,
		y = 48,
		width,
		height,
		background,
		level = 'normal',
		type = [
			'titled',
			'closable',
			'minimizable',
			'resizable'
		],
		title = 'Window',
		toolbar,
		view
	}) {
		super(...arguments);

		this.origin = {
			x: x,
			y: y
		}
		this.frame = {
			width: width,
			height: height
		}
		this.background = background;
		this.level = level;
		this.type = type;
		this.title = title;
		this.toolbar = toolbar;
		this.view = view;

		this.subviews = [
			...!type.includes('borderless') ? [
				new LFFrame({ type: 'top', subviews: [
					...type.includes('titled') ? [
						new LFTitlebar({ title: this.title, subviews: [
							new LFTitlebarButton({ type: 'close',		action: type.includes('closable')		? () => this.close()	: undefined }),
							new LFTitlebarButton({ type: 'minimize',	action: type.includes('minimizable')	? () => this.minimize()	: undefined }),
							new LFTitlebarButton({ type: 'maximize',	action: type.includes('resizable')		? () => this.maximize()	: undefined })
						] })
					] : [],
					...this.toolbar ? [this.toolbar] : []
				] }),
			] : [],
			...this.view ? [this.view] : [new LFView()]
		]

		this.add(LFWorkspace.shared);
	}

	get hidden() {
		return this.__hidden;
	}

	get main() {
		return this.__main;
	}

	get origin() {
		return {
			x: this.__x,
			y: this.__y
		}
	}

	get frame() {
		if(!this.element) {
			return {
				width: this.__width,
				height: this.__height
			}
		} else {
			return {
				width: Math.round(this.element.outerWidth()),
				height: Math.round(this.element.outerHeight())
			}
		}
	}

	get minimized() {
		return this.attributes['minimized'] === '';
	}

	get maximized() {
		return this.element.position().top === 24 && this.element.position().left === 0 && LFWorkspace.shared.element.outerWidth() === this.element.outerWidth() && LFWorkspace.shared.element.outerHeight()-24 === this.element.outerHeight();
	}

	get background() {
		return this.__background;
	}

	get level() {
		return this.__level;
	}

	get type() {
		return [...this.__type]
	}

	get title() {
		return this.__title;
	}

	get toolbar() {
		return this.__toolbar;
	}

	get view() {
		return this.__view;
	}

	get application() {
		return LFLaunchedApplication.shared;
	}

	set hidden(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__hidden = value;
		this.attributes['hidden'] = value ? '' : undefined;
	}

	set main(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__main = value;
		if(value) {
			for(let v of this.get('Siblings', this).filter(v => v.application === this.application)) {
				v.main = false;
			}
		}
	}

	set origin(value) {
		value.x = this.element && value.x === 'center' ? Math.round(LFWorkspace.shared.element.outerWidth()/2-this.element.outerWidth()/2) : value.x;
		value.y = this.element && value.y === 'center' ? Math.round(LFWorkspace.shared.element.outerHeight()/2-this.element.outerHeight()/2) : value.y;

		this.__x = value.x;
		this.__y = value.y;
		if(typeof value.x === 'number' && typeof value.y === 'number') {
			this.style['transform'] = 'translate3d('+Math.round(value.x)+'px, '+Math.round(value.y)+'px, 0)';
		}
	}

	set frame(value) {
		if(typeof value.width === 'number') {
			this.__width = value.width;
			this.style['width'] = value.width+'px';
		}
		if(typeof value.height === 'number') {
			this.__height = value.height;
			this.style['height'] = value.height+'px';
		}
	}

	set background(value) {
		if(value && typeof value !== 'string') {
			throw new TypeError();
		}

		this.__background = value;
		this.style['background'] = value ? value : '';
	}

	set level(value) {
		if(typeof value !== 'string' && typeof value !== 'number')						throw new TypeError();
		if(typeof value === 'string' && this.constructor.level[value] === undefined)	throw new RangeError()

		this.__level = typeof value === 'string' ? this.constructor.level[value] : value;
	}

	set type(value) {
		if(!Array.isArray(value))																											throw new TypeError();
		for(let v of value) {
			if(typeof v !== 'string')																										throw new TypeError();
			if(!['titled', 'closable', 'minimizable', 'resizable', 'fullscreen', 'borderless', 'unifiedTitlebarAndToolbar'].includes(v))	throw new RangeError();
		}

		this.__type = value;
		for(let v of ['fullscreen', 'borderless', 'unifiedTitlebarAndToolbar']) {
			this.attributes[v] = value.includes(v) ? '' : undefined;
		}
	}

	set title(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__title = value;
	}

	set toolbar(value) {
		if(value && !Object.isKindOf(value, LFToolbar)) {
			throw new TypeError();
		}

		this.__toolbar = value;
	}

	set view(value) {
		if(value && value.class !== 'LFView') {
			throw new TypeError();
		}

		this.__view = value;
	}

	mousedown() {
		LFMenu.deactivateAll();
		this.focus();
	}

	didAdd() {
		this.origin = this.origin;
		this.frame = this.frame;

		this.hidden = false;
		this.focus();
	}

	/*
	center(_direction) {
		if(this.element) {
			this.origin = {
				x: !_direction || _direction === 'Horizontally' ? Math.round(LFWorkspace.shared.element.outerWidth()/2-this.element.outerWidth()/2) : this.__x,
				y: !_direction || _direction === 'Vertically' ? Math.round(LFWorkspace.shared.element.outerHeight()/2-this.element.outerHeight()/2) : this.__y
			}
		}

		return this;
	}
	*/

	focus() {
		if(this.element) {
			let topDepth = 0;

			for(let v of this.get('Siblings', this)) {
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
		if(this.type.includes('closable')) {
			this.destroy();
		}
	}

	minimize() {
		if(this.type.includes('minimizable')) {
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
		if(this.type.includes('resizable')) {
			if(!this.maximized) {
				if(this.minimized) {
					this.minimize();
				}
				this.attributes['animatedResizeIn'] = '';
				this.style['width'] = LFWorkspace.shared.element.outerWidth()+'px';
				this.style['height'] = LFWorkspace.shared.element.outerHeight()-24+'px';
				this.style['transform'] = 'translate3d(0px, 24px, 0)';
			} else {
				this.attributes['animatedResizeOut'] = '';
				this.style['width'] = this.__width+'px';
				this.style['height'] = this.__height+'px';
				this.style['transform'] = 'translate3d('+this.__x+'px, '+this.__y+'px, 0)';
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

		if(application.quitableBySingleWindow && application.windows.length === 0) {
			application.quit();
		}
	}
}