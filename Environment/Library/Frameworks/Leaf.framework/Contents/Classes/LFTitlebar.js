return class extends LFView {
	constructor(_) {
		super(...arguments);
		this.class = '@Title';
		this._ = {
			...this._,
			title: '',
			subviews: [],
			..._
		}

		this.attributes['title'] = this._.title;
		this.subviews.add(...this._.subviews);
	}
}