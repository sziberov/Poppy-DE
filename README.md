Poppy DE
--
Free cross-platform OS X-like user interface and applications implementation.

Свободная кроссплатформенная реализация OS X-подобного пользовательского интерфейса и приложений.

Architecture:

	NW.JS / JVM					Native
		Opium Kernel				HTML + CSS + JS + Node.JS / Groovy
			CoreFoundation Framework	.framework Bundles
			CoreGraphics Framework
			Leaf Framework
			...
				Enviro			.app Bundles
				Dock
				...

Kernel and everything will be moved onto JVM + Groovy platform, as JS still lacks several important features.

Планы по переносу ядра и всего остального на платформу JVM + Groovy вступают в силу.
