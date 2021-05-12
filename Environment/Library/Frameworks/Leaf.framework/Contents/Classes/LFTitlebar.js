// noinspection JSAnnotator
return class extends LFView {
	__title;

	class = _title;

	constructor({ title, subviews } = {}) {
		super(...arguments);

		this.title = title;
		this.subviews = subviews;
	}

	get title() {
		return this.__title;
	}

	set title(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__title = value;
		this.attributes['title'] = value === '' ? undefined : value;
	}
}