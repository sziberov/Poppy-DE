return class extends LFView {
	constructor(_) {
		super(...arguments);
		this.class = '@Title';
		this._ = {
			...this._,
			width: 16,
			height: 16,
			url: '',
			shared: '',
			..._
		}
		this._.url = this._.shared ? new CFBundle('/Environment/Library/Frameworks/CoreTypes.bundle').resourcesURL+'/'+this._.shared+'.icns' : this._.url;
		this._.url = this._.url.endsWith('.icns') ? this._.url+='/'+this._.width+'x'+this._.height+'.svg' : this._.url;
	}

	create() {
		this.style = {
			'width': this._.width+'px',
			'height': this._.height+'px',
			'background-image': 'url(\''+this._.url+'\')'
		}
		this.attributes['template'] = this._.url.includes('Template') ? '' : undefined;

		return super.create();
	}

	set size(value) {
		this._.width = value.width;
		this._.height = value.height;
		this.style['width'] = value.width+'px';
		this.style['height'] = value.height+'px';
	}

	set url(value) {
		this._.url = value;
		this.style['background-image'] = 'url(\''+value+'\')';
	}
}