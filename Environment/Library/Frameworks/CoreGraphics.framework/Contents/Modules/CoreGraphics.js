/*
	CoreGraphics Framework v0.1:
		Contains appearance|elements|font management tools.
*/

_import('CoreFoundation');

_import('@Title', 'CGLayer');
_import('@Title', 'CGAppearance');
_import('@Title', 'CGElement');
_import('@Title', 'CGCursor');
_import('@Title', 'CGFontManager');

new CFProcessInfo().environment._CGAppearance = new CGAppearance('@Resources/Appearance.css').add();

_CFShared.CGLayer = new CGLayer(_request('screen').width, _request('screen').height);
_CFShared.CGAppearance = CGAppearance;
_CFShared.CGCursor = CGCursor;
_CFShared.CGFontManager = CGFontManager;