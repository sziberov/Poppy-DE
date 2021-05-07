// noinspection JSAnnotator
return class {
	static splitByLast(string = '', value) {
		let index = string.lastIndexOf(value);

		return [string.slice(0, index), string.slice(index+1)]
	}
}