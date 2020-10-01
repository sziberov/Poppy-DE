return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			title: '',
			subviews: [],
			..._
		}

		this.attributes['title'] = this._.title;
		this.subviews = this._.subviews;
	}
}