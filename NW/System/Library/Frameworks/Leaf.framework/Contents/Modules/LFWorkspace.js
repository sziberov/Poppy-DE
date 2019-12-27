return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			wallpaper: '',
			..._
		}
		
		this.style['background-image'] = 'url('+this._.wallpaper+')';
	}

	set wallpaper(_value) {
		this.style['background-image'] = 'url('+_value+')';
	}
}