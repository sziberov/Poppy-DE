// noinspection JSAnnotator
return class LFFrame extends LFView {	// Не имеет ничего общего с CGRectangle и .frame, название выбрано по ошибке
	__type;

	constructor({ type = 'top', subviews } = {}) {
		super(...arguments);

		this.type = type;
		this.subviews = subviews;
	}

	dblclick() {
		this.get('Superview', LFWindow).minimize();
	}

	drag(event, dragCache) {
		let window = this.get('Superview', LFWindow),
			dragX = window.element.offset().left-(dragCache[1]-event.pageX),
			dragY = window.element.offset().top-(dragCache[2]-event.pageY);

		dragY = dragY >= 24 ? dragY : 24;
		dragCache[1] = event.pageX;
		dragCache[2] = event.pageY >= 24 ? event.pageY : 24;

	//	if(!window._.style.includes('maximized')) {
			window.origin = { x: dragX, y: dragY }
	//	}
	}

	get type() {
		return this.__type;
	}

	set type(value) {
		if(value) {
			if(typeof value !== 'string')			throw new TypeError(0);
			if(!['top', 'bottom'].includes(value))	throw new RangeError(1);
		}

		this.__type = value;
		this.attributes[value] = value ? '' : undefined;
	}
}