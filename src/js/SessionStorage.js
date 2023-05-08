export default class SessionStorage {
	constructor() {

	}

	get(key) {
		return sessionStorage.getItem(key)
	}

	set(key, value) {
		sessionStorage.setItem(key, value)
	}

	keys() {
		const keys = []
		for (let i = 0; i < sessionStorage.length; i++) {
			keys.push(sessionStorage.key(i))
		}
		return keys
	}

	values() {
		const values = []
		for (let i = 0; i < sessionStorage.length; i++) {
			values.push(this.get(sessionStorage.key(i)))
		}
		return values
	}
}
