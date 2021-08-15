// noinspection JSAnnotator
return class LFAlert {
	__type;
	__message;
	__information;

	static async new({ type = 'warning', message = 'Message.', information = 'Information.' } = {}) {
		let self = new this();

		self.type = type;
		self.message = message;
		self.information = information;

		return new LFWindow({ width: 512, level: 'floating', type: ['closable'], view:
			new LFView({ type: 'vertical', yAlign: 'stretch', subviews: [
				new LFView({ subviews: [
					await LFImage.new({ width: 64, height: 64, shared: self.type[0].toUpperCase()+self.type.substring(1) }),
					new LFView({ type: 'vertical', subviews: [
						...self.message ? [new LFText({ string: self.message, weight: 'bold' })] : [],
						...self.information ? [new LFText({ string: self.information })] : [],
					] })
				] }),
				new LFView({ xAlign: 'end', subviews: [
					new LFButton({ minWidth: 64, title: 'OK', action: function() {
						this.get('Superview', LFWindow).close();
					} })
				] })
			] })
		}).center(LFWindow.center.x);
	}

	get type() {
		return this.__type;
	}

	get message() {
		return this.__message;
	}

	get information() {
		return this.__information;
	}

	set type(value) {
		if(typeof value !== 'string')						throw new TypeError();
		if(!['info', 'warning', 'error'].includes(value))	throw new RangeError();

		this.__type = value;
	}

	set message(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__message = value;
	}

	set information(value) {
		if(value && typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError();
		}

		this.__information = value;
	}
}