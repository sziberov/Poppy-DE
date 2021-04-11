return _single(class {
	constructor() {
		this.__user = new CFPreferences('Global').get().Users.find(v => v.Login == new CFProcessInfo().user);
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
});