return class {
	constructor(_url) {
		this.url = _url;
		this.contents = this.url+'/Contents';
		this.executables = this.contents+'/Executables';
		this.resources = this.contents+'/Resources';
		this.properties = {}

		if(this.url) this.properties = JSON.parse(CFFile.content(this.url+'/Contents/Info.plist'));
	}
}