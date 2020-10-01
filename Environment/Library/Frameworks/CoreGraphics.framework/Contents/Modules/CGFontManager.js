return _fork('@Title') || _single(class {
	constructor(_url) {
		this.url = _url;
		this.element = $('<style type="text/css"/>');
		this.fonts = []

		if(this.url) {
			var a = '';

			for(var v of CFDirectory.content(this.url, 'Files')/*.sort((a, b) => a < b ? -1 : 1)*/) {
				let a = v.includes('-') ? v.split('-')[1].toLowerCase() : '',
					b = a !== '' ? a.substr(0, a.lastIndexOf('.')) : a,
					c = v.split('.')[1].toLowerCase();

				this.fonts.push({
					url: this.url+'/'+v,
					format: c == 'ttf' ? 'truetype' : c,
					family: v.includes('-') ? v.substr(0, v.lastIndexOf('-')) : v.substr(0, v.lastIndexOf('.')),
					style: 'normal',
					weight: ['light', 'medium', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'].includes(b) ? b : 'normal'
				});
			}
			for(var v of this.fonts) {
				v.family = v.family+(v.weight !== 'normal' ? '-'+v.weight[0].toUpperCase()+v.weight.slice(1) : '');

				a += `
					@font-face {
						src: url('${v.url}') format('${v.format}');
						font-family: '${v.family}';
						font-style: 'normal';
						font-weight: 'normal';
					}
				`;
			}

			this.element.text(a);
		}
		console.log(this.fonts);
		this.add();
	}

	add() {
		this.element = this.element.appendTo('body');

		return this;
	}

	remove() {
		this.element.remove();

		return this;
	}
});