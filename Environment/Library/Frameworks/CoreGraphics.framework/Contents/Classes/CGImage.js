// noinspection JSAnnotator
return class {
	constructor({ URL, format } = {}) {
		if(typeof URL !== 'string' || !['png', 'svg'].includes(format)) {
			return;
		}

		this.__layer = _request('drOpen', CFFile.content(URL), format);
	}

	get width() {
		return this.__layer.width;
	}

	get height() {
		return this.__layer.height;
	}

	get layer() {
		return this.__layer;
	}
}