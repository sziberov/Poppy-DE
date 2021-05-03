// noinspection JSAnnotator
return $CFShared.@Title || class {
	static __friends__ = [this]
	static __main;

	constructor(width, height) {
		if(typeof width !== 'number' || typeof height !== 'number') {
			return;
		}

		this.__layer = _request('drCreate', width, height);
		this.__context = this.__layer.context2d;

		if(!@Title.__main) {
			@Title.__main = this;
		}
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
		if(@Title.__main == this) {
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