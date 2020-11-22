/*
	Opium Kernel v0.1:
		Contains base functions|appearance and DE launch procedure.
*/


import org.codehaus.groovy.control.CompilationFailedException

import java.awt.Color
import java.awt.Dimension
import java.awt.Graphics
import java.awt.event.KeyEvent
import java.awt.event.KeyListener
import java.awt.image.BufferedImage
import java.awt.image.ImageObserver
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import javax.imageio.*
import javax.swing.JFrame
import javax.swing.JPanel

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

	def frame = new JFrame(version["DE"][0] as String)
	def frameKeyboard = new frameKeyboardClass()
	def frameGraphics = new frameGraphicsClass()

	def framebuffer = new BufferedImage(screen.width, screen.height, BufferedImage.TYPE_4BYTE_ABGR_PRE)
	def colors = [
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
	]
	def handlers = []
	def eventsReserved = ["fbChanged", "terminalChanged", "processListChanged", "dateChanged"]
	def terminals = []
	def processes = []

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
		fbDraw()
		processExec("/Temporary.groovy")
	}

	class frameKeyboardClass implements KeyListener {
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

	class frameGraphicsClass extends JPanel {
		void paint(Graphics graphics) {
			fbDraw()
			graphics.drawImage(framebuffer, 0, 0, this)
		}
	}

	def getScreen() {
		def size = frameGraphics.size

		return [
			width: (size.width ?: 800) as int,
			height: (size.height ?: 600) as int
		]
	}

	def fsRead(String path, String format = null) {
		def _path = path.startsWith("/") ? "../../../.." + path : this.class.getResource(path).toURI()

		if (format == "text") {
			return Files.readString(_path, StandardCharsets.UTF_8)
		} else {
			def file = new File(_path)

			if (!file.canRead()) {
				println "fsRead: Unable to read file with path: $path"

				return null
			}

			return file
		}
	}

	def fbDraw() {
		if (framebuffer.width != screen.width || framebuffer.height != screen.height) {
			framebuffer = new BufferedImage(screen.width, screen.height, BufferedImage.TYPE_4BYTE_ABGR_PRE)

			drDraw(framebuffer, "rectangle", colors.black, 0, 0, screen.width, screen.height)
		}

		def logo = drOpen(fsRead("Logo.png")),
			load = drOpen(fsRead("Load.png"))

		drDraw(framebuffer, "rectangle", colors.lightGray, 0, 0, screen.width, screen.height)
		drDraw(framebuffer, "image", logo, null, null, null, null, true, null, frameGraphics)
		drDraw(framebuffer, "image", load, null, screen.height / 2 + logo.height / 2, null, screen.height / 2 - logo.height / 2, true, null, frameGraphics)

	//	drDraw(frameBuffer, "image", drOpen(fsRead("/Library/Desktop Images/drawing.png")), null, null, null, null, null, "fill", frameGraphics)
	//	drDraw(frameBuffer, "rectangle", new Color(0, 0, 0, 0.25), 0, 0, screen.width, screen.height)
	//	drDraw(frameBuffer, "image", drOpen(fsRead("Panic.png")), null, null, null, null, true, null, frameGraphics)

	//	frameGraphics.repaint()
	}

	def drCreate(Number width, Number height) {
		return new BufferedImage(width as int, height as int, BufferedImage.TYPE_4BYTE_ABGR_PRE)
	}

	def drOpen(File file) {
		def image = ImageIO.read(file),
			bufferedImage = drCreate(image.width, image.height)

		bufferedImage.graphics.drawImage(image, 0, 0, null)

		return bufferedImage
	}

	def drDraw(BufferedImage bufferedImage, String type, ... arguments) {
		def graphics = bufferedImage.graphics

		//noinspection GroovyAssignabilityCheck
		return [
			rectangle: { Color color, Number x, Number y, Number width, Number height ->
				x ?= 0
				y ?= 0

				graphics.color = color
				graphics.fillRect(x as int, y as int, width as int, height as int)
			},
			image: { BufferedImage _bufferedImage, Number x, Number y, Number width, Number height, Boolean centered, String resizeMode, ImageObserver observer ->
				x ?= 0
				y ?= 0
				width ?= bufferedImage.width
				height ?= bufferedImage.height
				centered ?= false

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

				if (centered) {
					x = x + (width - resizeWidth) / 2
					y = y + (height - resizeHeight) / 2
				}

				graphics.drawImage(_bufferedImage, x as int, y as int, resizeWidth as int, resizeHeight as int, observer)
			}
		][type](*arguments)
	}

	def drClose(BufferedImage bufferedImage) {
		def file = new ByteArrayOutputStream()

		ImageIO.write(bufferedImage, "PNG", file)

		return file
	}

	def processRequest(GroovyClassLoader environment, String method, ... arguments) {
		switch (method) {
			case "import":	return processImport(environment, *arguments)
			case "info":	return processInfo(environment, *arguments)
		}
	}

	/*
	class processEnvironmentClass extends GroovyClassLoader {
		processEnvironmentClass(ClassLoader classLoader = null, String path = null) {
			super(classLoader)

			shouldRecompile = true
		}

		Class parseClass(File file) {
			println "processEnvironment: Trying to parse class: $file.name"

			return parsedClass
		}

		Class findClass(String name) {
			println "processEnvironment: Trying to find class: $name"

			try {
				return super.findClass(name)
			} catch(ClassNotFoundException error) {
				def file = !name.contains('$') ? fsRead("/Environment/Library/Frameworks/${name}.framework/${name}.groovy") : null

				if (file) {
					parseClass(file)

					return super.findClass(name)
				}
			}
		}
	}
	*/

	def processImport(GroovyClassLoader environment, String _class) {
		def classPath = _class.endsWith(".groovy") ? _class : "/Environment/Library/Frameworks/${_class}.framework/${_class}.groovy",
			file = fsRead(classPath)

		if (file) {
			try {
				def parsedClass = environment.parseClass(file)

				parsedClass.metaClass._request = { String method, ... arguments -> return processRequest(environment, method, *arguments) }
				parsedClass.metaClass._import = { ... arguments -> return processRequest(environment, "import", *arguments) }
				parsedClass.metaClass._info = { ... arguments -> return processRequest(environment, "info", *arguments) }

				def name = file.name.replaceAll(/\.groovy$/, "")

				environment.loadedClasses.each {
					it.metaClass[name] = parsedClass
				}

			//	environment.loadClass(name)
			//	environment.setClassCacheEntry(parsedClass)

				def constructor = environment.loadClass(name).getDeclaredConstructor()

				if (constructor) {
					constructor.newInstance()
				}

				return true
			} catch(Exception error) {
				println error

				return false
			}
		} else {
			return false
		}
	}

	def processInfo(GroovyClassLoader environment) {
		println(environment.loadedClasses)
	}

	def processExec(String path) {
		def environment = new GroovyClassLoader(this.class.classLoader)

		processImport(environment, path)
	}

	/*
	def namedArguments(Map arguments) {
		println "$arguments.a, $arguments.b, $arguments.c, $arguments.d"
	}
	*/

	//TODO
	// - DirectRender masking
	// - DirectRender drawing rotated images
	// - DirectRender drawing parts of images
	// - DirectRender moving parts of images
	// - Events handling
	// - Timers handling
	// - Shared environments handling
	// * Boot animation
	// - Terminals spawning
	// * Processes spawning
	// * External classes loading
	// * Sandboxed classes loading
	// - CoreFoundation framework
	// - CoreGraphics framework
	// - Leaf framework
	// - Base applications
	// * Launch procedure

	static void main(String[] arguments) {
		new Main()
	}
}