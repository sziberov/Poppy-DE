return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			type: '',
			subviews: [],
			..._
		}

		this.attributes[this._.type] = ['application', 'status'].includes(this._.type) ? '' : undefined;
		this.subviews = this._.subviews;
	}
}