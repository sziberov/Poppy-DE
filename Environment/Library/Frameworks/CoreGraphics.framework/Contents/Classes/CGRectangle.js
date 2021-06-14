// Тип, обозначающий положение и размеры прямоугольника.
//
// noinspection JSAnnotator
return class CGRectangle extends CFObject {
	__origin;
	__size;

	constructor({
		origin = new CGPoint(),
		size = new CGSize(),
		x = 0,
		y = 0,
		width = 0,
		height = 0
	} = {}) {
		super();

		this.origin = origin ?? new CGPoint(...arguments);
		this.size = size ?? new CGSize(...arguments);
	}

	get origin() {
		return this.__origin;
	}

	get size() {
		return this.__size;
	}

	get standardized() {
		return this.origin.x < 0 || this.origin.y < 0 || this.size.width < 0 || this.size.height < 0 ? new this.constructor({ origin: this.origin.standardized, size: this.size.standardized }) : this;
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