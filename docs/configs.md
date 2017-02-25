# Docs for Tez

## configs

### Usage

```javascript

	import { MAX_WORKER_THREAD, CURRENT_WORKER_THREAD, LIST_WORKER_THREAD, ARRAY_SLICE, FUNC_STR, WORKER_SUPPORT, ROOT } from './configs';
	
	// MAX_WORKER_THREAD = Max WebWorker thread, you can change that from configs.js
	// CURRENT_WORKER_THREAD = Cached current WebWorker thread
	// LIST_WORKER_THREAD = List of WebWorker threads
	// ARRAY_SLICE = Array.prototype.slice cache for performance optimization
	// FUNC_STR = Object.prototype.toString cache for performance optimization
	// WORKER_SUPPORT = Checks WebWorker support, if it returns true this makes setWorker else function doesn't makes sense
	// ROOT = global Window object

```

### Returns

* - configuration of Tez