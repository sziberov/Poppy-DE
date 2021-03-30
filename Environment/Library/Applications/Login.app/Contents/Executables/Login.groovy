import static java.lang.Math.*
import Leaf

class Main {
	Main() {
		println(max(16, 64))
		method()
	}

	def method() {
		println("Class Method")
		Leaf.method()
		new Leaf().dynamicMethod()
		println(new LFTemporary().methodDynamic())
		println(_request("info"))
	}
}