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