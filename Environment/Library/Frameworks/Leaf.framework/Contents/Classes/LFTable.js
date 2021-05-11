// noinspection JSAnnotator
return class extends LFView {
	class = '@Title';

	constructor({ subviews } = {}) {
		super(...arguments);

		this.subviews = subviews;
	}

	get activeRow() {
		return this.subviews.find(v => v.activated);
	}

	mousedown() {
		for(let v of this.subviews) {
			v.activated = false;
		}
	}
}