// noinspection JSAnnotator
return class {
	static __friends__ = [this]

	constructor({ URL, type, width, height } = {}) {
		if(typeof URL !== 'string' && !(typeof width == 'number' || typeof height == 'number')) {
			return;
		}

		if(typeof URL == 'string') {
			this.__layer = _request('drOpen', CFFile.content(URL), type);
		} else {
			this.__layer = _request('drCreate', width, height);
		}
		this.__context = this.__layer.context2d;
	}

	get width() {
		return this.__layer.width;
	}

	get height() {
		return this.__layer.height;
	}

	get context() {
		return this.__context;
	}

	set width(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.__layer.width = value;
	}

	set height(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.__layer.height = value;
	}

	draw() {
		_request('fbWrite', this.__layer);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.__layer, 'image', layer.__layer, x, y, width, height);

		if($CFShared.CGLayer == this) {
			this.draw();
		}
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.__layer, 'rectangle', color, x, y, width, height);

		if($CFShared.CGLayer == this) {
			this.draw();
		}
	}
}