return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			action: undefined,
			..._
		}

		this.attributes['disabled'] = typeof this._.action !== 'function' ? '' : undefined;
		this.events = {
			click: this._.action,
			mouseover: (_event) => {
				_event.stopPropagation();
				if(typeof this.events.click === 'function') {
					this.attributes['hover'] = '';
					this.element.one('mouseout', () => this.attributes['hover'] = undefined);
				}
			},
			mousedown: (_event) => {
				var _window = this.get('Superview', 'LFWindow');

				_event.stopPropagation();
				if(typeof this.events.click === 'function' && _event.button == 0) {
					this.attributes['active'] = '';
					this.element.one('mouseout mouseup', () => this.attributes['active'] = undefined);
				}
				if(_window) _window.focus();
			}
		}
	}

	set action(_value) {
		this._.action = _value;
		this.events.click = _value;
		if(this.element) this.element.off('click').on('click', _value);
	}
}