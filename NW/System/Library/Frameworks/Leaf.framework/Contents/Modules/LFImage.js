return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			width: 16,
			height: 16,
			url: '',
			shared: '',
			..._
		}
		this._.url = this._.shared ? new CFBundle('/System/Library/Frameworks/CoreTypes.bundle').resources+'/'+this._.shared+'.icns' : this._.url;
		this._.url = this._.url.endsWith('.icns') ? this._.url+='/'+this._.width+'x'+this._.height+'.svg' : this._.url;
	}

	create() {
		this.style = {
			'width': this._.width+'px',
			'height': this._.height+'px',
			'background-image': 'url(\''+this._.url+'\')'
		}
		this.attributes['template'] = (this._.url.includes('Template') ? '' : undefined);

		return super.create();
	}

	set size(_value) {
		this._.width = _value.width;
		this._.height = _value.height;
		if(this.element) {
			this.element.css({
				'width': _value.width+'px',
				'height': _value.height+'px'
			});
		}
	}

	set url(_value) {
		this._.url = _value;
		if(this.element) this.element.css('background-image', 'url(\''+_value+'\')');
	}
}