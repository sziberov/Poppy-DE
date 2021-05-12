// noinspection JSAnnotator
return class extends LFView {
	class = _title;

	constructor({ subviews } = {}) {
		super(...arguments);

		this.subviews = subviews;
	}
}