/**
 * Objective-Root
 *
 * Расширения для JS. Здесь находится часть, использующаяся на уровне ядра и выше.
 * Другая, относящаяся только к процессам - в ядре.
 *
 * @version 0.1
 */

window.Object.isObject = (value) => {
	return typeof value === 'object' && value !== null;
}

window.Object.isShallowlyEqual = (object, object_) => {
	if(Object.keys(object).length !== Object.keys(object_).length) {
		return false;
	}

	for(let k in object) {
		if(object[k] !== object_[k]) {
			return false;
		}
	}

	return true;
}

let isClassOf = function(value, value_, strict) {
	if(
		!Object.isObject(value) && typeof value !== 'function' ||
		!Object.isObject(value_) && typeof value_ !== 'function' ||
		strict && typeof strict !== 'boolean'
	) {
	//	throw new TypeError(0);
		return false;
	}

	if(Object.isObject(value_)) {
		if(typeof value_.__proto__?.constructor === 'function') {
			value_ = value_.__proto__.constructor;
		} else {
			return false;
		}
	}

	let toString = Function.prototype.toString,	// (class {}).toString
		proto = value;

	while(true) {
		value = proto;

		if(Object.isObject(value)) {
			if(typeof value.__proto__?.constructor === 'function') {
				value = value.__proto__.constructor;
			} else {
				return false;
			}
		}

		if(value === value_ || toString.call(value) === toString.call(value_)) {
			return true;
		}

		if(strict) {
			break;
		}
		if(proto.__proto__ && proto.__proto__ !== Object.__proto__) {
			proto = proto.__proto__;
		} else {
			break;
		}
	}

	return false;
}

window.Object.isMemberOf = function(value, value_) {
	return isClassOf(value, value_, true);
}

window.Object.isKindOf = function(value, value_) {
	return isClassOf(value, value_);
}

window.Object.sizeOf = function(object) {
	let objects = [],
		stack = [object],
		bytes = 0;

	while(stack.length) {
		let value = stack.pop();

		if(typeof value === 'boolean') {
			bytes += 4;
		} else
		if(typeof value === 'string') {
			bytes += value.length*2;
		} else
		if(typeof value === 'number') {
			bytes += 8;
		} else
		if(typeof value === 'object' && objects.indexOf(value) === -1) {
			objects.push(value);

			for(let i in value) {
				stack.push(value[i]);
			}
		}
	}

	return bytes;
}

//window.Object.assign = function(object, ...arguments) {}

let arrayFields = {
	startsWith: {
		value: function(value) {
			for(let k in value) {
				if(this[k] !== value[k]) {
					return false;
				}
			}

			return true;
		},
		enumerable: false,
		writable: true
	},
	shallowlyContains: {
		value: function(value) {
			if(Object.isObject(value)) {
				return this.filter(v => Object.isShallowlyEqual(v, value)).length > 0;
			} else {
				return this.includes(value);
			}
		},
		enumerable: false,
		writable: true
	},
	initialize: {
		value: function(value) {
			if(this.length < 1) {
				this.push(value);
			}

			return this;
		},
		enumerable: false,
		writable: true
	}
}

Object.defineProperties(window.Array.prototype, arrayFields);
Object.defineProperties(window.Buffer.prototype, arrayFields);

window.Symbol.collection = Symbol('collection');
window.Symbol.get = Symbol('get');
window.Symbol.set = Symbol('set');
window.Symbol.call = Symbol('call');
window.Symbol.delete = Symbol('delete');

window.Number.prototype.toHexString = function() {
	return '0x'+(this.valueOf()+0x10000).toString(16).substr(-4).toUpperCase();
}

window.Math.isEven = (n) => {
	return n%2 === 0;
}

window.Math.isOdd = (n) => {
	return Math.abs(n%2) === 1;
}

window.Math.randomArbitrary = (min, max) => {
	return Math.random()*(max-min)+min;
}

window.Math.randomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random()*(max-min))+min;
}

window.Math.randomIntInclusive = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random()*(max-min+1))+min;
}

window.nil = undefined;