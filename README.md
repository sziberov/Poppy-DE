**RU** | [EN](README_EN.md)

Poppy DE
--
Свободная кроссплатформенная реализация OS X-подобного пользовательского интерфейса и приложений (попытка).

Архитектура:

	NW.JS								Нативное ПО
		Opium Kernel					HTML + CSS + JS + Node.JS
			CoreFoundation Framework	.framework Пакеты
			CoreGraphics Framework
			Leaf Framework
			...
				Enviro					.app Пакеты
				Dock
				...
