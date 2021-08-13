_import('Leaf');

// noinspection JSAnnotator
return class Main {
	constructor() {
		this.initialize().catch(error => {
			throw error;
		});
	}

	async initialize() {
		this.__services = [
			{
				identifier: 'ru.poppy.enviro',
				URL: '/Environment/Library/Applications/Enviro',
				status: 'stopped'
			},
			{
				identifier: 'ru.poppy.dock',
				URL: '/Environment/Library/Applications/Dock',
				status: 'stopped'
			}
		]

		LFApp.focusingPolicy = 1;

		new CGCursor();
		CGFontManager.new('/Environment/Library/Fonts');
		LFWorkspace.shared.desktopImage = '/Library/Desktop Images/249785.png';
		LFWorkspace.shared.add();

		LFMenubar.shared.mainMenu.items = [
			new LFMenuItem({ title: '', image: await LFImage.new({ shared: 'TemplateLogo' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('About this Poppy'), action: () => this.about() }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Environment Preferences'), action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') }),
					new LFMenuItem({ title: await CFLocalizedString('Dock'),
						menu: new LFMenu({ items: [
							new LFMenuItem({ title: 'Test Alert', action: () => LFAlert.new() }),
							new LFMenuItem({ title: 'Submenu',
								menu: new LFMenu({ items: [
									new LFMenuItem(),
									new LFMenuItem()
								] })
							})
						] })
					}),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Force quit...'), action: () => this.forceQuit() }),
					new LFMenuItem({ title: await CFLocalizedString('Activity Monitor'), action: () => LFWorkspace.shared.launchApplication('/Applications/Activity Monitor') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Relaunch'), action: () => _call('relaunch') }),
					new LFMenuItem({ title: await CFLocalizedString('Quit'), action: () => _call('quit') })
				] })
			})
		]
		LFMenubar.shared.statusMenu.items = [
			new LFMenuItem({ title: '', image: await LFImage.new({ shared: 'TemplateNotifications' }), action: () => alert('HUHU') }),
			new LFMenuItem({ title: '', image: await LFImage.new({ shared: 'TemplateSearch' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('Search...') })
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
					new LFMenuItem({ title: await CFLocalizedString('View as analog') }),
					new LFMenuItem({ title: await CFLocalizedString('View as digital') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Date & Time preferences...'), action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') })
				] })
			}),
			new LFMenuItem({ title: '', image: await LFImage.new({ width: 24, shared: 'TemplateBatteryConnected' }),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: '100% Remaining' }),
					new LFMenuItem({ title: 'Power source: Charger' }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: 'Energy saver preferences...', action: () => LFWorkspace.shared.launchApplication('/Applications/Environment Preferences') })
				] })
			})
		]

		this.updateServices();
		CFArrayOld.addObserver(LFWorkspace.shared.launchedApplications, (a) => this.updateServices(a));
	}

	updateServices(a) {
		if(a?.event === 'removed') {
			this.__services.find(v => v.identifier === a.value.identifier && v.status !== 'failed').status = 'stopped';
		}
		for(let v of this.__services) {
			if(!['launching', 'failed'].includes(v.status) && !LFWorkspace.shared.getApplication(v.identifier)) {
				v.status = 'launching';
				LFWorkspace.shared.launchApplication(v.URL).catch(e => {
					v.status = 'failed';
				});
			}
		}
	}

	async about() {
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
			new LFWindow({ tag: 'about', width: 512, height: 184, /*background: CGColor('100', '100', '100'),*/ type: ['titled', 'closable', 'minimizable'], title: await CFLocalizedString('About this Poppy'), view:
				new LFView({ yAlign: 'center', subviews: [
					await LFImage.new({ width: 128, height: 128, shared: 'Monoblock' }),
					new LFView({ type: 'vertical', subviews: [
						new LFText({ string: pc, size: 'big', weight: 'bold' }),
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: await CFLocalizedString('Processor'), size: 'small', weight: 'bold' }),
								new LFText({ string: await CFLocalizedString('Memory'), size: 'small', weight: 'bold' }),
								new LFText({ string: await CFLocalizedString('Graphics'), size: 'small', weight: 'bold' }),
								new LFText({ string: await CFLocalizedString('Software'), size: 'small', weight: 'bold' }),
								new LFText({ string: await CFLocalizedString('Serial number'), size: 'small', weight: 'bold' }),
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: cpu, size: 'small' }),
								new LFText({ string: memory, size: 'small' }),
								new LFText({ string: gpu ?? await CFLocalizedString('Unknown'), size: 'small' }),
								new LFText({ string: software, size: 'small' }),
								new LFText({ string: await CFLocalizedString('Unknown'), size: 'small' })
							] })
						] })
					] })
				] })
			}).center();
		} else {
			window.focus();
		}
	}

	async forceQuit() {
		let window = LFApp.windows.find(v => v.tag === 'forceQuit');

		if(!window) {
			new LFWindow({ tag: 'forceQuit', width: 384, type: ['titled', 'closable', 'resizable'], title: await CFLocalizedString('Force quit applications'),
				view: new LFView({ type: 'vertical', subviews: [
					new LFText({ string: await CFLocalizedString('Force quit applications_Description'), size: 'small' })
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