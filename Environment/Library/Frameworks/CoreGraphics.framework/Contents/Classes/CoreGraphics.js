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

new CFProcessInfo().environment.$CGAppearance = new CGAppearance('@Resources/Appearance.css').add();

$CFShared.CGLayer = new CGLayer(_request('screen').width, _request('screen').height);
$CFShared.CGAppearance = CGAppearance;
$CFShared.CGCursor = CGCursor;
$CFShared.CGFontManager = CGFontManager;