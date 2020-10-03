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

		this.attributes[this._.type] = ['status'].includes(this._.type) ? '' : undefined;
		this.subviews.add(...this._.subviews);
	}

	get type() {
		return this._.type;
	}
}