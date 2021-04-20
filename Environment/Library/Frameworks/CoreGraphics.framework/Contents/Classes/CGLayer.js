// noinspection JSAnnotator
return class {
	constructor({ URL, format, width, height } = {}) {
		if(typeof URL !== 'string' && !(typeof width == 'number' || typeof height == 'number')) {
			return;
		}

		if(typeof URL == 'string') {
			this.__canvas = _request('drOpen', CFFile.content(URL), format);
		} else {
			this.__canvas = _request('drCreate', width, height);
		}
		this.__context = this.canvas.getContext('2d');
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

	get context() {
		return this.__context;
	}

	set width(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.__canvas.width = value;
	}

	set height(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.__canvas.height = value;
	}

	draw() {
		_request('fbWrite', this.canvas);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.canvas, 'image', layer.canvas, x, y, width, height);

		if($CFShared.CGLayer == this) {
			this.draw();
		}
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.canvas, 'rectangle', color, x, y, width, height);

		if($CFShared.CGLayer == this) {
			this.draw();
		}
	}
}