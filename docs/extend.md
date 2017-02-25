# Docs for Tez

## extend

### Usage

```javascript

	let obj1 = { x: 0, y: 0.0000000000075 }, obj2 = { ...obj1, z: 3 };

	let diff = Tez.extend(obj1, obj2);
	
	// obj1 = { x: 0, y: 0.0000000000075, z:3 };

```

### Returns

* - extended object