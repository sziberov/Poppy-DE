return class {
	constructor() {
		_import('Leaf');

		/*
		new LFApp().menu = new LFMenu({ items: [
			new LFMenuItem({ title: 'File' }),
			new LFMenuItem({ title: 'Edit' }),
			new LFMenuItem({ title: 'View',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Toggle Menubar Transparency', action: () => {
						var a = new LFMenubar().transparent;

						new LFMenubar().transparent = !a;
					} })
				] })
			}),
			new LFMenuItem({ title: 'Go' }),
			new LFMenuItem({ title: 'Window',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Minimize', action: () => new LFApp().windows.filter(v => v.main == true)[0].minimize() }),
					new LFMenuItem({ title: 'Maximize', action: () => new LFApp().windows.filter(v => v.main == true)[0].maximize() }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'New Window...', action: () => this.window() }),
					new LFMenuItem({ title: 'Align Windows',
						menu: new LFMenu({ items: [
							new LFMenuItem({ title: 'Cascade' }),
							new LFMenuItem({ title: 'Column' })
						] })
					}),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Windows List...' })
				] })
			}),
			new LFMenuItem({ title: 'Help' })
		] });
		*/
		new LFApp().menus = [
			new LFMenu({ title: 'File' }),
			new LFMenu({ title: 'Edit' }),
			new LFMenu({ title: 'View', items: [
				new LFMenuItem({ title: 'Toggle Menubar Transparency', action: () => {
					var a = new LFMenubar().transparent;

					new LFMenubar().transparent = !a;
				} })
			] }),
			new LFMenu({ title: 'Go' }),
			new LFMenu({ title: 'Window', items: [
				new LFMenuItem({ title: 'Minimize', action: () => new LFApp().windows.filter(v => v.main == true)[0].minimize() }),
				new LFMenuItem({ title: 'Maximize', action: () => new LFApp().windows.filter(v => v.main == true)[0].maximize() }),
				new LFMenuItem().separator(),
				new LFMenuItem({ title: 'New Window...', action: () => this.window() }),
				new LFMenuItem({ title: 'Align Windows',
					menu: new LFMenu({ items: [
						new LFMenuItem({ title: 'Cascade' }),
						new LFMenuItem({ title: 'Column' })
					] })
				}),
				new LFMenuItem().separator(),
				new LFMenuItem({ title: 'Windows List...' })
			] }),
			new LFMenu({ title: 'Help' })
		]

		new LFWindow({ tag: 'desktop', level: 0, style: ['borderless', 'fullscreen'], background: 'none', view:
			new LFView()
		});
	}

	aboutSystem() {
		function bytesConvert(a) {
			var b = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
				c = parseInt(Math.floor(Math.log(a) / Math.log(1024))),
				d = (a == 0 ? '0 Bytes' : Math.round(a / Math.pow(1024, c), 2) + ' ' + b[c]);

			return d;
		}

		var _system = _request('system'),
			_pc = 'Poppy Monoblock Pro 2019', //_system.hostname(),
			_cpu = _system.cpus()[0].model,
			_memory = bytesConvert(_system.totalmem()),
			_gpu = (() => {
				var _variable;
				/*
				require('child_process').execSync('wmic path win32_VideoController get name', (error, stdout, stderr) => {
					if(!_error && !_stderr) {
						_variable = stdout.replace('Name ', '').trim();
					}
				});
				*/
			//	console.log(_variable);

				return _variable;
			})(),
			_software = _request('version', 'DE').join(' '),
			_window = new LFApp().windows.filter(v => v.tag == 'aboutSystem')[0]

		if(!_window) {
			new LFWindow({ tag: 'aboutSystem', x: 'center', y: 'center', width: 512, height: 184, style: ['titled', 'closable', 'minimizable'], title: 'About This Poppy', view:
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
								new LFText({ string: _gpu || 'Unknown', size: 'small' }),
								new LFText({ string: _software, size: 'small' }),
								new LFText({ string: 'Unknown', size: 'small' })
							] })
						] })
					] })
				] })
			});
		} else {
			_window.focus();
		}
	}

	window() {
		let _window = new LFWindow({ width: 384, height: 256, title: new LFApp().bundle.properties.CFBundleTitle,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: 'Alert', action: () => new LFAlert({ message: 'Clicked.' }) })
				] }),
				view: new LFView({ type: 'horizontal', tight: true, subviews: [
					new LFSidebar(),
					new LFView({ type: 'vertical', subviews: [
						new LFTable(),
						new LFButton()
					] })
				] })
			}),
			_table = []

		_table.push(new LFTableRow({ title: 'None', action: () => {
			new LFWorkspace().desktopImage = '';
		} }));
		for(let v of _request('readDir', '/Library/Desktop Images')) {
			_table.push(new LFTableRow({ title: v.name, action: function(v) {
				return () => new LFWorkspace().desktopImage = '/Library/Desktop Images/'+v.name;
			}(v) }));
		}
		_window.view.subviews[1].subviews[0].setSubviews(_table);
	}
}