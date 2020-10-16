return class {
	#URL;

	constructor(URL) {
		this.#URL = URL || CFString.splitByLast(new CFProcessInfo().path, '/Contents/')[0]
		this.properties = {}
		this.localizations = {}

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

				if(this.localizations[directoryTitle].length == 0) {
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

	get URL() {
		return this.#URL;
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
}