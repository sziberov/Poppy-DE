// noinspection JSAnnotator
return class CFBundle {
	static __main = new this(CFProcessInfo.shared.path);
//	static __current = new this(_path);

	static get main() {
		return this.__main;
	}

//	static get current() {
//		return this.__current;
//	}

	__URL;

	properties = {}
	localizations = {}

	constructor(URL) {
		this.URL = URL;
	}

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

	set URL(value) {
		if(typeof value !== 'string') {
			throw new TypeError();
		}

		value = value.match(/(.*(?:\.bundle|\.framework|\.app))(?=\/Contents)?/gi)?.[0]

		if(!value) {
			throw new RangeError();
		}

		this.__URL = value;

		for(let directory of CFDirectory.content(this.resourcesURL, 'Directories')) {
			let directoryExtension = '.lproj';

			if(directory.endsWith(directoryExtension)) {
				let directoryTitle = directory.split(directoryExtension)[0]

				this.localizations[directoryTitle] = {}

				for(let file of CFDirectory.content(this.resourcesURL+'/'+directory, 'Files')) {
					let fileExtension = '.strings';

					if(file.endsWith(fileExtension)) {
						let fileTitle = file.split(fileExtension)[0],
							fileContent = JSON.parse(CFFile.content(this.resourcesURL+'/'+directory+'/'+file));

						this.localizations[directoryTitle][fileTitle] = fileContent;
					}
				}

				if(this.localizations[directoryTitle].length === 0) {
					delete this.localizations[directoryTitle]
				}
			}
		}

		let properties = CFFile.content(this.contentsURL+'/Info.plist'),
			language = new CFPreferences('Global').get().PreferredLanguages[0],
			localizedStrings = this.localizations[language]?.InfoPlist

		if(properties) {
			this.properties = {
				...JSON.parse(properties),
				...localizedStrings ? localizedStrings : {}
			}
		}
	}
}