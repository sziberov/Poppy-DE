return class extends LFControl {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			minWidth: undefined,
			title: 'Button',
			image: undefined,
			..._
		}

		this.style['min-width'] = this._.minWidth ? this._.minWidth : undefined;
		this.attributes['title'] = this._.title;
		this.subviews = this._.image && this._.image.class == 'LFImage' ? [this._.image] : []
	}

	set title(_value) {
		this._.title = _value;
		this.attributes['title'] = _value;
	}

	set image(_value) {
		this._.image = _value;
		this.subviews = _value &&_value.class == 'LFImage' ? [_value] : []
	}
}