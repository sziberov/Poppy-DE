// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __URLSs = []

	constructor(URL) {
		this.URL = URL;
		this.element;
	}

	add() {
		if(!this.element && this.URL && !this.constructor.__URLSs.includes(this.URL)) {
			let file = CFFile.content(this.URL),
				type =
					this.URL.endsWith('.less') ? 'less' :
					this.URL.endsWith('.css') ? 'css' :
					undefined;

			if(file && type) {
				let add = $('<style/>');

				this.constructor.__URLSs.push(this.URL);
				add.attr('type', 'text/'+type);
				add.text(file.replace(/@(Resources)/g, this.URL.replace(/(?<=\/Resources\/)(.*)/g, '')));

				this.element = add.appendTo('body');

				if(type === 'less') {
					less?.refreshStyles();
				}
			}
		}

		return this;
	}

	remove() {
		if(this.element) {
			CFArray.remove(this.constructor.__URLSs, this.URL);
			this.element.remove();
			this.element = undefined;
		}

		return this;
	}
}