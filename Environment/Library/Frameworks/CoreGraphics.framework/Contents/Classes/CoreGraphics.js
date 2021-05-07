/*
	CoreGraphics Framework v0.1:
		Contains appearance|elements|font management tools.
*/

_import('CoreFoundation');

_import('@Title', 'CGScreen');
_import('@Title', 'CGColor');
_import('@Title', 'CGLayer');
_import('@Title', 'CGImage');
_import('@Title', 'CGAppearance');
_import('@Title', 'CGElement');
_import('@Title', 'CGCursor');
_import('@Title', 'CGFontManager');

CFProcessInfo.shared.environment.$CGAppearance = new CGAppearance('@Resources/Appearance.css').add();

$CFShared.CGAppearance = CGAppearance;
$CFShared.CGCursor = CGCursor;
$CFShared.CGFontManager = CGFontManager;