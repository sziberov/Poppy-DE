// noinspection JSAnnotator
return class LFImage extends LFView {
	__width;
	__height;
	__url;

	constructor({ width = 16, height = 16, url, shared } = {}) {
		super(...arguments);

		this.width = width;
		this.height = height;
		this.url = shared ? new CFBundle('/Environment/Library/Frameworks/CoreTypes.bundle').resourcesURL+'/'+shared+'.icns' : url;
	}

	create() {
		this.style = {
			'width': this.width+'px',
			'height': this.height+'px',
			'background-image': `url('${ this.__url }')`
		}
		this.attributes['template'] = this.__url.includes('Template') ? '' : undefined;

		return super.create();
	}

	get width() {
		return this.__width;
	}

	get height() {
		return this.__height;
	}

	get size() {
		return {
			width: this.__width,
			height: this.__height
		}
	}

	get url() {
		return this.__url;
	}

	set width(value) {
		if(typeof value !== 'number')	throw new TypeError(0);
		if(value < 0)					throw new RangeError(1);

		this.__width = value;
		this.style['width'] = value+'px';
	}

	set height(value) {
		if(typeof value !== 'number')	throw new TypeError(0);
		if(value < 0)					throw new RangeError(1);

		this.__height = value;
		this.style['height'] = value+'px';
	}

	set size(value) {
		if(!Array.isArray(value) || !value.width || !value.height) {
			throw new TypeError(0);
		}

		this.width = value.width;
		this.height = value.height;
	}

	set url(value) {
		if(value) {
			if(typeof value !== 'string')	throw new TypeError(0);
			if(value.length < 1)			throw new RangeError(1);
		}

		this.__url = value ? value.endsWith('.icns') ? value+'/'+this.width+'x'+this.height+'.svg' : value : undefined;
		this.style['background-image'] = value ? `url('${ value }')` : '';
		this.attributes['template'] = value.includes('Template') ? '' : undefined;
	}
}