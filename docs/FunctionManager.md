# Docs for Tez

## FunctionManager

### Methods
* `onMessage` - callback when/for changing value
* `run` - run/start function with/out arguments
* `plugin` - plugin for making complex apps
* `get` - get original function manager reference such as (for `Worker` returns `setWorker` function reference)

### Usage

```javascript

	let fnc = new Tez.FunctionManager(function (...args) { console.log('called and args is ', args.join(" ")); });
	
		fnc.run('You', 'are', 'nice', 'guys');

	// Logs: 'called and args is You are nice guys'

```

### Reference
* `LogicManager`
* `CallManager`
* `CompositeManager`

### Returns

* Nothing returns