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
					new LFMenuItem({ title: await CFLocalizedString('Switch'), action: () => this.switch() }),
					new LFMenuItem({ title: await CFLocalizedString('Quit'), action: () => this.quit() })
				] })
			}),
			new LFMenuItem({ title: await CFLocalizedString('Edit') }),
			new LFMenuItem({ title: await CFLocalizedString('View'), menu:
				new LFMenu({ items: [
					new LFMenuItem({ title: await CFLocalizedString('Update'), action: () => this.update() })
				] })
			}),
			new LFMenuItem({ title: await CFLocalizedString('Window') }),
			new LFMenuItem({ title: await CFLocalizedString('Help') })
		]
		LFApp.quitableBySingleWindow = true;

		new LFWindow({ width: 512, height: 256, title: LFApp.title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: '', image: await LFImage.new({ shared: 'TemplateQuit' }), action: () => this.quit() }),
				new LFButton({ title: '', image: await LFImage.new({ shared: 'TemplateInfo' }), action: () => this.information() })
			] }),
			view: new LFView({ tight: true, yAlign: 'stretch', subviews: [
				new LFTable()
			] })
		}).center();

		this.table = LFApp.windows[0].view.subviews[0]
		this.update();
		CFArrayOld.addObserver(LFWorkspace.shared.launchedApplications, () => this.update());
	}

	update() {
		let update = []

		for(let v of LFWorkspace.shared.launchedApplications) {
			update.push(new LFTableRow({ title: v.title, data: { application: v }, action: () => v.focus() }));
		}
		this.table.subviews = update;
	}

	quit() {
		this.table.activeRow?.data.application.quit();
	}

	switch() {
		this.table.activeRow?.data.application.focus();
	}

	async information() {
		let application = this.table.activeRow?.data.application;

		if(application) {
			let window = LFApp.windows.find(v => v.tag === application.processIdentifier),
				process = _call('info', application.processIdentifier);

			if(!window) {
				new LFWindow({ tag: process.ID, width: 384, type: ['titled', 'closable', 'minimizable'], title: application.title, view:
					new LFView({ type: 'vertical', subviews: [
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: 'Process', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Terminal', size: 'small', weight: 'bold' }),
								new LFText({ string: 'User', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Bundle', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Identifier', size: 'small', weight: 'bold' })
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: process.path.split('/').pop()+' ('+process.ID+')', size: 'small' }),
								new LFText({ string: process.terminalID, size: 'small' }),
								new LFText({ string: process.user, size: 'small' }),
								new LFText({ string: application.bundle.URL, size: 'small' }),
								new LFText({ string: application.identifier, size: 'small' })
							] })
						] }),
						new LFButton({ title: await CFLocalizedString('Quit'), action: function() {
							this.get('Superview', LFWindow).close();
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