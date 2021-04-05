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
		for(let v of this.subviews) {
			if(v.activated == true) {
				return v;
			}
		}
	}

	mousedown() {
		for(let v of this.subviews) {
			v.activated = false;
		}
	}
}