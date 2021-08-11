// noinspection JSAnnotator
return $CFShared[_title] ?? class CGFontManager {
	static __shared;

	static get shared() {
		return this.__shared;
	}

	static async new(URL) {
		let self = this.__shared ?? new this();

		if(!this.__shared) {
			this.__shared = self;
		} else {
			console.error(0); return;
		}

		self.URL = URL;
		self.element = $('<style type="text/css"/>');
		self.fonts = []

		if(self.URL) {
			let a = '';

			for(let v of await CFDirectory.content(self.URL, 'Files')/*.sort((a, b) => a < b ? -1 : 1)*/) {
				let a = v.includes('-') ? v.split('-')[1].toLowerCase() : '',
					b = a !== '' ? a.substr(0, a.lastIndexOf('.')) : a,
					c = v.split('.')[1].toLowerCase();

				self.fonts.push({
					URL: self.URL+'/'+v,
					format: c === 'ttf' ? 'truetype' : c,
					family: v.includes('-') ? v.substr(0, v.lastIndexOf('-')) : v.substr(0, v.lastIndexOf('.')),
					style: 'normal',
					weight: ['light', 'medium', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'].includes(b) ? b : 'normal'
				});
			}
			for(let v of self.fonts) {
				v.family = v.family+(v.weight !== 'normal' ? '-'+v.weight[0].toUpperCase()+v.weight.slice(1) : '');

				a += `
					@font-face {
						src: url('${ v.URL }') format('${ v.format }');
						font-family: '${ v.family }';
						font-style: 'normal';
						font-weight: 'normal';
					}
				`;
			}

			self.element.text(a);
		}

		self.add();

		// TODO Доделать (не обязательно)

		return self;
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