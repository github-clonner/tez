class Data {
	static toMap(data) {
		let _data = new Map();
		for (let p in data) {
			if (typeof data[p] === "object") {
				_data.set(p, Data.toMap(data[p]));
			} else {
				_data.set(p, data[p]);
			}
		}
		return _data;
	}
	static createValue (property, value) {
		if (typeof property === "object") {
			return Data.toMap(property);
		} else if (typeof property === "string" && value !== undefined) {
			return new Map().set(property, value);
		}
	}
	constructor(data) {
		this.data = Data.toMap(data);
		return this;
	}
	createValue (property, value) {
		return Data.createValue(property, value);
	}
	recursiveMatch(property, val) {
		if (typeof(property) === "object") {
			return property.reduce((prev, key, i) => {
				if (prev.has(key)) {
					if (val !== undefined) {
						return prev.set(key, val);
					} else {
						return prev.get(key);
					}
				}
				return prev;
			}, this.data);
		}
		return this.data[property] || null;
	}
	set(property, value) {
		if (typeof(property) === "string") {
			this.data[property] = value;
		} else if (Array.isArray(property)) {
			this.recursiveMatch(property, value);
		}
		return this;
	}
	get(property) {
		if (typeof property === "object") {
			return this.recursiveMatch(property);
		} else {
			return this.data.get(property);
		}
		return this;
	}
	has(property) {
		return this.get(property) !== undefined;
	}
}

export default Data;
