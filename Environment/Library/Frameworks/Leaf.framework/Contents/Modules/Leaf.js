/*
	Leaf Framework v0.1:
		Contains graphical applications building tools.
*/

_import('CoreFoundation');
_import('CoreGraphics');

_import('@Title', 'LFObject');
_import('@Title', 'LFResponder');
_import('@Title', 'LFView');
_import('@Title', 'LFControl');
_import('@Title', 'LFButton');
_import('@Title', 'LFMenubar');
_import('@Title', 'LFMenu');
_import('@Title', 'LFMenuItem');
_import('@Title', 'LFWorkspace');
_import('@Title', 'LFLaunchedApplication');
_import('@Title', 'LFApplication');
_import('@Title', 'LFWindow');
_import('@Title', 'LFFrame');
_import('@Title', 'LFTitlebar');
_import('@Title', 'LFTitlebarButton');
_import('@Title', 'LFToolbar');
_import('@Title', 'LFSidebar');
_import('@Title', 'LFImage');
_import('@Title', 'LFText');
_import('@Title', 'LFTable');
_import('@Title', 'LFTableRow');
_import('@Title', 'LFAlert');

new LFApplication();
new CFProcessInfo().environment._LFAppearance = new CGAppearance('@Resources/Appearance.less').add();

_CFShared.LFMenubar = LFMenubar;
_CFShared.LFWorkspace = LFWorkspace;