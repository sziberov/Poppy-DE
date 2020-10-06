return class extends LFControl {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			type: '',
			..._
		}

		this.attributes[this._.type] = ['close', 'minimize', 'maximize'].includes(this._.type) ? '' : undefined;
	}

	mouseover(_event) {
		_event.stopPropagation();
		this.highlighted = true;
		for(let v of this.get('Siblings', this.class)) {
			v.highlighted = true;
		}
	}

	mouseout() {
		this.highlighted = false;
		for(let v of this.get('Siblings', this.class)) {
			v.highlighted = false;
		}
	}
}