return class {
	constructor() {
		_import('Leaf');

		new LFApp().menuItems = [
			new LFMenuItem({ title: 'File',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'New Window...', action: () => this.window() })
				] })
			}),
			new LFMenuItem({ title: 'Edit' }),
			new LFMenuItem({ title: 'View',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Toggle Menubar Transparency', action: () => {
						new LFMenubar().transparent = !new LFMenubar().transparent;
					} })
				] })
			}),
			new LFMenuItem({ title: 'Go' }),
			new LFMenuItem({ title: 'Window' }),
			new LFMenuItem({ title: 'Help' })
		]

		CFArray.addObserver(new LFWorkspace().subviews, (a) => {
			if(a.value.application == new LFLaunchedApplication() && a.value.class == 'LFWindow') {
				let _list = []

				for(let v of new LFApp().windows) {
					if(v.level == 1) {
						_list.push(new LFMenuItem({ title: v.title || '[Titleless]', action: () => v.focus() }));
					}
				}
				if(_list.length > 0) {
					_list.unshift(new LFMenuItem().separator());
					new LFApp().menuItems.filter(v => v.title == 'Window')[0].menu = new LFMenu({ items: [
						new LFMenuItem({ title: 'Close', action: () => new LFApp().windows.filter(v => v.main == true)[0].close() }),
						new LFMenuItem({ title: 'Minimize', action: () => new LFApp().windows.filter(v => v.main == true)[0].minimize() }),
						new LFMenuItem({ title: 'Maximize', action: () => new LFApp().windows.filter(v => v.main == true)[0].maximize() }),
						new LFMenuItem().separator(),
						new LFMenuItem({ title: 'Align Windows',
							menu: new LFMenu({ items: [
								new LFMenuItem({ title: 'Cascade' }),
								new LFMenuItem({ title: 'Column' })
							] })
						}),
						..._list
					] });
				} else {
					new LFApp().menuItems.filter(v => v.title == 'Window')[0].menu = undefined;
				}
			}
		});

		new LFWindow({ tag: 'desktop', level: 0, style: ['borderless', 'fullscreen'], background: 'none', view:
			new LFView()
		});
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