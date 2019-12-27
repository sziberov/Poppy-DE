return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			subviews: [],
			..._
		}

		this.subviews = this._.subviews;
	}
}