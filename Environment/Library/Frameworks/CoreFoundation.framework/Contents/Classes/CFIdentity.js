_import('CoreFoundation', 'CFProcessInfo');
_import('CoreFoundation', 'CFPreferences');

// noinspection JSAnnotator
return class CFIdentity {
	static __shared;

	static get shared() {
		return new Promise(async () => {
			if(!this.__shared) {
				await this.new();
			}

			return this.__shared;
		});
	}

	static async new() {
		let self = this.__shared ?? new this();

		if(!this.__shared) {
			this.__shared = self;
		} else {
			console.error(0); return;
		}

		self.__user = (await CFPreferences.new('Global')).get().Users.find(v => v.Login === CFProcessInfo.shared.user);

		return self;
	}

	get ID() {
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