// noinspection JSAnnotator
return class {
	constructor({ URL, format } = {}) {
		if(typeof URL !== 'string' || !['png', 'svg'].includes(format)) {
			return;
		}

		this.__canvas = _request('drOpen', CFFile.content(URL), format);
	}

	get width() {
		return this.__canvas.width;
	}

	get height() {
		return this.__canvas.height;
	}

	get canvas() {
		return this.__canvas;
	}
}