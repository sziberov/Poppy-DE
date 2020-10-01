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
		this.attributes['highlighted'] = '';
		for(var v of this.get('Siblings', this.class)) {
			v.attributes['highlighted'] = '';
		}
	}

	mouseout() {
		this.attributes['highlighted'] = undefined;
		for(var v of this.get('Siblings', this.class)) {
			v.attributes['highlighted'] = undefined;
		}
	}
}