return class {
	constructor(_) {
		this._ = {
			type: '',
			message: 'Message.',
			information: 'Information.',
			..._
		}
		this._.type = ['info', 'warning', 'error'].includes(this._.type) ? this._.type : 'warning';
		this._.type = this._.type[0].toUpperCase()+this._.type.substring(1);

		return new LFWindow({ width: 512, level: 2, style: ['closable'], view:
			new LFView({ type: 'vertical', yAlign: 'stretch', subviews: [
				new LFView({ subviews: [
					new LFImage({ width: 64, height: 64, shared: this._.type }),
					new LFView({ type: 'vertical', subviews: [
						...this._.message ? [new LFText({ string: this._.message, weight: 'bold' })] : [],
						...this._.information ? [new LFText({ string: this._.information })] : [],
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
}