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