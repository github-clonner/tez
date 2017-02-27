# Docs for Tez

## Data

### Methods
* `set` - set an value by property
* `get` - get an value by property
* `has` - checks that property exist
* `createValue` - same as `Static Methods#createValue`

### Static Methods
* `Tez.Data.toMap({x:0})` - converts to `new Map().set('x', 0)`
* `Tez.Data.createValue` - creates object value by given arguments

### Usage

```javascript

	let node = new Tez.Data({x:0,y:1,z:{p:5}});
	let attrPack = attrs(node);
	// attrPack = '{"id":"node"}'

```

### Returns

* - Nothing returns