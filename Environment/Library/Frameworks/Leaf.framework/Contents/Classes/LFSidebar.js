// noinspection JSAnnotator
return class extends LFView {
	class = '@Title';

	constructor({ subviews } = {}) {
		super(...arguments);

		this.subviews = subviews;
	}
}