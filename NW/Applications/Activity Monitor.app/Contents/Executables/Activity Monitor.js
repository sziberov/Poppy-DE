return class {
	constructor() {
		_LFApp.menus.push(
			new LFButton({ title: 'Update', action: () => this.update() }),
			new LFButton({ title: 'Switch', action: () => this.switch() }),
			new LFButton({ title: 'Help', action: () => _LFApp.about({ width: 64, height: 64 }) })
		)
		_LFApp.windows.push(
			new LFWindow({ width: 512, height: 256, title: _LFApp.title,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: undefined, image: new LFImage({ shared: 'TemplateQuit' }), action: () => this.quit() }),
					new LFButton({ title: undefined, image: new LFImage({ shared: 'TemplateInfo' }), action: () => this.information() })
				] }),
				view: new LFView({ tight: true, yAlign: 'stretch', subviews: [
					new LFTable()
				] })
			})
		)

		this.table = _LFApp.windows[0].view.subviews[0];
		this.update();
		_CFEventEmitter.handle('LFApplication.Updated', () => this.update());
	}

	update() {
		var _update = []

		for(var v of _LFApplication.launched) {
			_update.push(
				new LFTableRow({ title: v.title, data: { application: v }, action: function(v) {
					return () => v.focus()
				}(v) })
			);
		}
		this.table.setSubviews(_update);
	}

	quit() {
		this.table.activeRow.data.application.quit();
	}

	switch() {
		this.table.activeRow.data.application.focus();
	}

	information() {
		var _application = this.table.activeRow.data.application,
			_information =
				new LFWindow({ tag: _application.identifier, width: 384, title: _application.title,
					view: new LFView({ type: 'vertical', subviews: [
						new LFView({ subviews: [
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: 'Bundle', size: 'small', weight: 'bold' }),
								new LFText({ string: 'Identifier', size: 'small', weight: 'bold' })
							] }),
							new LFView({ type: 'vertical', tight: true, subviews: [
								new LFText({ string: _application.bundle.url, size: 'small' }),
								new LFText({ string: _application.identifier, size: 'small' })
							] })
						] }),
						new LFButton({ title: 'Quit', action: function() {
							_application.quit();
							this.get('Superview', 'LFWindow').close();
						} })
					] })
				}),
			_window = _LFApp.windows.filter(v => v.tag == _application.identifier)[0];

		if(!_window) _LFApp.windows.push(_information); else _window.focus();
	}
}