return class {
	constructor() {
		_import('Leaf');

		LFApp.quitableBySingleWindow = true;

		LFApp.menuItems = [
			new LFMenuItem({ title: CFLocalizedString('File'),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('Switch'), action: () => this.switch() }),
					new LFMenuItem({ title: CFLocalizedString('Quit'), action: () => this.quit() })
				] })
			}),
			new LFMenuItem({ title: CFLocalizedString('Edit') }),
			new LFMenuItem({ title: CFLocalizedString('View'),
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: CFLocalizedString('Update'), action: () => this.update() })
				] })
			}),
			new LFMenuItem({ title: CFLocalizedString('Window') }),
			new LFMenuItem({ title: CFLocalizedString('Help') })
		]

		new LFWindow({ x: 'center', y: 'center', width: 512, height: 256, title: LFApp.title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateQuit' }), action: () => this.quit() }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateInfo' }), action: () => this.information() })
			] }),
			view: new LFView({ tight: true, yAlign: 'stretch', subviews: [
				new LFTable()
			] })
		});

		this.table = LFApp.windows[0].view.subviews[0]
		this.update();
		CFArray.addObserver(LFWorkspace.shared.launchedApplications, () => this.update());
	}

	update() {
		let update = []

		for(let v of LFWorkspace.shared.launchedApplications) {
			update.push(
				new LFTableRow({ title: v.title, data: { application: v }, action: function(v) {
					return () => v.focus()
				}.bind(this)(v) })
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
			let window = LFApp.windows.find(v => v.tag === application.identifier),
				process = _request('info', application.processIdentifier);

			if(!window) {
				new LFWindow({ tag: application.identifier, width: 384, style: ['titled', 'closable', 'minimizable'], title: application.title,
					view: new LFView({ type: 'vertical', subviews: [
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: 'Process', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Terminal', size: 'small', weight: 'bold' }),
								new LFText({ string: 'User', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Bundle', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Identifier', size: 'small', weight: 'bold' })
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: process.path.split('/').pop()+' ('+process.id+')', size: 'small' }),
								new LFText({ string: process.terminalId, size: 'small' }),
								new LFText({ string: process.user, size: 'small' }),
								new LFText({ string: application.bundle.URL, size: 'small' }),
								new LFText({ string: application.identifier, size: 'small' })
							] })
						] }),
						new LFButton({ title: CFLocalizedString('Quit'), action: function() {
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