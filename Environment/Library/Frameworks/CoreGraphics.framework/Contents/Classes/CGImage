// noinspection JSAnnotator
return class CGImage {
	static async new(URL, type) {
		if(typeof URL !== 'string')				throw new TypeError(0);
		if(type && typeof type !== 'string')	throw new TypeError(1);

		let layer = new CGLayer();

		layer.__layer = await _call('drOpen', URL, type);

		return layer;
	}
}