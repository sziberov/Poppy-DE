// noinspection JSAnnotator
return $CFShared.@Title || class {
	static __friends__ = [this]
	static __main;

	constructor({ x = 0, y = 0, width = 0, height = 0 } = {}) {
		this.__x;
		this.__y;
		this.__layer = _request('drCreate', 0, 0);
		this.__context = this.__layer.context2d;
		this.__sublayers = new CFArray();

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		if(!this.constructor.__main) {
			this.constructor.__main = this;
		}
	}

	get x() {
		return this.__x;
	}

	get y() {
		return this.__y;
	}

	get width() {
		return this.__layer.width;
	}

	get height() {
		return this.__layer.height;
	}

	set x(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__x = value;
	}

	set y(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__y = value;
	}

	set width(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__layer.width = value;
	}

	set height(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__layer.height = value;
	}

	draw() {
		if(this.constructor.__main == this) {
			_request('fbWrite', this.__layer);
		}
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.__layer, 'rectangle', color, x, y, width, height);
	}

	drawGradient(colors, x, y, width, height, fromX, fromY, toX, toY) {
		_request('drDraw', this.__layer, 'gradient', colors, x, y, width, height, fromX, fromY, toX, toY);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.__layer, 'layer', layer.__layer, x, y, width, height);
	}

	blur(x, y, width, height, amount, sharp, draw) {
		_request('drBlur', this.__layer, x, y, width, height, amount, sharp, draw)
	}
}