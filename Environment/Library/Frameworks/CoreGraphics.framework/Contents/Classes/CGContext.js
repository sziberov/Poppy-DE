// noinspection JSAnnotator
return class {
	__externalLayer;

	constructor(layer) {
		if(!Object.isKindOf(layer, CGLayer)) {	// Не сработает между процессами
			throw new TypeError();
		}

		this.__externalLayer = layer;
	}

	get __layer() {
		return this.__externalLayer.__layer;
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.__layer, 'rectangle', color, x, y, width, height);
	}

	drawGradient(colors, x, y, width, height, fromX, fromY, toX, toY) {
		_request('drDraw', this.__layer, 'gradient', colors, x, y, width, height, fromX, fromY, toX, toY);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.__layer, 'layer', layer.__layer, x ?? layer.x, y ?? layer.y, width, height);
	}

	clip(x, y, width, height) {
		_request('drClip', this.__layer, x, y, width, height);
	}

	blur(amount, sharp, apply, layer, x, y, ...arguments_) {
		_request('drBlur', this.__layer, amount, sharp, apply, layer.__layer, x ?? layer.x, y ?? layer.y, ...arguments_);
	}

	move(type, x, y, width, height, layer, x_, y_) {
		_request('drMove', this.__layer, type, x, y, width, height, layer.__layer, x_, y_);
	}

	mask(layer, apply, x, y, ...arguments_) {
		_request('drMask', this.__layer, layer.__layer, apply, x ?? layer.x, y ?? layer.y, ...arguments_);
	}

	clear(x, y, width, height) {
		_request('drClear', this.__layer, x, y, width, height);
	}

	iterate(function_) {
		_request('drIterate', this.__layer, function_);
	}
}