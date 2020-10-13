return class {
	constructor() {
		_import('Leaf');

		new LFApp().quitableBySingleWindow = true;

		new LFApp().menuItems = [
			new LFMenuItem({ title: 'File',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Quit Highlighted', action: () => this.quit() }),
					new LFMenuItem({ title: 'Update', action: () => this.update() }),
					new LFMenuItem({ title: 'Switch', action: () => this.switch() })
				] })
			})
		]

		new LFWindow({ x: 'center', y: 'center', width: 512, height: 256, title: new LFApp().title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: undefined, image: new LFImage({ shared: 'TemplateQuit' }), action: () => this.quit() }),
				new LFButton({ title: undefined, image: new LFImage({ shared: 'TemplateInfo' }), action: () => this.information() })
			] }),
			view: new LFView({ tight: true, yAlign: 'stretch', subviews: [
				new LFTable()
			] })
		});

		this.table = new LFApp().windows[0].view.subviews[0]
		this.update();
		CFArray.addObserver(new LFWorkspace().launchedApplications, () => this.update());
	}

	update() {
		let update = []

		for(let v of new LFWorkspace().launchedApplications) {
			update.push(
				new LFTableRow({ title: v.title, data: { application: v }, action: function(v) {
					return () => v.focus()
				}(v) })
			);
		}
		this.table.subviews = update;
	}

	quit() {
		this.table.activeRow?.data.application.quit();
	}

	switch() {
		this.table.activeRow?.data.application.focus();
	}

	information() {
		let application = this.table.activeRow?.data.application;

		if(application) {
			let window = new LFApp().windows.filter(v => v.tag == application.identifier)[0]

			if(!window) {
				new LFWindow({ tag: application.identifier, width: 384, style: ['titled', 'closable', 'minimizable'], title: application.title,
					view: new LFView({ type: 'vertical', subviews: [
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: 'Process ID', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Bundle', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Identifier', size: 'small', weight: 'bold' })
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: application.processIdentifier, size: 'small' }),
								new LFText({ string: application.bundle.URL, size: 'small' }),
								new LFText({ string: application.identifier, size: 'small' })
							] })
						] }),
						new LFButton({ title: 'Quit', action: function() {
							this.get('Superview', 'LFWindow').close();
							application.quit();
						} })
					] })
				});
			} else {
				window.focus();
			}
		}
	}
}