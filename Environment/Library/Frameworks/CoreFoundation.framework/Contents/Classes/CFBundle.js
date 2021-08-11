_import('CoreFoundation', 'CFProcessInfo');
_import('CoreFoundation', 'CFFile');
_import('CoreFoundation', 'CFDirectory');
_import('CoreFoundation', 'CFPreferences');

// noinspection JSAnnotator
return class CFBundle {
	static main;

	static async new(URL) {
		let self = new this();

		await self.setURL(URL);

		return self;
	}

	__URL;

	properties = {}
	localizations = {}

	get URL() {
		return this.__URL;
	}

	get contentsURL() {
		return this.URL+'/Contents';
	}

	get executablesURL() {
		return this.contentsURL+'/Executables';
	}

	get resourcesURL() {
		return this.contentsURL+'/Resources';
	}

	async setURL(value) {
		if(typeof value !== 'string') {
			throw new TypeError(0);
		}

		value = value.match(/(.*(?:\.bundle|\.framework|\.app))(?=\/Contents)?/gi)?.[0]

		if(!value) {
			throw new RangeError(1);
		}

		this.__URL = value;

		for(let directory of await CFDirectory.content(this.resourcesURL, 'Directories')) {
			let directoryExtension = '.lproj';

			if(directory.endsWith(directoryExtension)) {
				let directoryTitle = directory.split(directoryExtension)[0]

				this.localizations[directoryTitle] = {}

				for(let file of await CFDirectory.content(this.resourcesURL+'/'+directory, 'Files')) {
					let fileExtension = '.strings';

					if(file.endsWith(fileExtension)) {
						let fileTitle = file.split(fileExtension)[0],
							fileContent = JSON.parse(await CFFile.content(this.resourcesURL+'/'+directory+'/'+file));

						this.localizations[directoryTitle][fileTitle] = fileContent;
					}
				}

				if(this.localizations[directoryTitle].length === 0) {
					delete this.localizations[directoryTitle]
				}
			}
		}

		let properties = await CFFile.content(this.contentsURL+'/Info.plist'),
			language = (await CFPreferences.new('Global')).get().PreferredLanguages[0],
			localizedStrings = this.localizations[language]?.InfoPlist

		if(properties) {
			this.properties = {
				...JSON.parse(properties),
				...localizedStrings ? localizedStrings : {}
			}
		}
	}
}