Poppy DE
--
Свободная кроссплатформенная реализация OS X-подобного пользовательского интерфейса и приложений (попытка).

Free cross-platform OS X-like user interface and applications implementation (attempt of).

Архитектура (Architecture):

	NW.JS + ImageMagick				Native
		Opium Kernel				HTML + CSS + JS + Node.JS
			CoreFoundation Framework	.framework Bundles
			CoreGraphics Framework
			Leaf Framework
			...
				Enviro			.app Bundles
				Dock
				...

Приоритетная задача (Primary task): Переход с DOM-интерфейса на Canvas (Replacing DOM-interface with Canvas).
