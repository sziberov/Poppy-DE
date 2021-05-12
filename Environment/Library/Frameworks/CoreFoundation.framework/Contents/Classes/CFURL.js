// noinspection JSAnnotator
return class {
	components(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		return value.split('/');
	}
}