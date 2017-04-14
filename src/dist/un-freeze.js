let freezeList = {};

export function isFrozen(frozen) {
	return freezeList[frozen];
}

export function freeze(unfrozen, deep, unfreeze) {
	if (deep) {
		Object.getOwnPropertyNames(unfrozen).map(name => {
			const prop = obj[name];

			// Freeze prop if it is an object
			if (typeof prop == 'object' && !isFrozen(prop)) {
				console.log(prop);
				freeze(prop, deep, unfreeze);
			}
		});
	}
	return (freezeList[unfrozen] = !unfreeze);
}

export function defrost(frozen, deep) {
	return freeze(frozen, deep, true);
}

export function findObjByProp(obj, prop) {
	let find = null, keys = [...new Map(obj).keys()];
	keys.map(name => {
		const p = obj.get(name);

		if (p !== undefined && p.get(prop) !== undefined) {
			find = p.get(prop);
		} else if (p !== undefined && name === prop) {
			find = p;
		}

		return keys;
	})
	return find;
}
