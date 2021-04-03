return class extends LFObject {
	constructor() {
		super();
		this.class = '@Title';
	}

	create() {
		let create = super.create();

		for(let v of ['click', 'dblclick', 'contextmenu', 'mouseover', 'mouseenter', 'mouseout', 'mouseleave', 'mousedown', 'mouseup', 'mousemove', 'drag']) {
			if(typeof this[v] === 'function') {
				if(v !== 'drag') {
					create.on(v, (e) => this[v].bind(this)(e));
				} else {
					this.dragCache = []

					let dragCache = this.dragCache;

					create.on('mousedown', (e) => {
						if(e.button == 0) {
							dragCache = [true, e.pageX, e.pageY]
						}
					});
					$(document).on('mousemove mouseup', (e) => {
						if(e.type == 'mousemove' && dragCache[0]) {
							this['drag'](e, dragCache);
						}
						if(e.type == 'mouseup') {
							dragCache[0] = false;
						}
					});
				}
			}
		}

		return create;
	}
}