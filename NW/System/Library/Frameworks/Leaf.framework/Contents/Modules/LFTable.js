return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			subviews: [],
			..._
		}

		this.events.mousedown = (_event) => {
			for(var v of this.subviews) v.state = false;
			this.get('Superview', 'LFWindow').focus();
		}
		this.subviews = this._.subviews;
	}

	get activeRow() {
		for(var v of this.subviews) if(v.active) return v;
	}
}