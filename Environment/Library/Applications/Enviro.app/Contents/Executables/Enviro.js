_import('Leaf');

// noinspection JSAnnotator
return class Main {
	constructor() {
		this.initialize().catch(error => {
			throw error;
		});
	}

	async initialize() {
		LFApp.menuItems = [
			new LFMenuItem({ menu:
				new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('About')+' '+LFApp.title, action: () => LFApp.about() }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Services') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Hide')+' '+LFApp.title }),
					new LFMenuItem({ title: await CFLocalizedString('Hide others') }),
					new LFMenuItem({ title: await CFLocalizedString('Show all') }),
					new LFMenuItem().separator(),
					new LFMenuItem({ title: await CFLocalizedString('Quit')+' '+LFApp.title, action: () => LFApp.quit() })
				] })
			}),
			new LFMenuItem({ title: await CFLocalizedString('File'), menu:
				new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('New window...'), action: () => this.window() })
				] })
			}),
			new LFMenuItem({ title: await CFLocalizedString('Edit') }),
			new LFMenuItem({ title: await CFLocalizedString('View'), menu:
				new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('Toggle Menubar transparency'), action: () => {
						LFMenubar.shared.transparent = !LFMenubar.shared.transparent;
					} })
				] })
			}),
			new LFMenuItem({ title: await CFLocalizedString('Go') }),
			new LFMenuItem({ title: await CFLocalizedString('Window') }),
			new LFMenuItem({ title: await CFLocalizedString('Help') })
		]

		CFArrayOld.addObserver(LFWorkspace.shared.subviews, async (a) => {
			if(a.value.application === LFLaunchedApplication.shared && Object.isKindOf(a.value, LFWindow)) {
				let list = []

				for(let v of LFApp.windows) {
					if(v.level >= LFWindow.level.normal) {
						list.push(new LFMenuItem({ title: v.title ?? await CFLocalizedString('[Titleless]'), action: () => v.focus() }));
					}
				}
				if(list.length > 0) {
					list.unshift(new LFMenuItem().separator());
					(await LFApp.menuItems.findAsync(async v => v.title === await CFLocalizedString('Window'))).menu = new LFMenu({ items: [
						new LFMenuItem({ title: await CFLocalizedString('Close'), action: () => LFApp.windows.find(v => v.main).close() }),
						new LFMenuItem({ title: await CFLocalizedString('Minimize'), action: () => LFApp.windows.find(v => v.main).minimize() }),
						new LFMenuItem({ title: await CFLocalizedString('Maximize'), action: () => LFApp.windows.find(v => v.main).maximize() }),
						new LFMenuItem().separator(),
						new LFMenuItem({ title: await CFLocalizedString('Align windows'),
							menu: new LFMenu({ items: [
								new LFMenuItem({ title: await CFLocalizedString('Cascade') }),
								new LFMenuItem({ title: await CFLocalizedString('Column') })
							] })
						}),
						...list
					] });
				} else {
					(await LFApp.menuItems.findAsync(async v => v.title === await CFLocalizedString('Window'))).menu = undefined;
				}
			}
		});

		new LFWindow({ tag: 'desktop', level: 'desktop', type: ['borderless', 'maximized'], background: 'none' });
	}

	async window() {
		let window = new LFWindow({ width: 384, height: 256, title: LFApp.title,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: await CFLocalizedString('Alert'), action: () => LFAlert.new({ message: 'Clicked.' }) })
				] }),
				view: new LFView({ type: 'horizontal', tight: true, subviews: [
					new LFSidebar(),
					new LFView({ type: 'vertical', subviews: [
						new LFTable(),
						new LFButton()
					] })
				] })
			}),
			table = []

		table.push(new LFTableRow({ title: 'None', action: () => {
			LFWorkspace.shared.desktopImageURL = '';
		} }));
		for(let v of await _call('readDir', '/Library/Desktop Images')) {
			table.push(new LFTableRow({ title: v.name, action: () => {
				LFWorkspace.shared.desktopImageURL = '/Library/Desktop Images/'+v.name;
			} }));
		}
		window.view.subviews[1].subviews[0].subviews = table;
	}
}