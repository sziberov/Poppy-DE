// noinspection JSAnnotator
return class {
	static __friends__ = [CGLayer]

	constructor(URL, type) {
		if(typeof URL !== 'string') {
			console.error(0); return;
		}

		this.__layer = _request('drOpen', CFFile.content(URL), type);
	}

	get width() {
		return this.__layer.width;
	}

	get height() {
		return this.__layer.height;
	}
}