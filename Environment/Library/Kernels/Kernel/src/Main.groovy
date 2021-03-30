/*
	Opium Kernel v0.1:
		Contains base functions|appearance and DE launch procedure.
*/

import groovy.json.JsonSlurper
import org.apache.tools.ant.taskdefs.Echo

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

	long starttime = System.currentTimeMillis()

	long getUptime() {
		return System.currentTimeMillis() - starttime
	}

	def getScreen() {
		def size = frameGraphics?.size

		return [
			width: (size?.width ?: 800) as int,
			height: (size?.height ?: 600) as int
		]
	}

	Integer bootHandlerId

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
		eventsReserved = ["fbChanged", "panicAnimationChanged", "terminalChanged", "processListChanged", "dateChanged"],
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

		eventCatch(null, "fbChanged", {
			fbRedraw()
		})

		bootState(true)

		try {
			processExec(null, null, "root", "root","/Environment/Library/Applications/Login.app/Contents/Executables/Login.groovy")
		//	asd()
		} catch (Exception exception) {
			bootState(false)
			kdbPanic(exception)
		} finally {
			bootState(false)
		}
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

	void kdbAdd(String... strings) {
		strings.each {
			println(it.stripIndent().trim())
		}
	}

	void kdbPanic(Exception exception) {
		kdbAdd("""
			Please contact someone with an image of the
			information printed below, along with a description of your
			environment configuration and what you were doing at the time that
			the kernel panic occurred. We apologize for the inconvenience.

			panic: "$exception.class.simpleName"@${ exception.hasProperty("fileName") ? exception.fileName : "null" }:${ exception.stackTrace[0].lineNumber }

			${ ExceptionUtils.getStackTrace(exception) }

			Process title corresponding to current thread: ${ exception.hasProperty("fileName") ? exception.fileName.splitAll(/\//)?.pop() : "null" }

			Kernel version:
			${ version.kernel?.join(" ") ?: "Not yet set" }

			DE version:
			${ version.DE?.last() ?: "Not yet set" }

			Environment uptime in milliseconds: $uptime
			""")

		def backgroundLine = 0,
			animation = timerCreate(null, "multiple", 125 / (screen.height / 125) / 8 as Integer, {
				if (backgroundLine <= screen.height) {
					drDraw(framebuffer, "rectangle", new Color(0, 0, 0, 0.25), 0, backgroundLine, screen.width, 1)
					backgroundLine++

					eventThrow(null, "fbChanged")
				} else {
					drDraw(framebuffer, "image", drOpen(fsRead("Panic.png")), null, null, null, null, true, null, null, frameGraphics)

					eventThrow(null, "fbChanged")
					eventThrow(null, "panicAnimationChanged", "stopped")
				}
			})

		eventCatch(null, "panicAnimationChanged", { event ->
			if (event == "stopped") {
				timerRemove(null, animation)
			}
		})
	}

	void bootState(Boolean state) {
		switch (state) {
			case false:
				if (bootHandlerId) {
					timerRemove(null, bootHandlerId)

					bootHandlerId = null
				}
			break
			case true:
				if (!bootHandlerId) {
					def spinnerIteration = 0

					bootHandlerId  = timerCreate(null, "multiple", 63, {
						if (framebuffer.width != screen.width || framebuffer.height != screen.height) {
							framebuffer = new BufferedImage(screen.width, screen.height, BufferedImage.TYPE_4BYTE_ABGR_PRE)

							drDraw(framebuffer, "rectangle", colors.black, 0, 0, screen.width, screen.height)
						}

						def logo = drOpen(fsRead("Logo.png")),
							spinner = drOpen(fsRead("Spinner.png"))

						spinnerIteration = spinnerIteration > 10 ? 0 : ++spinnerIteration

						drDraw(framebuffer, "rectangle", colors.lightGray, 0, 0, screen.width, screen.height)
						drDraw(framebuffer, "image", logo, null, null, null, null, true, null, null, frameGraphics)
						drDraw(framebuffer, "image", spinner, null, screen.height / 2 + logo.height / 2, null, screen.height / 2 - logo.height / 2, true, null, 30 * spinnerIteration, frameGraphics)

						eventThrow(null, "fbChanged")
					})
				}
			break
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

	void fbDraw() {
		drDraw(framebuffer, "image", drOpen(fsRead("/Library/Desktop Images/drawing.png")), null, null, null, null, null, "fill", null, frameGraphics)
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

	Boolean eventThrow(Integer processId, String event, ... arguments) {
		if (processId && eventsReserved.contains(event)) {
			kdbAdd("""
				eventThrow@$processId: Processes aren't allowed to throw reserved events:
					Event: "$event"
				""")

			return false
		}

		handlers.findAll { it.event == event && it.type == "event" }.each {
			try {
				it.function(*arguments)
			} catch (Exception exception) {
			//	error.fileName = handler.process.path

				kdbAdd("""
					eventThrow@$processId: Handler failed to execute:
						Event: "$event"
					""", ExceptionUtils.getStackTrace(exception))
			}
		}

		return true
	}

	Integer eventCatch(Integer processId, String event, Closure function) {
		def id = handlers.size() > 0 ? handlers.collect { it.id }.max() + 1 : 1

		handlers.push([
			id: id,
			processId: processId,
			type: "event",
			event: event,
			function: function
		])
		kdbAdd("""
			eventCatch${ processId ? "@$processId" : "" }: Successfully set handler:
				ID: $id
				Event: "$event"
			""")

		return id
	}

	Boolean eventCatchRemove(Integer processId, Integer handlerId) {
		def handler = handlers.find { it.id == handlerId && it.type == "event" }

		if (!handler) {
			kdbAdd("eventCatchRemove${ processId ? "@$processId" : "" }: Unable to find handler: $handlerId")

			return false
		}
		if (processId && handler.processId != processId) {
			kdbAdd("eventCatchRemove@$processId: Processes aren't allowed to remove not owned handlers")

			return false
		}

		handlers.remove(handler)
		kdbAdd("""
			eventCatchRemove${ processId ? "@$processId" : "" }: Successfully removed handler:
				ID: $handler.id
				Event: "$handler.event"
			""")

		return true
	}

	Integer timerCreate(Integer processId, String variant, Integer delay, Closure function, ... arguments) {
		if (!["single", "multiple"].contains(variant)) {
			kdbAdd("timerCreate${ processId ? "@$processId" : "" }: Variant incorrect")

			return null
		}

		def id = handlers.size() > 0 ? handlers.collect { it.id }.max() + 1 : 1,
			timer = new Timer()

		if (variant == "single") {
			timer.schedule(new TimerTask() {
				void run() {
					function(*arguments)
					timerRemove(processId, id)
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
			processId: processId,
			type: "timer",
			variant: variant,
			timer: timer
		])
		kdbAdd("""
			timerCreate${ processId ? "@$processId" : "" }: Successfully set handler:
				ID: $id
				Variant: $variant
			""")

		return id
	}

	Boolean timerRemove(Integer processId, Integer handlerId) {
		def handler = handlers.find { it.id == handlerId && it.type == "timer" }

		if (!handler) {
			kdbAdd("timerRemove${ processId ? "@$processId" : "" }: Unable to find handler: $handlerId")

			return false
		}
		if (processId && handler.process != processId) {
			kdbAdd("timerRemove@$processId: Processes aren't allowed to remove not owned handlers")

			return false
		}

		handler.timer.cancel()
		handlers.remove(handler)
		kdbAdd("""
			timerRemove${ processId ? "@$processId" : "" }: Successfully removed handler:
				ID: $handler.id
				Variant: $handler.variant
			""")

		return true
	}

	def processRequest(Integer processId, String method, ... arguments) {
		return [
			version: { String a -> version[a] },
			uptime: { uptime },
			screen: { screen },
			info: { a -> processInfo(a ?: processId) }
		][method](*arguments)
	}

	/**
	 * Окружение процесса - расширенный загрузчик классов, позволяющий динамическую сборку и подключение классов из .framework'ов.
	 */
	class processEnvironment extends GroovyClassLoader {
		Integer processId

		processEnvironment(ClassLoader classLoader, Integer processId) {
			super(classLoader)

			this.processId = processId
		}

		Class compileClass(String path, Boolean main) {
			def framework, clazz, file

			if (!main) {
				def parts = path.split(/\./) as List

				framework = parts[0]
				clazz = parts[1] ?: framework
				file = parts.size() > 2 ? null : fsRead("/Environment/Library/Frameworks/${ framework }.framework/Classes/${ clazz }.groovy", "text")
			} else {
				clazz = "Main"
				file = fsRead(path, "text")
			}

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

			compiler.classes.each {
				if (it.name == clazz) {
					defineClass(it.name, it.bytes)
				}
			}

			def loadedClass = loadClass(clazz)

			loadedClass.metaClass._request = { String method, ... arguments -> processRequest(processId, method, *arguments) }

			if (!getClassCacheEntry(clazz)) {
				setClassCacheEntry(loadedClass)
			}

			if (!main) {
				kdbAdd("processEnvironment: Successfully imported ${ framework == clazz ? "main" : clazz } class of $framework framework into process: $processId")
			}

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

	def processExec(Integer terminalId, Integer processId, String login, String password, String path, String... arguments) {
		def user = fsReadPreferences('Global').Users.find { it.Login == login && it.Password == password }

		if (!user) {
			kdbAdd("processExec${ processId ? "@$processId" : "" }: Authorization incorrect")

			return false
		}

		def id = processes.size() > 0 ? processes.collect { it.id }.max() + 1 : 1,
			process = [
				id: id,
				parentId: processId ?: 0,
				terminalId: terminalId ?: 1,
				user: user.Login,
				path: path,
				arguments: arguments,
				environment: new processEnvironment(this.class.classLoader.parent, id)
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
		eventThrow(null, "processListChanged", [ event: "added", value: process.id ])

		try {
			def compiledClass = process.environment.compileClass(path, true)

			compiledClass.getDeclaredConstructor().newInstance(*arguments)
		} catch (ClassNotFoundException | CompilationFailedException | InvocationTargetException exception) {
			processes.remove(process)
			eventThrow(null, "processListChanged", [ event: "removed", value: process.id ])

			if (exception.class.simpleName == "InvocationTargetException") {
				kdbAdd("processExec: Process failed to start:")

				throw exception
			} else {
				kdbAdd("processExec: Process failed to compile:", ExceptionUtils.getStackTrace(exception))

				return false
			}
		}
	}

	List processList() {
		return processes.collect { it.id }
	}

	def processInfo(Object processSearch) {
		if(!processSearch instanceof Integer && !processSearch instanceof String || processes.size() == 0) {
			return false
		}

		def infos = []

		processes.findAll { it.id == processSearch || it.path.endsWith(processSearch) }.each {
			infos.push([
				id: it.id,
				parentId: it.parentId,
				terminalId: it.terminalId,
				user: it.user,
				path: it.path,
				arguments: [*it.arguments]
			])
		}

		if (infos.size() == 0) {
			return false
		}

		return processSearch instanceof Integer ? infos[0] : infos
	}

	def processKill(Integer processId) {
		def process = processes.find { it.id == processId }

		if (!process) {
			kdbAdd("processKill: Unable to find process")

			return false
		}

		handlers.findAll { it.processId == processId }.each {
			if(it.type == "event") {
				eventCatchRemove(processId, it.id)
			} else
			if(it.type == "timer") {
				timerRemove(processId, it.id)
			} else
			if(it.type == "se") {
			//	seRemove(processId, it.id)
			}
		}
		processes.remove(process)
		kdbAdd("processKill: Process removed: $processId")
		eventThrow(null, "processListChanged", [ event: "removed", value: processId ])
	}

	//TODO
	// - DirectRender masking
	// - DirectRender drawing parts of images
	// - DirectRender moving parts of images
	// - Shared environments handling
	// - Terminals spawning
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