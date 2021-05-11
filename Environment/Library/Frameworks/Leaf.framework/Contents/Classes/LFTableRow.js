// noinspection JSAnnotator
return class extends LFControl {
	__title;

	class = '@Title';
	data;

	constructor({ title = 'TableRow', data } = {}) {
		super(...arguments);

		this.title = title;
		this.data = data;
	}

	get title() {
		return this.__title;
	}

	get activated() {
		return super.activated;
	}

	set title(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__title = value;
		this.attributes['title'] = value === '' ? undefined : value;
	}

	set activated(value) {
		super.activated = value;

		if(value) {
			for(let v of this.get('Siblings', this.class)) {
				v.activated = false;
			}
		}
	}

	click() {}

	dblclick() {
		this.action?.();
	}

	mouseleave() {
		this.highlighted = false;
	}

	mouseup() {}
}