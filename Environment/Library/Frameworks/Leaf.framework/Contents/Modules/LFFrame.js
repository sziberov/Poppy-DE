return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			type: '',
			subviews: [],
			..._
		}

		this.attributes[this._.type] = ['top', 'bottom'].includes(this._.type) ? '' : undefined;
		this.subviews.add(...this._.subviews);
	}

	dblclick() {
		this.get('Superview', 'LFWindow').minimize();
	}

	drag(_event, _dragCache) {
		var _window = this.get('Superview', 'LFWindow'),
			_dragX = _window.element.offset().left-(_dragCache[1]-_event.pageX),
			_dragY = _window.element.offset().top-(_dragCache[2]-_event.pageY),
			_dragY = _dragY >= 24 ? _dragY : 24;
			_dragCache[1] = _event.pageX;
			_dragCache[2] = _event.pageY >= 24 ? _event.pageY : 24;

	//	if(!_window._.style.includes('fullscreen')) {
			_window.origin = { x: _dragX, y: _dragY }
	//	}
	}
}