return class extends LFObject {
	constructor() {
		super();
		this.class = '@Title';

		this.dragCache = []
	}

	create() {
		let _create = super.create(),
			_dragCache = this.dragCache;

		for(let v of ['click', 'dblclick', 'contextmenu', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave', 'mousedown', 'mouseup', 'mousemove', 'drag']) {
			if(typeof this[v] === 'function') {
				if(v !== 'drag') {
					_create.on(v, (e) => this[v].bind(this)(e));
				} else {
					_create.on('mousedown', (e) => {
						if(e.button == 0) _dragCache = [true, e.pageX, e.pageY]
					});
					$(document).on('mousemove mouseup', (e) => {
						if(e.type == 'mousemove' && _dragCache[0]) {
							this['drag'](e, _dragCache);
						}
						if(e.type == 'mouseup') {
							_dragCache[0] = false;
						}
					});
				}
			}
		}

		return _create;
	}
}