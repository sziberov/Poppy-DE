return class {
	constructor(URL) {
		this.URL = URL;
		this.contents = this.URL+'/Contents';
		this.executables = this.contents+'/Executables';
		this.resources = this.contents+'/Resources';
		this.properties = {}
		this.localizations = {}

		if(this.URL) {
			for(let directory of CFDirectory.content(this.resources, 'Directories')) {
				let directoryExtension = '.lproj';

				if(directory.endsWith(directoryExtension)) {
					let directoryTitle = directory.split(directoryExtension)[0]

					this.localizations[directoryTitle] = {}

					for(let file of CFDirectory.content(this.resources+'/'+directory, 'Files')) {
						let fileExtension = '.strings';

						if(file.endsWith(fileExtension)) {
							let fileTitle = file.split(fileExtension)[0],
								fileContent = JSON.parse(CFFile.content(this.resources+'/'+directory+'/'+file));

							this.localizations[directoryTitle][fileTitle] = fileContent;
						}
					}

					if(this.localizations[directoryTitle].length == 0) {
						delete this.localizations[directoryTitle]
					}
				}
			}

			let language = new CFPreferences('Global').get().PreferredLanguages[0],
				localizedStrings = this.localizations[language]?.InfoPlist

			this.properties = {
				...JSON.parse(CFFile.content(this.contents+'/Info.plist')),
				...localizedStrings ? localizedStrings : {}
			}
		}
	}
}