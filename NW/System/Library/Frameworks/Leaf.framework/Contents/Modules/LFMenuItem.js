return class extends LFButton {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			title: 'MenuItem',
			menu: undefined,
			..._
		}

		this.events.mousedown = (_event) => {
			_event.stopPropagation();
			if(typeof this.events.click === 'function') {
				this.element.one('mouseup', () => this.superview.state = false);
			}
		}

		if(this._.menu && this._.menu.class == 'LFMenu') {
			var _menu = this._.menu,
				_mouseover = this.events.mouseover;

			this.attributes['disabled'] = undefined;
			this.events.click = () => {}
			this.events.mouseover = function(_event) {
				_mouseover(_event);

				var _element = this.element,
					_offsetX = Math.round(_element.outerWidth()),
					_offsetY = _element.offset().top-_element.outerHeight()-4;

				_menu.origin = { x: _offsetX, y: _offsetY }
				_menu.state = true;
			}

			this.subviews = [_menu]
		}
	}

	separator() {
		this.attributes = {
			'title': undefined,
			'separator': ''
		}
		this.events = {}

		return this;
	}
}