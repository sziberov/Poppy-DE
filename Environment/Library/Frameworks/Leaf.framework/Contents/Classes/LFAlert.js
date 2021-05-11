// noinspection JSAnnotator
return class {
	__type;
	__message;
	__information;

	constructor({ type = 'warning', message = 'Message.', information = 'Information.' } = {}) {
		this.type = type;
		this.message = message;
		this.information = information;

		return new LFWindow({ x: 'center', width: 512, level: 2, style: ['closable'], view:
			new LFView({ type: 'vertical', yAlign: 'stretch', subviews: [
				new LFView({ subviews: [
					new LFImage({ width: 64, height: 64, shared: this.type[0].toUpperCase()+this.type.substring(1) }),
					new LFView({ type: 'vertical', subviews: [
						...this.message ? [new LFText({ string: this.message, weight: 'bold' })] : [],
						...this.information ? [new LFText({ string: this.information })] : [],
					] })
				] }),
				new LFView({ xAlign: 'end', subviews: [
					new LFButton({ minWidth: 64, title: 'OK', action: function() {
						this.get('Superview', 'LFWindow').close();
					} })
				] })
			] })
		});
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