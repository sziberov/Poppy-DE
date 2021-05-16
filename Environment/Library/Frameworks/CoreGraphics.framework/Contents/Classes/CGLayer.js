// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __friends__ = [this]

	__layer = _request('drCreate', 0, 0);
	__context = this.__layer.context2d;
	__sublayers = new CFArray();
	__x;
	__y;

	constructor({ x = 0, y = 0, width = 0, height = 0 } = {}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.__layer, 'rectangle', color, x, y, width, height);
	}

	drawGradient(colors, x, y, width, height, fromX, fromY, toX, toY) {
		_request('drDraw', this.__layer, 'gradient', colors, x, y, width, height, fromX, fromY, toX, toY);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.__layer, 'layer', layer.__layer, x, y, width, height);
	}

	clip(x, y, width, height) {
		_request('drClip', this.__layer, x, y, width, height);
	}

	blur(x, y, width, height, amount, sharp, draw) {
		_request('drBlur', this.__layer, x, y, width, height, amount, sharp, draw);
	}

	move(type, x, y, width, height, layer, x_, y_) {
		_request('drMove', this.__layer, type, x, y, width, height, layer, x_, y_);
	}

	mask(layer, ...arguments_) {
		_request('drMask', this.__layer, layer, ...arguments_);
	}

	clear(x, y, width, height) {
		_request('drClear', this.__layer, x, y, width, height);
	}

	iterate(function_) {
		_request('drIterate', this.__layer, function_);
	}
}