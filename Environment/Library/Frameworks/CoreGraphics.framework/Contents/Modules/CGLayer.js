return class {
	#canvas;
	#context;

	constructor({ URL, format, width, height } = {}) {
		if(typeof URL !== 'string' && !(typeof width == 'number' || typeof height == 'number')) {
			return;
		}

		if(typeof URL == string) {
		//	this.#canvas = await _request('drOpen', CFFile.content(URL), format);
		} else {
			this.#canvas = _request('drCreate', width, height);
		}
		this.#context = this.canvas.getContext('2d');
	}

	get width() {
		return this.#canvas.width;
	}

	get height() {
		return this.#canvas.height;
	}

	get canvas() {
		return this.#canvas;
	}

	get context() {
		return this.#context;
	}

	set width(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.#canvas.width = value;
	}

	set height(value) {
		if(typeof value !== 'number') {
			return;
		}

		this.#canvas.height = value;
	}

	draw() {
		_request('fbWrite', this.canvas);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.canvas, 'image', layer.canvas, x, y, width, height);

		if(_CFShared.CGLayer == this) {
			this.draw();
		}
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.canvas, 'rectangle', color, x, y, width, height);

		if(_CFShared.CGLayer == this) {
			this.draw();
		}
	}
}