return class extends LFView {
	constructor(_) {
		super(...arguments);
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

	drag(event, dragCache) {
		let window = this.get('Superview', 'LFWindow'),
			dragX = window.element.offset().left-(dragCache[1]-event.pageX),
			dragY = window.element.offset().top-(dragCache[2]-event.pageY);

		dragY = dragY >= 24 ? dragY : 24;
		dragCache[1] = event.pageX;
		dragCache[2] = event.pageY >= 24 ? event.pageY : 24;

	//	if(!window._.style.includes('fullscreen')) {
			window.origin = { x: dragX, y: dragY }
	//	}
	}
}