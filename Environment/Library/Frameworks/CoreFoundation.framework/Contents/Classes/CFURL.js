// noinspection JSAnnotator
return class CFURL {
	components(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		return value.split('/');
	}
}