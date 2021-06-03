// noinspection JSAnnotator
return class CGImage {
	constructor(URL, type) {
		if(typeof URL !== 'string') {
			console.error(0); return;
		}

		let layer = new CGLayer();

		layer.__layer = _request('drOpen', CFFile.content(URL), type);

		return layer;
	}
}