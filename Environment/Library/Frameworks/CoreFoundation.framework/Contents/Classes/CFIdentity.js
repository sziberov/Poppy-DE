// noinspection JSAnnotator
return class {
	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.__user = new CFPreferences('Global').get().Users.find(v => v.Login == CFProcessInfo.shared.user);
	}

	get id() {
		return this.__user.ID;
	}

	get login() {
		return this.__user.Login;
	}

	get password() {
		return this.__user.Password;
	}

	get group() {
		return this.__user.Group;
	}

	get hidden() {
		return this.__user.Hidden;
	}

	get title() {
		return this.__user.Title;
	}

	get image() {
		return this.__user.Image;
	}
}