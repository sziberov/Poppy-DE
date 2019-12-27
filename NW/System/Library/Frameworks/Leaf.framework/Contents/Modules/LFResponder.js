return class extends LFObject {
	constructor() {
		super();
		this.class = '@Title';

		this.events = {}
	}

	create() {
		var _create = super.create(),
			_dragCache = this.events.dragCache = []

		$.each(this.events, (k, v) => {
			if(typeof v === 'function') {
				if(['click', 'dblclick', 'contextmenu', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'mousemove'].includes(k)) {
					_create.on(k, (e) => v.bind(this)(e));
				}
				if(k == 'drag') {
					_create.on('mousedown', (e) => {
						if(e.button == 0) _dragCache = [true, e.pageX, e.pageY]
					});
					$(document).on('mousemove mouseup', (e) => {
						if(e.type == 'mousemove')	if(_dragCache[0]) this.events.drag(e, _dragCache);
						if(e.type == 'mouseup')		_dragCache[0] = false;
					});
				}
			}
		});

		return _create;
	}
}