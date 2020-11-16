Poppy DE
--
Free cross-platform OS X-like user interface and applications implementation.

Свободная кроссплатформенная реализация OS X-подобного пользовательского интерфейса и приложений.

Architecture:

	NW.JS						Native
		Opium Kernel				HTML + CSS + JS + Node.JS
			CoreFoundation Framework	.framework Bundles
			CoreGraphics Framework
			Leaf Framework
			...
				Enviro			.app Bundles
				Dock
				...

Kernel and everything will be moved onto JVM + Groovy platform, as JS still lacks several important features.

Ядро и всё остальное будет перенесено на платформу JVM + Groovy, так как в JS до сих пор не хватает некоторого важного функционала.
