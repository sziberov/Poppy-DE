_import('Leaf');

// noinspection JSAnnotator
return class {
	constructor() {
		this.__services = [
			{
				identifier: 'ru.poppy.enviro',
				URL: '/Environment/Library/Applications/Enviro',
				error: false
			},
			{
				identifier: 'ru.poppy.dock',
				URL: '/Environment/Library/Applications/Dock',
				error: false
			}
		]

		LFApp.focusingPolicy = 1;

		new CGCursor();
		new CGFontManager('/Environment/Library/Fonts');
		LFWorkspace.shared.desktopImage = '/Library/Desktop Images/249785.png';
		LFWorkspace.shared.add();

		LFMenubar.shared.mainMenu.items = [
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateLogo' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('About This Poppy'), action: () => this.about() }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: CFLocalizedString('Environment Preferences'), action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') }),
					new LFMenuItem({ title: CFLocalizedString('Dock'),
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
					new LFMenuItem({ title: CFLocalizedString('Force Quit'), action: () => this.forceQuit() }),
					new LFMenuItem({ title: CFLocalizedString('Activity Monitor'), action: () => LFWorkspace.shared.launchApplication('/Applications/Activity Monitor') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: CFLocalizedString('Relaunch'), action: () => _call('relaunch') }),
					new LFMenuItem({ title: CFLocalizedString('Quit'), action: () => _call('quit') })
				] })
			})
		]
		LFMenubar.shared.statusMenu.items = [
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateNotifications' }), action: () => alert('HUHU') }),
			new LFMenuItem({ title: '', image: new LFImage({ shared: 'TemplateSearch' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('Search...') })
				] })
			}),
			new LFMenuItem({ title: 'DIES', action: function() { this.title = 'Random Title' } }),
			new LFMenuItem({ title: '20:48',
				action: function() {
					let update = () => {
						let date = new Date(),
							time = ('0'+date.getHours()).substr(-2)+':'+('0'+date.getMinutes()).substr(-2)/*+':'+('0'+date.getSeconds()).substr(-2)*/;

						this.title = time;
					}
					update();
					CFEvent.addHandler('dateChanged', update);
				//	_call('timerCreate', true, 1000, update);
				},
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('View as Analog') }),
					new LFMenuItem({ title: CFLocalizedString('View as Digital') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: CFLocalizedString('Date & Time Preferences...'), action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') })
				] })
			}),
			new LFMenuItem({ title: '', image: new LFImage({ width: 24, shared: 'TemplateBatteryConnected' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: '100% Remaining' }),
					new LFMenuItem({ title: 'Power Source: Charger' }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Energy Saver Preferences...', action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') })
				] })
			})
		]

		this.launchServices();
		CFArrayOld.addObserver(LFWorkspace.shared.launchedApplications, () => this.launchServices());
	}

	launchServices() {
		for(let v of this.__services) {
			if(!v.error && !LFWorkspace.shared.getApplication(v.identifier)) {
				try {
					LFWorkspace.shared.launchApplication(v.URL);
				} catch {
					v.error = true;
				}
			}
		}
	}

	about() {
		let bytesConvert = (a) => {
				let b = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
					c = Math.floor(Math.log(a)/Math.log(1024)),
					d = (a === 0 ? '0 Bytes' : Math.round(a/Math.pow(1024, c))+' '+b[c]);

				return d;
			},
			system = _call('system'),
			pc = 'Poppy Monoblock Pro 2019', //system.hostname(),
			cpu = system.cpus()[0].model+' x'+system.cpus().length,
			memory = bytesConvert(system.totalmem()),
			gpu = system.gpu,
			software = _call('version', 'DE').join(' '),
			window = LFApp.windows.find(v => v.tag === 'about');

		if(!window) {
			new LFWindow({ tag: 'about', width: 512, height: 184, /*background: CGColor('100', '100', '100'),*/ type: ['titled', 'closable', 'minimizable'], title: CFLocalizedString('About This Poppy'), view:
				new LFView({ yAlign: 'center', subviews: [
					new LFImage({ width: 128, height: 128, shared: 'Monoblock' }),
					new LFView({ type: 'vertical', subviews: [
						new LFText({ string: pc, size: 'big', weight: 'bold' }),
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: CFLocalizedString('Processor'), size: 'small', weight: 'bold' }),
								new LFText({ string: CFLocalizedString('Memory'), size: 'small', weight: 'bold' }),
								new LFText({ string: CFLocalizedString('Graphics'), size: 'small', weight: 'bold' }),
								new LFText({ string: CFLocalizedString('Software'), size: 'small', weight: 'bold' }),
								new LFText({ string: CFLocalizedString('Serial Number'), size: 'small', weight: 'bold' }),
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: cpu, size: 'small' }),
								new LFText({ string: memory, size: 'small' }),
								new LFText({ string: gpu ?? CFLocalizedString('Unknown'), size: 'small' }),
								new LFText({ string: software, size: 'small' }),
								new LFText({ string: CFLocalizedString('Unknown'), size: 'small' })
							] })
						] })
					] })
				] })
			}).center();
		} else {
			window.focus();
		}
	}

	forceQuit() {
		let window = LFApp.windows.find(v => v.tag === 'forceQuit');

		if(!window) {
			new LFWindow({ tag: 'forceQuit', width: 384, type: ['titled', 'closable', 'resizable'], title: CFLocalizedString('Force Quit Applications'),
				view: new LFView({ type: 'vertical', subviews: [
					new LFText({ string: CFLocalizedString('Force Quit Applications_Description'), size: 'small' })
				] })
			});
		} else {
			window.focus();
		}
	}

	willQuit() {
		CGCursor.shared.remove();
		LFWorkspace.shared.remove();

	//	_call('quit');
	}
}