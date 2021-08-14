_import('CoreFoundation', 'CFProcessInfo');
_import('CoreFoundation', 'CFFile');
_import('CoreFoundation', 'CFDirectory');
_import('CoreFoundation', 'CFPreferences');

// noinspection JSAnnotator
return class CFBundle {
	static main;

	static async new(URL) {
		let self = new this();

		if(typeof URL !== 'string') {
			throw new TypeError(0);
		}

		URL = URL.match(/(.*(?:\.bundle|\.framework|\.app))(?=\/Contents)?/gi)?.[0]

		if(!URL) {
			throw new RangeError(1);
		}

		self.__URL = URL;

		for(let directory of await CFDirectory.content(self.resourcesURL, 'Directories')) {
			let directoryExtension = '.lproj';

			if(directory.endsWith(directoryExtension)) {
				let directoryTitle = directory.split(directoryExtension)[0]

				self.localizations[directoryTitle] = {}

				for(let file of await CFDirectory.content(self.resourcesURL+'/'+directory, 'Files')) {
					let fileExtension = '.strings';

					if(file.endsWith(fileExtension)) {
						let fileTitle = file.split(fileExtension)[0],
							fileContent = JSON.parse(await CFFile.content(self.resourcesURL+'/'+directory+'/'+file));

						self.localizations[directoryTitle][fileTitle] = fileContent;
					}
				}

				if(self.localizations[directoryTitle].length === 0) {
					delete self.localizations[directoryTitle]
				}
			}
		}

		let properties = await CFFile.content(self.contentsURL+'/Info.plist'),
			language = (await CFPreferences.new('Global')).get().PreferredLanguages[0],
			localizedStrings = self.localizations[language]?.InfoPlist

		if(properties) {
			self.properties = {
				...JSON.parse(properties),
				...localizedStrings ? localizedStrings : {}
			}
		}

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
}