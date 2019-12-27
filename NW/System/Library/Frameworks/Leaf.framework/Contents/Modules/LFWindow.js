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
			level: 1,
			style: [
				'titled',
				'closable',
				'miniaturizable',
				'resizable',
			//	'fullscreen',
			//	'borderless'
			],
			title: 'Window',
			toolbar: undefined,
			view: undefined,
			..._
		}

		this.level = [0, 1, 2].includes(this._.level) ? this._.level : 1;
		this.application;
	}

	get toolbar() {
		return this._.toolbar;
	}

	get view() {
		return this._.view;
	}

	set origin(_value) {
		this._.x = _value.x;
		this._.y = _value.y;
		this.style['transform'] = 'translate('+_value.x+'px, '+_value.y+'px)';
	}

	set size(_value) {
		this._.width = _value.width;
		this._.height = _value.height;
		this.style['width'] = _value.width+'px';
		this.style['height'] = _value.height+'px';
	}

	create() {
		this.style = {
			'width': this._.width+'px',
			'height': this._.height+'px',
			'background': this._.background,
			'transform': 'translate('+this._.x+'px, '+this._.y+'px)'
		}
		this.attributes = {
			'fullscreen': this._.style.includes('fullscreen') ? '' : undefined,
			'borderless': this._.style.includes('borderless') ? '' : undefined,
		//	'alert': ''
		}
		this.events.mousedown = () => this.focus();
		this.subviews = [
			...!this._.style.includes('borderless') ? [
				new LFFrame({ type: 'top', subviews: [
					...this._.style.includes('titled') ? [
						new LFTitlebar({ title: this._.title, subviews: [
							new LFTitlebarButton({ type: 'close',		action: this._.style.includes('closable') ?			() => this.close() : undefined }),
							new LFTitlebarButton({ type: 'miniaturize',	action: this._.style.includes('miniaturizable') ?	() => this.miniaturize() : undefined }),
							new LFTitlebarButton({ type: 'zoom',		action: this._.style.includes('resizable') ?		() => this.zoom() : undefined })
						] })
					] : [],
					...this._.toolbar && this._.toolbar.class == 'LFToolbar' ? [this._.toolbar] : []
				] }),
			] : [],
			...this._.view && this._.view.class == 'LFView' ? [this._.view] : [new LFView()]
		]

		return super.create();
	}

	didAddSubview() {
		this.focus();
	}

	focus() {
		if(this.element) {
			var _top = 0;

			for(var v of this.get('Siblings', this.class)) {
				var _z = Number.parseInt(v.element.css('z-index'));

				if(v.level <= this.level) _top = Math.max(_top, _z);
				if(v.level > this.level) v.style['z-index'] = _z+1;
				v.attributes['backdrop'] = '';
			}
			this.style['z-index'] = _top+1;
			this.attributes['backdrop'] = undefined;
		}
		if(this.application) this.application.focus();

		return this;
	}

	close() {
		if(this._.style.includes('closable')) this.destroy();
	}

	miniaturize() {
		if(this._.style.includes('miniaturizable')) alert('Miniaturized');

		return this;
	}

	zoom() {
		if(this._.style.includes('resizable')) {
			this.style['width'] = '100%';
			this.style['height'] = 'calc(100% - 24px)';
			this.style['transform'] = 'translate(0px, 24px)';
		}

		return this;
	}

	destroy() {
		super.destroy();

		if(this.application) CFArray.remove(this.application.windows, this);
	}
}