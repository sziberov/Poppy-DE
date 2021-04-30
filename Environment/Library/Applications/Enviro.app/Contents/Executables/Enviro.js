return class {
	constructor() {
		_import('Leaf');

		new LFApp().menuItems = [
			new LFMenuItem({ title: CFLocalizedString('File'),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('New Window...'), action: () => this.window() })
				] })
			}),
			new LFMenuItem({ title: CFLocalizedString('Edit') }),
			new LFMenuItem({ title: CFLocalizedString('View'),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('Toggle Menubar Transparency'), action: () => {
						new LFMenubar().transparent = !new LFMenubar().transparent;
					} })
				] })
			}),
			new LFMenuItem({ title: CFLocalizedString('Go') }),
			new LFMenuItem({ title: CFLocalizedString('Window') }),
			new LFMenuItem({ title: CFLocalizedString('Help') })
		]

		CFArray.addObserver(new LFWorkspace().subviews, (a) => {
			if(a.value.application == new LFLaunchedApplication() && a.value.class == 'LFWindow') {
				let list = []

				for(let v of new LFApp().windows) {
					if(v.level == 1) {
						list.push(new LFMenuItem({ title: v.title || '[Titleless]', action: () => v.focus() }));
					}
				}
				if(list.length > 0) {
					list.unshift(new LFMenuItem().separator());
					new LFApp().menuItems.find(v => v.title == CFLocalizedString('Window')).menu = new LFMenu({ items: [
						new LFMenuItem({ title: CFLocalizedString('Close'), action: () => new LFApp().windows.find(v => v.main == true).close() }),
						new LFMenuItem({ title: CFLocalizedString('Minimize'), action: () => new LFApp().windows.find(v => v.main == true).minimize() }),
						new LFMenuItem({ title: CFLocalizedString('Maximize'), action: () => new LFApp().windows.find(v => v.main == true).maximize() }),
						new LFMenuItem().separator(),
						new LFMenuItem({ title: CFLocalizedString('Align Windows'),
							menu: new LFMenu({ items: [
								new LFMenuItem({ title: CFLocalizedString('Cascade') }),
								new LFMenuItem({ title: CFLocalizedString('Column') })
							] })
						}),
						...list
					] });
				} else {
					new LFApp().menuItems.find(v => v.title == CFLocalizedString('Window')).menu = undefined;
				}
			}
		});

		new LFWindow({ tag: 'desktop', level: 0, style: ['borderless', 'fullscreen'], background: 'none', view:
			new LFView()
		});
	}

	window() {
		let window = new LFWindow({ width: 384, height: 256, title: new LFApp().bundle.properties.CFBundleTitle,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: CFLocalizedString('Alert'), action: () => new LFAlert({ message: 'Clicked.' }) })
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
			new LFWorkspace().desktopImage = '';
		} }));
		for(let v of _request('readDir', '/Library/Desktop Images')) {
			table.push(new LFTableRow({ title: v.name, action: function(v) {
				return () => new LFWorkspace().desktopImage = '/Library/Desktop Images/'+v.name;
			}.bind(this)(v) }));
		}
		window.view.subviews[1].subviews[0].subviews = table;
	}
}