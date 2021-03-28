/*
	Opium Kernel v0.1:
		Contains base functions|appearance and DE launch procedure.
*/

import groovy.json.JsonSlurper
import java.awt.Color
import java.awt.Dimension
import java.awt.Graphics
import java.awt.Graphics2D
import java.awt.RenderingHints
import java.awt.event.KeyEvent
import java.awt.event.KeyListener
import java.awt.image.BufferedImage
import java.awt.image.ImageObserver
import java.lang.reflect.InvocationTargetException
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Paths
import javax.imageio.*
import javax.swing.JFrame
import javax.swing.JPanel
import org.codehaus.groovy.control.CompilationUnit
import org.codehaus.groovy.control.CompilePhase
import org.codehaus.groovy.control.CompilationFailedException
import org.apache.commons.lang3.exception.ExceptionUtils

class Main {
	def version = [
		kernel: [
			"Opium Kernel",
			"Version 0.1"
		],
		DE: [
			"Poppy DE",
			0.1
		]
	]

	def starttime = System.currentTimeMillis()

	def getUptime() {
		return System.currentTimeMillis() - starttime
	}

	def getScreen() {
		def size = frameGraphics?.size

		return [
			width: (size?.width ?: 800) as int,
			height: (size?.height ?: 600) as int
		]
	}

	def frame = new JFrame(version["DE"][0] as String),
		frameKeyboard = new frameKeyboard(),
		frameGraphics = new frameGraphics()

	def framebuffer = new BufferedImage(screen.width, screen.height, BufferedImage.TYPE_4BYTE_ABGR_PRE),
		colors = [
			black:		new Color(0, 0, 0),
			darkGray:	new Color(0.25, 0.25, 0.25),
			gray:		new Color(0.5, 0.5, 0.5),
			lightGray:	new Color(0.75, 0.75, 0.75),
			white:		new Color(1 as float, 1, 1),
			yellow:		new Color(1 as float, 1, 0),
			orange:		new Color(1 as float, 0.5, 0),
			red:		new Color(1 as float, 0, 0),
			magenta:	new Color(1 as float, 0, 1),
			purple:		new Color(0.5, 0, 0.5),
			blue:		new Color(0, 0, 1 as float),
			cyan:		new Color(0, 0.5, 1 as float),
			green:		new Color(0, 0.75, 0),
			darkGreen:	new Color(0, 0.25, 0),
			brown:		new Color(0.5, 0.25, 0),
			tan:		new Color(0.75, 0.5, 0.25)
		],
		handlers = [],
		eventsReserved = ["fbChanged", "terminalChanged", "processListChanged", "dateChanged"],
		terminals = [],
		processes = []

	Main() {
		frame.focusable = true
		frame.addKeyListener(frameKeyboard)
		frame.contentPane.add(frameGraphics)
		frame.minimumSize = new Dimension(640, 480)
		frame.size = [screen.width, screen.height]
	//	frame.resizable = false
	//	frame.undecorated = true
	//	frame.extendedState = JFrame.MAXIMIZED_BOTH
		frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
		frame.visible = true

	//	namedArguments(a: "1", c: "3")
		eventCatch(null, "fbChanged", {
			fbRedraw()
		})

		def bootScreen = timerCreate(null, "multiple", 63, { ->
			fbDraw()
		})

		processExec(null, null, "root", "root","/Environment/Library/Applications/Login.app/Contents/Executables/Login.groovy")

		timerRemove(null, bootScreen)
	}

	class frameKeyboard implements KeyListener {
		void keyPressed(KeyEvent e) {}
		void keyTyped(KeyEvent e) {}
		void keyReleased(KeyEvent e) {
			if (e.getKeyText(e.keyCode) == "F11") {
				frame.dispose()

				if (frame.undecorated) {
					frame.resizable = true
					frame.undecorated = false
					frame.extendedState = JFrame.NORMAL
				} else {
					frame.resizable = false
					frame.undecorated = true
					frame.extendedState = JFrame.MAXIMIZED_BOTH
				}

				frame.visible = true
			}
		}
	}

	class frameGraphics extends JPanel {
		void paint(Graphics graphics) {
			graphics.drawImage(framebuffer, 0, 0, this)
		}
	}

	void kdbAdd(String... string) {
		string.each { v ->
			println(v.stripIndent().trim())
		}
	}

	def fsRead(String path, String format = null) {
		def _path = path.startsWith("/") ? "../../../.." + path : this.class.getResource(path).toURI(),
			file = new File(_path)

		if (!file.canRead()) {
			kdbAdd("fsRead: Unable to read file with path: $path")

			return null
		}

		if (format == "text") {
			return Files.readString(Paths.get(_path), StandardCharsets.UTF_8)
		} else {
			return file
		}
	}

	def fsReadPreferences(String identifier) {
		def file = fsRead("/Library/Preferences/" + identifier + ".plist", "text") ?:
				   fsRead("/Environment/Library/Preferences/" + identifier + ".plist", "text")

		return file ? new JsonSlurper().parseText(file) : null
	}

	def loadIteration = 0

	void fbDraw() {
		if (framebuffer.width != screen.width || framebuffer.height != screen.height) {
			framebuffer = new BufferedImage(screen.width, screen.height, BufferedImage.TYPE_4BYTE_ABGR_PRE)

			drDraw(framebuffer, "rectangle", colors.black, 0, 0, screen.width, screen.height)
		}

		def logo = drOpen(fsRead("Logo.png")),
			load = drOpen(fsRead("Load.png"))

		loadIteration = loadIteration > 10 ? 0 : loadIteration + 1;

		drDraw(framebuffer, "rectangle", colors.lightGray, 0, 0, screen.width, screen.height)
		drDraw(framebuffer, "image", logo, null, null, null, null, true, null, null, frameGraphics)
		drDraw(framebuffer, "image", load, null, screen.height / 2 + logo.height / 2, null, screen.height / 2 - logo.height / 2, true, null, 30 * loadIteration, frameGraphics)

	//	drDraw(framebuffer, "image", drOpen(fsRead("/Library/Desktop Images/drawing.png")), null, null, null, null, null, "fill", null, frameGraphics)
	//	drDraw(framebuffer, "rectangle", new Color(0, 0, 0, 0.25), 0, 0, screen.width, screen.height)
	//	drDraw(framebuffer, "image", drOpen(fsRead("Panic.png")), null, null, null, null, true, null, null, frameGraphics)

		eventThrow(null, "fbChanged")
	}

	void fbRedraw() {
		frame.contentPane.repaint()
	}

	BufferedImage drCreate(Number width, Number height) {
		return new BufferedImage(width as int, height as int, BufferedImage.TYPE_4BYTE_ABGR_PRE)
	}

	BufferedImage drOpen(File file) {
		def image = ImageIO.read(file),
			bufferedImage = drCreate(image.width, image.height)

		bufferedImage.graphics.drawImage(image, 0, 0, null)

		return bufferedImage
	}

	def drDraw(BufferedImage bufferedImage, String type, ... arguments) {
		def graphics = bufferedImage.graphics as Graphics2D

		graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
		graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC)
		graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)

		//noinspection GroovyAssignabilityCheck
		return [
			rectangle: { Color color, Number x, Number y, Number width, Number height ->
				x ?= 0
				y ?= 0

				graphics.color = color
				graphics.fillRect(x as int, y as int, width as int, height as int)
			},
			image: { BufferedImage _bufferedImage, Number x, Number y, Number width, Number height, Boolean centered, String resizeMode, Double angle, ImageObserver observer ->
				x ?= 0
				y ?= 0
				width ?= bufferedImage.width
				height ?= bufferedImage.height
				centered ?= false
				angle = angle ? Math.toRadians(angle) : 0

				def imageWidth = _bufferedImage.width,
					imageHeight = _bufferedImage.height,
					resizeWidth = imageWidth,
					resizeHeight = imageHeight

				if (resizeMode) {
					def ratio = width / height,
						imageRatio = imageWidth / imageHeight

					switch (resizeMode) {
						case "stretch":
							resizeWidth = width
							resizeHeight = height
						break
						case "fit":
							centered = true

							if (imageWidth > width || imageHeight > height) {
								if (ratio > imageRatio) {
									resizeWidth = imageWidth * height / imageHeight
									resizeHeight = height
								} else {
									resizeWidth = width
									resizeHeight = imageHeight * width / imageWidth
								}
							}
						break
						case "fill":
							centered = true

							if (imageWidth > imageHeight) {
								resizeWidth = height * imageRatio
								resizeHeight = height

								if (resizeWidth < width) {
									resizeWidth = width
									resizeHeight = width / imageRatio
								}
							} else {
								resizeWidth = width
								resizeHeight = width / imageRatio

								if (resizeHeight < height) {
									resizeWidth = height * imageRatio
									resizeHeight = height
								}
							}
						break
					}
				}

				if (angle == 0) {
					if (centered) {
						x = x + (width - resizeWidth) / 2
						y = y + (height - resizeHeight) / 2
					}

					graphics.drawImage(_bufferedImage, x as int, y as int, resizeWidth as int, resizeHeight as int, observer)
				} else {
					if (centered) {
						x = x + width / 2
						y = y + height / 2
					}

					graphics.translate(x as int, y as int)
					graphics.rotate(angle)
					graphics.drawImage(_bufferedImage, -resizeWidth / 2 as int, -resizeHeight / 2 as int, resizeWidth as int, resizeHeight as int, observer)
					graphics.rotate(-angle)
					graphics.translate(-x as int, -y as int)
				}
			}
		][type](*arguments)
	}

	def drClose(BufferedImage bufferedImage) {
		def file = new ByteArrayOutputStream()

		ImageIO.write(bufferedImage, "PNG", file)

		return file
	}

	Boolean eventThrow(Map process, String event, ... arguments) {
		if (process && eventsReserved.contains(event)) {
			kdbAdd("""
				eventThrow@$process.id: Processes aren't allowed to throw reserved events:
					Event: "$event"
				""")

			return false
		}

		handlers.findAll { it.event == event && it.type == "event" }.each { handler ->
			try {
				handler.function(*arguments)
			} catch (Exception exception) {
			//	error.fileName = handler.process.path

				kdbAdd("""
					eventThrow@$process.id: Handler failed to execute:
						Event: "$event"
					""", ExceptionUtils.getStackTrace(exception))
			}
		}

		return true
	}

	Integer eventCatch(Map process, String event, Closure function) {
		def id = handlers.size() > 0 ? handlers.collect { it.id }.max() + 1 : 1

		handlers.push([
			id: id,
			type: 'event',
			process: process ?: null,
			event: event,
			function: function
		])
		kdbAdd("""
			eventCatch${ process ? "@" + process.id : "" }: Successfully set handler:
				ID: $id
				Event: "$event"
			""")

		return id
	}

	Boolean eventCatchRemove(Map process, Integer handlerId) {
		def handler = handlers.findAll { it.id == handlerId && it.type == "event" }[0]

		if (!handler) {
			kdbAdd("eventCatchRemove${ process ? "@" + process.id : "" }: Unable to find handler")

			return false
		}
		if (process && handler.process != process) {
			kdbAdd("eventCatchRemove@$process.id: Processes aren't allowed to remove not owned handlers")

			return false
		}

		handlers.remove(handler)
		kdbAdd("""
			eventCatchRemove${ process ? "@" + process.id : "" }: Successfully removed handler:
				ID: $handler.id
				Event: "$handler.event"
			""")

		return true
	}

	Integer timerCreate(Map process, String variant, Integer delay, Closure function, ... arguments) {
		if (!["single", "multiple"].contains(variant)) {
			kdbAdd("timerCreate${ process ? "@" + process.id : "" }: Variant incorrect")

			return null
		}

		def id = handlers.size() > 0 ? handlers.collect { it.id }.max() + 1 : 1,
			timer = new Timer()

		if (variant == "single") {
			timer.schedule(new TimerTask() {
				void run() {
					function(*arguments)
					timerRemove(process, id)
				}
			}, delay)
		} else {
			timer.schedule(new TimerTask() {
				void run() {
					function(*arguments)
				}
			}, 0, delay)
		}
		handlers.push([
			id: id,
			process: process ?: null,
			type: "timer",
			variant: variant,
			timer: timer
		])
		kdbAdd("""
			timerCreate${ process ? "@" + process.id : "" }: Successfully set handler:
				ID: $id
				Variant: $variant
			""")

		return id
	}

	Boolean timerRemove(Map process, Integer handlerId) {
		def handler = handlers.findAll { it.id == handlerId && it.type == "timer" }[0]

		if (!handler) {
			kdbAdd("timerRemove${ process ? "@" + process.id : "" }: Unable to find handler")

			return false
		}
		if (process && handler.process != process) {
			kdbAdd("timerRemove@$process.id: Processes aren't allowed to remove not owned handlers")

			return false
		}

		handler.timer.cancel()
		handlers.remove(handler)
		kdbAdd("""
			timerRemove${ process ? "@" + process.id : "" }: Successfully removed handler:
				ID: $handler.id
				Variant: $handler.variant
			""")

		return true
	}

	def processRequest(processEnvironment environment, String method, ... arguments) {
		switch (method) {
			case "info":	return processInfo(environment, *arguments)
		}
	}

	/**
	 * Окружение процесса - расширенный загрузчик классов, позволяющий динамическую сборку и подключение классов из .framework'ов.
	 */
	class processEnvironment extends GroovyClassLoader {
		processEnvironment(ClassLoader classLoader = null) {
			super(classLoader)

		//	shouldRecompile = true
		}

		Class compileClass(String path, Boolean main) {
			def parts = path.split(/\./) as List,
				framework = parts[0],
				clazz = main ? "Main" : parts[1] ?: framework,
				clazzPath = main ? path : "/Environment/Library/Frameworks/${ framework }.framework/Classes/${ clazz }.groovy",
				file = !main && parts.size() > 2 ? null : fsRead(clazzPath, "text")

			if (!file) {
				throw new ClassNotFoundException()
			}

			def compiler = new CompilationUnit()

			compiler.classLoader = this
			compiler.addSource(clazz, file)

			try {
				compiler.compile(CompilePhase.CLASS_GENERATION.phaseNumber)
			} catch (CompilationFailedException compilationFailedException) {
				throw compilationFailedException
			}

			compiler.classes.each { v ->
				if (v.name == clazz) {
					defineClass(v.name, v.bytes)
				}
			}

			def loadedClass = loadClass(clazz)

			loadedClass.metaClass._request = { String method, ... arguments -> return processRequest(this, method, *arguments) }
			loadedClass.metaClass._info = { ... arguments -> return processRequest(this, "info", *arguments) }

			if (getClassCacheEntry(clazz) == null) {
				setClassCacheEntry(loadedClass)
			}

			kdbAdd("processEnvironment: Compiled " + (main ? "main class" : ".framework class: $clazz"))

			return loadedClass
		}

		Class findClass(String name) {
			try {
				return super.findClass(name)
			} catch (ClassNotFoundException classNotFoundException) {
				try {
					return compileClass(name, false)
				} catch (ClassNotFoundException ignored) {
					throw classNotFoundException
				} catch (CompilationFailedException compilationFailedException) {
					throw compilationFailedException
				}
			}
		}
	}

	def processInfo(processEnvironment environment) {
		return environment.loadedClasses
	}

	def processExec(Integer terminalId = null, Integer processId = null, String login = null, String password = null, String path, String... arguments) {
		def user = fsReadPreferences('Global').Users.findAll { it.Login == login && it.Password == password }[0]

		if (!user) {
			kdbAdd("processExec${ processId ? "@" + processId : "" }: Authorization incorrect")

			return false
		}

		def process = [
			id: processes.size() > 0 ? processes.collect { it.id }.max() + 1 : 1,
			parentId: processId ?: 0,
			terminalId: terminalId ?: 1,
			user: user.Login,
			path: path,
			arguments: arguments,
			environment: new processEnvironment(this.class.classLoader.parent)
		]

		processes.push(process)
		kdbAdd("""
			processExec: Process starting:
				ID: $process.id
				Parent ID: $process.parentId
				Terminal ID: $process.terminalId
				User: $process.user
				Path: $process.path
			""")

		try {
			def compiledClass = process.environment.compileClass(path, true)

			compiledClass.getDeclaredConstructor().newInstance(*arguments)
		} catch (ClassNotFoundException | CompilationFailedException | InvocationTargetException exception) {
			processes.remove(process)

			if (exception.class.simpleName == "InvocationTargetException") {
				kdbAdd("processExec: Process failed to start:")

				throw exception
			} else {
				kdbAdd("processExec: Process failed to compile:", ExceptionUtils.getStackTrace(exception))

				return false
			}
		}
	}

	/*
	def namedArguments(Map arguments) {
		kdbAdd("$arguments.a, $arguments.b, $arguments.c, $arguments.d")
	}
	*/

	//TODO
	// - DirectRender masking
	// - DirectRender drawing parts of images
	// - DirectRender moving parts of images
	// - Shared environments handling
	// - Terminals spawning
	// * Processes spawning
	// - Sandboxed classes loading
	// - CoreFoundation framework
	// - CoreGraphics framework
	// - Leaf framework
	// - Base applications
	// * Launch procedure
	// - Kernel panic handling

	static void main(String[] arguments) {
		new Main()
	}
}