# Docs for Tez

## DiffManager

### Usage

```javascript

	let obj1 = { x: 0, y: 0.0000000000075 }, obj2 = { ...obj1, z: 3 };

	let diff = Tez.DiffManager(obj1, obj2);
	
	// diff = [ {}, { z : 3 } ];

```

### Returns

* - difference of object inside array