return class {
	constructor() {
		_LFApp.menus.push(
			new LFButton({ title: 'File', action: () => _LFMenubar.transparent = false }),
			new LFButton({ title: 'Edit' }),
			new LFButton({ title: 'View' }),
			new LFButton({ title: 'Go' }),
			new LFButton({ title: 'Window', action: () => this.window() }),
			new LFButton({ title: 'Help', action: () => _LFApp.about({ width: 128, height: 128 }) })
		);
		_LFApp.windows.push(
			new LFWindow({ tag: 'desktop', level: 0, style: ['borderless', 'fullscreen'], background: 'none', view:
				new LFView()
			})
		);

		/*
		new LFMenu({ items: [
			new LFMenuItem({ title: 'File', menu: }),
			new LFMenuItem({ title: 'Edit', menu: }),
			new LFMenuItem({ title: 'View', menu: }),
			new LFMenuItem({ title: 'Go', menu: }),
			new LFMenuItem({ title: 'Window', menu: }),
			new LFMenuItem({ title: 'Help', menu: })
		] }).add();
		*/
	}

	aboutSystem() {
		function bytesConvert(a) {
			var b = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
				c = parseInt(Math.floor(Math.log(a) / Math.log(1024))),
				d = (a == 0 ? '0 Bytes' : Math.round(a / Math.pow(1024, c), 2) + ' ' + b[c]);

			return d;
		}

		var _system = require('os'),
			_pc = 'Poppy Monoblock Pro 2019', //_system.hostname(),
			_cpu = _system.cpus()[0].model,
			_memory = bytesConvert(_system.totalmem()),
			_software = 'Poppy DE '+_Opium.DEVersion,
			_aboutSystem =
				new LFWindow({ tag: 'aboutSystem', width: 512, height: 184, title: 'About This Poppy', view:
					new LFView({ yAlign: 'center', subviews: [
						new LFImage({ width: 128, height: 128, shared: 'Monoblock' }),
						new LFView({ type: 'vertical', subviews: [
							new LFText({ string: _pc, size: 'big', weight: 'bold' }),
							new LFView({ subviews: [
								new LFView({ type: 'vertical', tight: true, subviews: [
									new LFText({ string: 'Processor', size: 'small', weight: 'bold' }),
									new LFText({ string: 'Memory', size: 'small', weight: 'bold' }),
									new LFText({ string: 'Graphics', size: 'small', weight: 'bold' }),
									new LFText({ string: 'Software', size: 'small', weight: 'bold' }),
									new LFText({ string: 'Serial Number', size: 'small', weight: 'bold' }),
								] }),
								new LFView({ type: 'vertical', tight: true, subviews: [
									new LFText({ string: _cpu, size: 'small' }),
									new LFText({ string: _memory, size: 'small' }),
									new LFText({ string: 'Unknown', size: 'small' }),
									new LFText({ string: _software, size: 'small' }),
									new LFText({ string: 'Unknown', size: 'small' })
								] })
							] })
						] })
					] })
				}),
			_window = _LFApp.windows.filter(v => v.tag == 'aboutSystem')[0];

		if(!_window) _LFApp.windows.push(_aboutSystem); else _window.focus();
	}

	window() {
		_LFApp.windows.push(
			new LFWindow({ width: 384, height: 256, title: _LFApp.bundle.properties.CFBundleTitle,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: 'Button', action: () => _LFApp.windows.push(new LFAlert({ message: 'Clicked.' })) })
				] }),
				view: new LFView({ subviews: [
					new LFButton()
				] })
			})
		);
	}
}