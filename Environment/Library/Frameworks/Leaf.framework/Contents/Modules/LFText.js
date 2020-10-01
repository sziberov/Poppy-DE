return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			string: 'Text',
			size: 'medium',
			weight: 'normal',
			..._
		}

		this.attributes = {
			[this._.size]: ['small', 'big'].includes(this._.size) ? '' : undefined,
			'bold': this._.weight == 'bold' ? '' : undefined
		}
		this.text = this._.string;
	}
}