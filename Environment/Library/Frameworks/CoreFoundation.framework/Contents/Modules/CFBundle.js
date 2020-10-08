return class {
	constructor(URL) {
		this.URL = URL;
		this.contents = this.URL+'/Contents';
		this.executables = this.contents+'/Executables';
		this.resources = this.contents+'/Resources';
		this.properties = {}

		if(this.URL) {
			this.properties = JSON.parse(CFFile.content(this.contents+'/Info.plist'));
		}
	}
}