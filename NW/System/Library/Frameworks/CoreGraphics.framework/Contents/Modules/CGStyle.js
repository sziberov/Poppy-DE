return class {
	constructor(_url) {
		this.url = _url;
		this.element = $('<style type="text/css"/>');

		if(this.url) this.element.text(CFFile.content(this.url+'/Style.css').replace(/@(Resources)/g, this.url));
	}

	add() {
		this.element = this.element.appendTo('body');

		return this;
	}

	remove() {
		this.element.remove();

		return this;
	}
}