// noinspection JSAnnotator
return class {
	constructor({ URL, type } = {}) {
		if(typeof URL !== 'string' || !['png', 'svg'].includes(type)) {
			return;
		}

		this.__layer = _request('drOpen', CFFile.content(URL), type);
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