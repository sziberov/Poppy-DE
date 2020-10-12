/*
	CoreGraphics Framework v0.1:
		Contains appearance|elements|font management tools.
*/

_import('CoreFoundation');

if(new CFProcessInfo().identifier == _request('info', 'Login.js')[0].id) {
	if(!_request('seList')[0]) {
		_request('seCreate', 'read');
	}
}

new CFProcessInfo().environment._MainSE = _request('seGet', _request('seList', _request('info', 'Login.js')[0].id));

_import('@Title', 'CGAppearance');
_import('@Title', 'CGElement');
_import('@Title', 'CGCursor');
_import('@Title', 'CGFontManager');

new CFProcessInfo().environment._CGAppearance = new CGAppearance('@Resources/Appearance.css').add();

_MainSE.CGAppearance = CGAppearance;
_MainSE.CGCursor = CGCursor;
_MainSE.CGFontManager = CGFontManager;