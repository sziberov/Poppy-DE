// Тип, обозначающий положение и размеры прямоугольника.
//
// noinspection JSAnnotator
return class CGRectangle {
	__origin;
	__size;

	constructor(origin = new CGPoint(), size = new CGSize()) {
		if(arguments.length === 4) {
			origin = new CGPoint(arguments[0], arguments[1]);
			size = new CGSize(arguments[2], arguments[3]);
		}

		this.origin = origin;
		this.size = size;
	}

	get origin() {
		return this.__origin;
	}

	get size() {
		return this.__size;
	}

	get standardized() {
		return this.origin.x < 0 || this.origin.y < 0 || this.size.width < 0 || this.size.height < 0 ? new this.constructor(this.origin.standardized, this.size.standardized) : this;
	}

	set origin(value) {
		if(!Object.isKindOf(value, CGPoint)) {
			throw new TypeError(0);
		}

		this.__origin = value;
	}

	set size(value) {
		if(!Object.isKindOf(value, CGSize)) {
			throw new TypeError(0);
		}

		this.__size = value;
	}
}