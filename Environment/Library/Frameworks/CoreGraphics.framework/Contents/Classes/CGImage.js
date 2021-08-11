// noinspection JSAnnotator
return class CGImage {
	static async new(URL, type) {
		if(typeof URL !== 'string') {
			throw new TypeError(0);
		}

		let layer = new CGLayer();

		layer.__layer = _call('drOpen', await CFFile.content(URL), type);

		return layer;
	}
}