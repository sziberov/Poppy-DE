// noinspection JSAnnotator
return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			subviews: [],
			..._
		}

		this.subviews.add(...this._.subviews);
	}

	get activeRow() {
		return this.subviews.find(v => v.activated == true);
	}

	mousedown() {
		for(let v of this.subviews) {
			v.activated = false;
		}
	}
}