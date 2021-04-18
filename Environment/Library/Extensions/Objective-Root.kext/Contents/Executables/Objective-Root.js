window.Object.isEqual = (object, object_) => {
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
window.Array.prototype.contains = function(value) {
	if(typeof value === 'object' && value !== null) {
		return this.filter(v => Object.isEqual(v, value)).length > 0;
	} else {
		return this.includes(value);
	}
}
window.Number.prototype.toHexString = (n) => {
	return '0x'+(n+0x10000).toString(16).substr(-4).toUpperCase();
}
window.Math.isEven = (n) => {
	return n % 2 == 0;
}
window.Math.isOdd = (n) => {
	return Math.abs(n % 2) == 1;
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
window.YES = true;
window.NO = false;
window.ObjR = class {
	static transpile(value) {
		let string = value.replace(/(\r\n|\n|\r|\\n)/gm, '').trim();

	//	string.;

		return string;
	}
}