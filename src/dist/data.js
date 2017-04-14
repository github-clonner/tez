import * as ObjectMod from './un-freeze';

let freezedMapProps = ["set", "clear", "delete"];
let oldMapProto = Map.prototype;
	freezedMapProps.map(prop => {
		let oldMapProp = oldMapProto[prop];
		oldMapProto[prop] = function (...args) {
			if (ObjectMod.isFrozen(this)) {
			return this;
			}
			oldMapProp.call(this, ...args);
			return this;
		}
	});

class Data {
	static toMap(data) {
		let _data = new Map();
		for (let p in data) {
			if (typeof data[p] === "object" && !Array.isArray(data[p]) && data[p].size === undefined) {
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
	constructor(data = {}) {
		this.data = Data.toMap(data);
		return this.freeze();
	}
	get size () {
		return this.data.size;
	}
	createValue (property, value) {
		return Data.createValue(property, value);
	}
	recursiveMatch(property, val) {
		let getLastPropV = property.pop();
		if (typeof(property) === "object") {
			let dataMatch = ObjectMod.findObjByProp(this.data, getLastPropV);
			if (dataMatch && val !== undefined) {
				return dataMatch.set(getLastPropV, val);
			} else {
				return dataMatch;
			}
		}
		return this.data.get(property);
	}
	free () {
		ObjectMod.defrost(this.data, true);
		return this;
	}
	freeze () {
		ObjectMod.freeze(this.data, true);
		return this;
	}
	set(property, value) {
		this.free();
		if (typeof(property) === "string") {
			this.data.set(property, value);
		} else if (Array.isArray(property)) {
			this.recursiveMatch(property, value);
		}
		this.freeze();
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
