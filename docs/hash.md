# Docs for Tez

## hash

### Methods
* `set` - set/changes browser hash-url
* `getChanged` - checks browser hash-url changed reasonly

### Options
* `prefix` - set hash prefix, default "!/#"

### Usage

```javascript

	let hash = new Tez.hashURL();
	
		hash.set('services');

		// hash.getChanged() => true

		hash.set('services');

		// hash.getChanged() => false

```

### Returns

* Nothing returns