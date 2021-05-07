return class extends LFView {
	constructor(_) {
		super(...arguments);
		this.class = '@Title';
		this._ = {
			...this._,
			subviews: [],
			..._
		}

		this.subviews.add(...this._.subviews);
	}
}