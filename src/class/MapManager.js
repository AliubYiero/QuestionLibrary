export default class MapManager extends Map {
	constructor() {
		super();
	}

	/*
	* 静态方法
	* 将数组转换成Map对象
	* @param array | Array
	* @param arrayAttribute | [ null | String ]
	* @return MapManager
	* */
	static toMap(array, arrayAttribute) {
		const map = new MapManager();
		for (let i = 0; i < array.length; i++) {
			const value = array[i];
			const key = value[arrayAttribute] || i
			console.log(key);
			map.set(key, value)
		}
		return map;
	}

	/*
	* Map对象转换成数组对象
	*  */
	toArray() {
		return Array.from(this.values());
	}
}
