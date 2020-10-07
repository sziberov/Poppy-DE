return class {
	#services = [
		{
			identifier: 'ru.poppy.enviro',
			url: '/Environment/Library/Applications/Enviro',
			error: false
		},
		{
			identifier: 'ru.poppy.dock',
			url: '/Environment/Library/Applications/Dock',
			error: false
		}
	]

	constructor() {
		_import('Leaf');

		new LFApp().focusingPolicy = 1;

		new CGCursor();
		new CGFontManager('/Environment/Library/Fonts');
		new LFWorkspace().desktopImage = '/Library/Desktop Images/249785.jpg';
		new LFWorkspace().add();

		new LFMenubar().mainMenu.items = [
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateLogo' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'About This Poppy', action: () => this.about() }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Environment Preferences', action: () => new LFWorkspace().launchApplication('/Applications/Environment Preferences') }),
					new LFMenuItem({ title: 'Dock',
						menu: new LFMenu({ items: [
							new LFMenuItem({ title: 'Test Alert', action: () => new LFAlert() }),
							new LFMenuItem({ title: 'Submenu',
								menu: new LFMenu({ items: [
									new LFMenuItem(),
									new LFMenuItem()
								] })
							})
						] })
					}),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Force Quit', action: () => this.forceQuit() }),
					new LFMenuItem({ title: 'Activity Monitor', action: () => new LFWorkspace().launchApplication('/Applications/Activity Monitor') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Relaunch', action: () => _request('relaunch') }),
					new LFMenuItem({ title: 'Quit', action: () => _request('quit') })
				] })
			})
		]
		new LFMenubar().statusMenu.items = [
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateNotifications' }), action: () => alert('HUHU') }),
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateSearch' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Search...' })
				] })
			}),
			new LFMenuItem({ title: 'DIES', action: function() { this.title = 'Random Title' } }),
			new LFMenuItem({ title: '20:48',
				action: function() {
					let update = () => {
						let _date = new Date(),
							_time = ('0'+_date.getHours()).substr(-2)+':'+('0'+_date.getMinutes()).substr(-2);

						this.title = _time;
					}
					update();
					setInterval(update, 30000);
				},
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'View as Analog' }),
					new LFMenuItem({ title: 'View as Digital' }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Date & Time Preferences...', action: () => new LFWorkspace().launchApplication('/Applications/Environment Preferences') })
				] })
			}),
			new LFMenuItem({ title: '', image: new LFImage({ width: 24, shared: 'TemplateBatteryConnected' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: '100% Remaining' }),
					new LFMenuItem({ title: 'Power Source: Charger' }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Energy Saver Preferences...', action: () => new LFWorkspace().launchApplication('/Applications/Environment Preferences') })
				] })
			})
		]

		this.launchServices();
		CFArray.addObserver(new LFWorkspace().launchedApplications, () => this.launchServices());
	}

	launchServices() {
		for(let v of this.#services) {
			if(!v.error && !new LFWorkspace().getApplication(v.identifier)) {
				try {
					new LFWorkspace().launchApplication(v.url);
				} catch {
					v.error = true;
				}
			}
		}
	}

	about() {
		var bytesConvert = (a) => {
				var b = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
					c = parseInt(Math.floor(Math.log(a) / Math.log(1024))),
					d = (a == 0 ? '0 Bytes' : Math.round(a / Math.pow(1024, c), 2) + ' ' + b[c]);

				return d;
			},
			_system = _request('system'),
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
			_window = new LFApp().windows.filter(v => v.tag == 'about')[0]

		if(!_window) {
			new LFWindow({ tag: 'about', x: 'center', y: 'center', width: 512, height: 184, style: ['titled', 'closable', 'minimizable'], title: 'About This Poppy', view:
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

	forceQuit() {
		let _window = new LFApp().windows.filter(v => v.tag == 'forceQuit')[0];

		if(!_window) {
			new LFWindow({ tag: 'forceQuit', width: 384, style: ['titled', 'closable', 'resizable'], title: 'Force Quit Applications',
				view: new LFView({ type: 'vertical', subviews: [
					new LFText({ string: 'If an application doesn\'t respond for a while, select it\'s title and click Force Quit.', size: 'small' })
				] })
			});
		} else {
			_window.focus();
		}
	}

	deconstructor() {
		new CGCursor().remove();
		new LFWorkspace().remove();

		new CFProcessInfo().environment._PoppyMenu = undefined;
	}
}