// noinspection JSAnnotator
return class LFTitlebar extends LFView {
	__title;

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
			throw new TypeError(0);
		}

		this.__title = value;
		this.attributes['title'] = value === '' ? undefined : value;
	}
}