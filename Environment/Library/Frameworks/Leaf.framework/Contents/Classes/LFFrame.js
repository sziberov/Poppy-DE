// noinspection JSAnnotator
return class extends LFView {
	__type;

	class = '@Title';

	constructor({ type = 'top', subviews } = {}) {
		super(...arguments);

		this.type = type;
		this.subviews = subviews;
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

	get type() {
		return this.__type;
	}

	set type(value) {
		if(value) {
			if(typeof value !== 'string')			throw new TypeError();
			if(!['top', 'bottom'].includes(value))	throw new RangeError();
		}

		this.__type = value;
		this.attributes[value] = value ? '' : undefined;
	}
}