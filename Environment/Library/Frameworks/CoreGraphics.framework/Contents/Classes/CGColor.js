// noinspection JSAnnotator
return (red, green, blue, alpha) => {
	return _request('drColor', red, green, blue, alpha);
}
/*
return class {
	constructor(red, green, blue, alpha) {
		if(typeof red !== 'string') {
			console.error(0); return;
		}
		if(typeof green !== 'string') {
			console.error(1); return;
		}
		if(typeof blue !== 'string') {
			console.error(2); return;
		}
		if(typeof red !== 'number') {
			console.error(3); return;
		}
		if(typeof green !== 'number') {
			console.error(4); return;
		}
		if(typeof blue !== 'number') {
			console.error(5); return;
		}

		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}

	get color() {
		return _request('drColor', red, green, blue, alpha);
	}
}
*/
